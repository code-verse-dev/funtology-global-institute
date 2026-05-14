import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ApiCourse } from "@/redux/services/apiSlices/courseSlice";
import { useGetCoursesQuery } from "@/redux/services/apiSlices/courseSlice";
import {
  type ApiLearner,
  type AssignedCourseRow,
  type LearnersPaginated,
  useAssignCourseToLearnerMutation,
  useGetAssignedCoursesQuery,
  useGetLearnersQuery,
  useInviteLearnerMutation,
  useRemoveCourseFromLearnerMutation,
  useUpdateLearnerNameMutation,
} from "@/redux/services/apiSlices/learnerSlice";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Mail,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 10;


function coursesFromGetAllResponse(res: unknown): ApiCourse[] {
  if (!res || typeof res !== "object") return [];
  const r = res as { data?: unknown };
  const d = r.data;
  if (Array.isArray(d)) return d as ApiCourse[];
  if (d && typeof d === "object") {
    const o = d as { docs?: unknown[]; courses?: unknown[] };
    if (Array.isArray(o.docs)) return o.docs as ApiCourse[];
    if (Array.isArray(o.courses)) return o.courses as ApiCourse[];
  }
  return [];
}

function assignedRowsFromResponse(data: unknown): AssignedCourseRow[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as AssignedCourseRow[];
  if (typeof data === "object") {
    const o = data as { courses?: AssignedCourseRow[]; docs?: AssignedCourseRow[] };
    return o.courses ?? o.docs ?? [];
  }
  return [];
}

function courseIdFromAssignedRow(row: AssignedCourseRow): string | undefined {
  if (row.courseId) return row.courseId;
  if (typeof row.course === "string") return row.course;
  if (row.course && typeof row.course === "object" && "_id" in row.course) return (row.course as ApiCourse)._id;
  return undefined;
}

function courseTitleFromRow(row: AssignedCourseRow): string {
  if (row.course && typeof row.course === "object" && "title" in row.course) return (row.course as ApiCourse).title;
  return "Course";
}

function learnerDisplayName(learner: ApiLearner): string {
  const n = [learner.firstName, learner.lastName].filter(Boolean).join(" ").trim();
  return n || learner.email || "Learner";
}

function initials(learner: ApiLearner): string {
  const n = learnerDisplayName(learner);
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return n.slice(0, 2).toUpperCase() || "?";
}

function statusBadgeVariant(status: string | undefined) {
  const s = (status || "").toLowerCase();
  if (s === "completed" || s === "active") return "secondary" as const;
  if (s === "invited" || s === "pending") return "default" as const;
  return "outline" as const;
}

function formatStatus(status: string | undefined) {
  if (!status) return "—";
  return status.replace(/-/g, " ");
}

function rtkErrorMessage(err: unknown, fallback: string) {
  if (err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data) {
    return String((err.data as { message: string }).message);
  }
  return fallback;
}

const OrganizationLearners = () => {
  const [keywordInput, setKeywordInput] = useState("");
  const [query, setQuery] = useState<{ page: number; limit: number; keyword?: string }>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [coursesLearner, setCoursesLearner] = useState<ApiLearner | null>(null);
  const [pendingCourseIds, setPendingCourseIds] = useState<string[]>([]);

  const [nameEditLearner, setNameEditLearner] = useState<ApiLearner | null>(null);
  const [nameEditForm, setNameEditForm] = useState({ firstName: "", lastName: "" });

  const { data: listRes, isLoading, isFetching, isError, error, refetch } = useGetLearnersQuery(query);
  const { data: allCoursesRes, isLoading: coursesLoading } = useGetCoursesQuery({});
  const { data: assignedRes, isLoading: assignedLoading } = useGetAssignedCoursesQuery(
    { learnerId: coursesLearner?._id ?? "" },
    { skip: !coursesLearner?._id }
  );
  const [inviteLearner, { isLoading: inviting }] = useInviteLearnerMutation();
  const [assignCourses, { isLoading: assigning }] = useAssignCourseToLearnerMutation();
  const [removeCourse, { isLoading: removingCourse }] = useRemoveCourseFromLearnerMutation();
  const [updateLearnerName, { isLoading: updatingName }] = useUpdateLearnerNameMutation();
  const pageData = useMemo(() => {
    const d = listRes?.data as LearnersPaginated | ApiLearner[] | undefined;
    if (!d) return undefined;
    if (Array.isArray(d)) {
      return {
        docs: d,
        totalDocs: d.length,
        totalPages: 1,
        page: 1,
        limit: PAGE_SIZE,
      };
    }
    return d;
  }, [listRes?.data]);

  const learners = pageData?.docs ?? [];
  const totalPages = pageData?.totalPages ?? 1;
  const totalDocs = pageData?.totalDocs ?? 0;

  const allCourses = useMemo(() => coursesFromGetAllResponse(allCoursesRes), [allCoursesRes]);
  const assignedRows = useMemo(() => assignedRowsFromResponse(assignedRes?.data), [assignedRes?.data]);
  const assignedCourseIds = useMemo(() => {
    const ids = new Set<string>();
    for (const row of assignedRows) {
      const id = courseIdFromAssignedRow(row);
      if (id) ids.add(id);
    }
    return ids;
  }, [assignedRows]);

  const assignableCourses = useMemo(
    () => allCourses.filter((c) => c._id && !assignedCourseIds.has(c._id)),
    [allCourses, assignedCourseIds]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    setPendingCourseIds([]);
  }, [coursesLearner?._id, assignedRows]);

  const onKeywordChange = (value: string) => {
    setKeywordInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery((q) => ({
        ...q,
        page: 1,
        keyword: value.trim() || undefined,
      }));
    }, 400);
  };

  const listErrorMessage =
    isError && error && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
      ? String((error.data as { message: string }).message)
      : "Could not load learners.";

  const openCoursesDialog = (learner: ApiLearner) => {
    setCoursesLearner(learner);
  };

  const togglePendingCourse = (courseId: string, checked: boolean) => {
    setPendingCourseIds((prev) => {
      if (checked) return prev.includes(courseId) ? prev : [...prev, courseId];
      return prev.filter((id) => id !== courseId);
    });
  };

  const submitInvite = async () => {
    const email = inviteForm.email.trim();
    const firstName = inviteForm.firstName.trim();
    const lastName = inviteForm.lastName.trim();
    const phoneNumber = inviteForm.phoneNumber.trim();
    if (!email || !firstName || !lastName || !phoneNumber) {
      toast.error("Please fill in email, first name, last name, and phone number.");
      return;
    }
    try {
      const res = await inviteLearner({
        email,
        firstName,
        lastName,
        phoneNumber
      }).unwrap();
      if (res.status) {
        toast.success(res.message || "Invitation sent.");
        setInviteOpen(false);
        setInviteForm({
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
        });
      } else {
        toast.error(res.message || "Could not invite learner.");
      }
    } catch (err: unknown) {
      toast.error(rtkErrorMessage(err, "Could not invite learner."));
    }
  };

  const submitAssignCourses = async () => {
    if (!coursesLearner || pendingCourseIds.length === 0) return;
    try {
      const res = await assignCourses({ learnerId: coursesLearner._id, courseIds: pendingCourseIds }).unwrap();
      if (res.status) {
        toast.success(res.message || "Courses assigned.");
        setPendingCourseIds([]);
      } else {
        toast.error(res.message || "Could not assign courses.");
      }
    } catch (err: unknown) {
      toast.error(rtkErrorMessage(err, "Could not assign courses."));
    }
  };

  const onRemoveAssigned = async (courseId: string) => {
    if (!coursesLearner) return;
    try {
      const res = await removeCourse({ learnerId: coursesLearner._id, courseId }).unwrap();
      if (res.status) {
        toast.success(res.message || "Course removed from learner.");
      } else {
        toast.error(res.message || "Could not remove course.");
      }
    } catch (err: unknown) {
      toast.error(rtkErrorMessage(err, "Could not remove course."));
    }
  };

  const openNameEditDialog = (learner: ApiLearner) => {
    setNameEditLearner(learner);
    setNameEditForm({
      firstName: (learner.firstName ?? "").trim(),
      lastName: (learner.lastName ?? "").trim(),
    });
  };

  const submitUpdateName = async () => {
    if (!nameEditLearner) return;
    const firstName = nameEditForm.firstName.trim();
    const lastName = nameEditForm.lastName.trim();
    if (!firstName || !lastName) {
      toast.error("Please enter first and last name.");
      return;
    }
    const learnerId = nameEditLearner._id;
    try {
      const res = await updateLearnerName({
        learnerId,
        firstName,
        lastName,
      }).unwrap();
      if (res.status) {
        toast.success(res.message || "Name updated.");
        setNameEditLearner(null);
        setCoursesLearner((prev) =>
          prev && prev._id === learnerId ? { ...prev, firstName, lastName } : prev,
        );
      } else {
        toast.error(res.message || "Could not update name.");
      }
    } catch (err: unknown) {
      toast.error(rtkErrorMessage(err, "Could not update name."));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, or email"
            className="pl-10"
            value={keywordInput}
            onChange={(e) => onKeywordChange(e.target.value)}
          />
        </div>
        <Button variant="secondary" size="sm" onClick={() => setInviteOpen(true)}>
          <Mail className="w-4 h-4 mr-2" />
          Invite learner
        </Button>
      </div>

      {isError && (
        <Card className="border-destructive/50">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-destructive">{listErrorMessage}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-16">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading learners…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right min-w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {learners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                      {query.keyword ? "No learners match your search." : "No learners yet. Invite someone to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  learners.map((learner) => (
                    <TableRow key={learner._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {initials(learner)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{learnerDisplayName(learner)}</p>
                            <p className="text-xs text-muted-foreground">{learner.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {learner.assignments?.length ?? "—"}
                      </TableCell>
                  
                      <TableCell>
                        <Badge variant={statusBadgeVariant(learner.status)} className="gap-1 capitalize">
                          {learner.status === "active" ? <Clock className="w-3 h-3" /> : null}
                          {learner.status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : null}
                          {learner.status === "invited" ? <Mail className="w-3 h-3" /> : null}
                          {formatStatus(learner.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            aria-label="Edit learner name"
                            onClick={() => openNameEditDialog(learner)}
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                            <span className="hidden sm:inline">Edit name</span>
                            <span className="sm:hidden">Name</span>
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => openCoursesDialog(learner)}>
                            <BookOpen className="w-3.5 h-3.5" />
                            Courses
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!isLoading && totalDocs > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            {totalDocs} learner{totalDocs === 1 ? "" : "s"}
            {isFetching ? " · Updating…" : ""}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={query.page <= 1 || isFetching}
              onClick={() => setQuery((q) => ({ ...q, page: Math.max(1, q.page - 1) }))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span>
              Page {query.page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={query.page >= totalPages || isFetching}
              onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Invite learner</DialogTitle>
            <DialogDescription>Send an invitation to join your organization on FGI.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                autoComplete="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="invite-first">First name</Label>
                <Input
                  id="invite-first"
                  value={inviteForm.firstName}
                  onChange={(e) => setInviteForm((f) => ({ ...f, firstName: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-last">Last name</Label>
                <Input
                  id="invite-last"
                  value={inviteForm.lastName}
                  onChange={(e) => setInviteForm((f) => ({ ...f, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invite-phone">Phone</Label>
              <Input
                id="invite-phone"
                type="tel"
                value={inviteForm.phoneNumber}
                onChange={(e) => setInviteForm((f) => ({ ...f, phoneNumber: e.target.value }))}
              />
            </div>
          
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="secondary" disabled={inviting} onClick={submitInvite}>
              {inviting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Send invite
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!nameEditLearner}
        onOpenChange={(open) => {
          if (!open) setNameEditLearner(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Update learner name</DialogTitle>
            <DialogDescription>
              {nameEditLearner ? (
                <>
                  Change the display name for <span className="font-medium text-foreground">{nameEditLearner.email}</span>.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="rename-first">First name</Label>
                <Input
                  id="rename-first"
                  autoComplete="given-name"
                  value={nameEditForm.firstName}
                  onChange={(e) => setNameEditForm((f) => ({ ...f, firstName: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rename-last">Last name</Label>
                <Input
                  id="rename-last"
                  autoComplete="family-name"
                  value={nameEditForm.lastName}
                  onChange={(e) => setNameEditForm((f) => ({ ...f, lastName: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setNameEditLearner(null)}>
              Cancel
            </Button>
            <Button type="button" variant="secondary" disabled={updatingName} onClick={submitUpdateName}>
              {updatingName ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                "Save name"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!coursesLearner}
        onOpenChange={(open) => {
          if (!open) {
            setCoursesLearner(null);
            setPendingCourseIds([]);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-heading">Learner courses</DialogTitle>
            <DialogDescription>
              {coursesLearner ? (
                <>
                  View and remove assigned courses, or assign additional courses for{" "}
                  <span className="font-medium text-foreground">{learnerDisplayName(coursesLearner)}</span>.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto flex-1 min-h-0 pr-1">
            <div>
              <h4 className="text-sm font-medium mb-2">Assigned courses</h4>
              {assignedLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading assignments…
                </div>
              ) : assignedRows.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No courses assigned yet.</p>
              ) : (
                <ul className="space-y-2 rounded-md border border-border divide-y">
                  {assignedRows.map((row, idx) => {
                    const cid = courseIdFromAssignedRow(row);
                    const title = courseTitleFromRow(row);
                    return (
                      <li key={cid ?? row._id ?? idx} className="flex items-center justify-between gap-2 p-3 text-sm">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{title}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive shrink-0"
                          disabled={!cid || removingCourse}
                          title="Remove assignment"
                          onClick={() => cid && onRemoveAssigned(cid)}
                        >
                          {removingCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Assign courses</h4>
              {coursesLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading course catalog…
                </div>
              ) : assignableCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground">All available courses are already assigned.</p>
              ) : (
                <ul className="space-y-2 max-h-48 overflow-y-auto rounded-md border border-border p-2">
                  {assignableCourses.map((course) => (
                    <li key={course._id} className="flex items-start gap-3 py-1">
                      <Checkbox
                        id={`assign-${course._id}`}
                        checked={pendingCourseIds.includes(course._id)}
                        onCheckedChange={(c) => togglePendingCourse(course._id, c === true)}
                      />
                      <label htmlFor={`assign-${course._id}`} className="text-sm leading-tight cursor-pointer flex-1">
                        <span className="font-medium">{course.title}</span>
                        {course.ongoingHours ? (
                          <span className="text-muted-foreground text-xs block">{course.ongoingHours} Ongoing hours</span>
                        ) : null}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <Button
                type="button"
                className="mt-3 w-full sm:w-auto"
                variant="secondary"
                disabled={pendingCourseIds.length === 0 || assigning}
                onClick={submitAssignCourses}
              >
                {assigning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Assigning…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Assign selected ({pendingCourseIds.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default OrganizationLearners;
