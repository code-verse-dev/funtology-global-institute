import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useApproveNonprofitOrganizationRequestMutation,
  useGetNonprofitOrganizationRequestsQuery,
  useRejectNonprofitOrganizationRequestMutation,
} from "@/redux/services/apiSlices/nonprofitAdminApiSlice";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type OrgRef = {
  firstName?: string;
  lastName?: string;
  email?: string;
  organizationName?: string;
};

type CourseRef = { title?: string };

type RequestDoc = {
  _id?: string;
  status?: string;
  totalLearners?: number;
  createdAt?: string;
  organization?: OrgRef | OrgRef[];
  courseIds?: (CourseRef | string)[];
  /** Populated course docs from API (preferred for titles) */
  courses?: CourseRef[];
};

function orgDisplay(o: unknown): string {
  if (!o || typeof o !== "object") return "—";
  const org = Array.isArray(o) ? o[0] : o;
  if (!org || typeof org !== "object") return "—";
  const r = org as OrgRef;
  const name = [r.firstName, r.lastName].filter(Boolean).join(" ").trim();
  if (r.organizationName?.trim()) return r.organizationName.trim();
  if (name) return name;
  return r.email ?? "—";
}

function orgEmail(o: unknown): string {
  if (!o || typeof o !== "object") return "—";
  const org = Array.isArray(o) ? o[0] : o;
  if (!org || typeof org !== "object") return "—";
  return (org as OrgRef).email ?? "—";
}

function titlesFromCourseList(list: unknown): string[] {
  if (!Array.isArray(list) || list.length === 0) return [];
  return list
    .map((c) => {
      if (c && typeof c === "object" && "title" in c) return String((c as CourseRef).title ?? "").trim();
      return "";
    })
    .filter(Boolean);
}

/** Prefer populated `courses`; fall back to embedded titles on `courseIds` if any. */
function requestCourseTitles(doc: RequestDoc): string[] {
  const fromCourses = titlesFromCourseList(doc.courses);
  if (fromCourses.length > 0) return fromCourses;
  return titlesFromCourseList(doc.courseIds);
}

function requestCourseIdStrings(doc: RequestDoc): string[] {
  if (!Array.isArray(doc.courseIds) || doc.courseIds.length === 0) return [];
  return doc.courseIds.filter((c): c is string => typeof c === "string" && c.length > 0);
}

function requestHasCourses(doc: RequestDoc): boolean {
  return requestCourseTitles(doc).length > 0 || requestCourseIdStrings(doc).length > 0;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

const PAGE_SIZE = 10;

export default function AdminNonprofitOrganizationRequests() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("PENDING");
  const [keywordInput, setKeywordInput] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [coursesDialogDoc, setCoursesDialogDoc] = useState<RequestDoc | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keywordInput.trim()), 400);
    return () => clearTimeout(t);
  }, [keywordInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, status, fromDate, toDate]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetNonprofitOrganizationRequestsQuery({
    page,
    limit: PAGE_SIZE,
    status: status === "ALL" ? undefined : status,
    keyword: debouncedKeyword || undefined,
    from: fromDate || undefined,
    to: toDate || undefined,
  });

  const [approve, { isLoading: approving }] = useApproveNonprofitOrganizationRequestMutation();
  const [reject, { isLoading: rejecting }] = useRejectNonprofitOrganizationRequestMutation();
  const busy = approving || rejecting;

  const envelope = data?.data as
    | {
        docs?: RequestDoc[];
        totalDocs?: number;
        totalPages?: number;
        hasNextPage?: boolean;
        hasPrevPage?: boolean;
      }
    | undefined;

  const docs = Array.isArray(envelope?.docs) ? envelope.docs : [];
  const totalPages = typeof envelope?.totalPages === "number" ? envelope.totalPages : 1;
  const totalDocs = typeof envelope?.totalDocs === "number" ? envelope.totalDocs : 0;

  const listError =
    isError && error && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
      ? String((error.data as { message: string }).message)
      : "Could not load organization requests.";

  const onApprove = async (id: string) => {
    try {
      const res = await approve({ id }).unwrap();
      if (res?.status) toast.success(res?.message || "Request approved.");
      else toast.error(res?.message || "Could not approve.");
      void refetch();
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "data" in e && e.data && typeof e.data === "object" && "message" in e.data
          ? String((e.data as { message: string }).message)
          : "Could not approve.";
      toast.error(msg);
    }
  };

  const onReject = async (id: string) => {
    try {
      const res = await reject({ id }).unwrap();
      if (res?.status) toast.success(res?.message || "Request rejected.");
      else toast.error(res?.message || "Could not reject.");
      void refetch();
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "data" in e && e.data && typeof e.data === "object" && "message" in e.data
          ? String((e.data as { message: string }).message)
          : "Could not reject.";
      toast.error(msg);
    }
  };

  const dialogTitles = coursesDialogDoc ? requestCourseTitles(coursesDialogDoc) : [];
  const dialogCourseIds = coursesDialogDoc ? requestCourseIdStrings(coursesDialogDoc) : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-bold">Non-profit organization requests</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review course access requests from non-profit organizations. Approving creates their subscription without payment.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="np-req-search">Search</Label>
              <Input
                id="np-req-search"
                placeholder="Organization, name, or email…"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="np-from">From</Label>
              <Input id="np-from" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="np-to">To</Label>
              <Input id="np-to" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {totalDocs} request{totalDocs === 1 ? "" : "s"}
            {isFetching && !isLoading ? <Loader2 className="inline w-3 h-3 ml-2 animate-spin" /> : null}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isError ? (
            <p className="p-6 text-sm text-destructive">{listError}</p>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              Loading requests…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Contact email</TableHead>
                  <TableHead>Learners</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap">Courses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No requests match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  docs.map((r) => {
                    const titles = requestCourseTitles(r);
                    const idOnly = requestCourseIdStrings(r);
                    const courseCount = titles.length > 0 ? titles.length : idOnly.length;
                    return (
                      <TableRow key={r._id ?? String(r.createdAt)}>
                        <TableCell className="font-medium">{orgDisplay(r.organization)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{orgEmail(r.organization)}</TableCell>
                        <TableCell>{typeof r.totalLearners === "number" ? r.totalLearners : "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {r.status ?? "—"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(r.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={!requestHasCourses(r)}
                            onClick={() => setCoursesDialogDoc(r)}
                          >
                            {courseCount > 0 ? `View courses (${courseCount})` : "View courses"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          {r.status === "PENDING" && r._id ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                disabled={busy}
                                onClick={() => void onApprove(r._id!)}
                              >
                                Approve
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={busy}
                                onClick={() => void onReject(r._id!)}
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && !isLoading && !isError ? (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            type="button"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            type="button"
            disabled={page >= totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}

      <Dialog
        open={coursesDialogDoc !== null}
        onOpenChange={(open) => {
          if (!open) setCoursesDialogDoc(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Requested courses</DialogTitle>
            <DialogDescription>
              {coursesDialogDoc
                ? `${orgDisplay(coursesDialogDoc.organization)} · ${orgEmail(coursesDialogDoc.organization)}`
                : null}
            </DialogDescription>
          </DialogHeader>
          {dialogTitles.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1.5 text-sm max-h-[50vh] overflow-y-auto">
              {dialogTitles.map((title, idx) => (
                <li key={`${coursesDialogDoc?._id ?? "row"}-${idx}`}>{title}</li>
              ))}
            </ul>
          ) : dialogCourseIds.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              Course titles are not available. IDs:{" "}
              <span className="font-mono text-xs break-all">{dialogCourseIds.join(", ")}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No courses on this request.</p>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setCoursesDialogDoc(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
