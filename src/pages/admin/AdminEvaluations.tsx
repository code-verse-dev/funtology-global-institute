import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAdminEvaluationsQuery } from "@/redux/services/apiSlices/evaluationSlice";
import { motion } from "framer-motion";
import { ClipboardList, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PAGE_LIMIT = 10;

type PopulatedUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
};

type PopulatedCourse = { title?: string };

type PopulatedLesson = {
  type?: string;
  order?: number;
  course?: PopulatedCourse;
  lesson?: { title?: string };
};

export type AdminEvaluationDoc = {
  _id?: string;
  createdAt?: string;
  user?: PopulatedUser | string;
  lesson?: PopulatedLesson | string;
  scaleGainedNewKnowledge?: number;
  scaleApplyRealWorld?: number;
  scaleImprovedUnderstanding?: number;
  scaleInstructionClear?: number;
  scaleWouldRecommend?: number;
};

function isPopulatedUser(u: AdminEvaluationDoc["user"]): u is PopulatedUser {
  return u != null && typeof u === "object" && ("email" in u || "firstName" in u || "lastName" in u);
}

function isPopulatedLesson(l: AdminEvaluationDoc["lesson"]): l is PopulatedLesson {
  return l != null && typeof l === "object" && ("type" in l || "order" in l || "course" in l);
}

function learnerDisplayName(user: PopulatedUser | undefined): string {
  if (!user) return "—";
  const parts = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (parts) return parts;
  return user.email ?? "—";
}

function avgScore(doc: AdminEvaluationDoc): number | null {
  const nums = [
    doc.scaleGainedNewKnowledge,
    doc.scaleApplyRealWorld,
    doc.scaleImprovedUnderstanding,
    doc.scaleInstructionClear,
    doc.scaleWouldRecommend,
  ].filter((n): n is number => typeof n === "number" && n >= 1 && n <= 5);
  if (nums.length === 0) return null;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

export default function AdminEvaluations() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [lessonIdInput, setLessonIdInput] = useState("");
  const [debouncedLessonId, setDebouncedLessonId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedKeyword(keyword.trim()), 400);
    return () => window.clearTimeout(t);
  }, [keyword]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedLessonId(lessonIdInput.trim()), 400);
    return () => window.clearTimeout(t);
  }, [lessonIdInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, debouncedLessonId, fromDate, toDate]);

  const queryArg = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(debouncedKeyword ? { keyword: debouncedKeyword } : {}),
      ...(debouncedLessonId ? { lessonId: debouncedLessonId } : {}),
      ...(fromDate ? { from: fromDate } : {}),
      ...(toDate ? { to: toDate } : {}),
    }),
    [page, debouncedKeyword, debouncedLessonId, fromDate, toDate],
  );

  const { data: evalRes, isLoading, isFetching, isError } = useGetAdminEvaluationsQuery(queryArg);

  const paginated = evalRes?.data as
    | {
        docs?: AdminEvaluationDoc[];
        totalDocs?: number;
        totalPages?: number;
        hasNextPage?: boolean;
        hasPrevPage?: boolean;
        page?: number;
      }
    | undefined;

  const docs: AdminEvaluationDoc[] = Array.isArray(paginated?.docs) ? paginated.docs : [];
  const totalDocs = typeof paginated?.totalDocs === "number" ? paginated.totalDocs : 0;
  const totalPages = typeof paginated?.totalPages === "number" ? paginated.totalPages : 0;
  const hasNextPage = Boolean(paginated?.hasNextPage);
  const hasPrevPage = Boolean(paginated?.hasPrevPage);


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="font-heading flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-secondary" aria-hidden />
              Learner evaluations
            </CardTitle>
           
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="eval-search" className="text-xs text-muted-foreground">
                Keyword
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="eval-search"
                  placeholder="Search by learner name or email…"
                  className="pl-9"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  aria-label="Search evaluations"
                />
              </div>
            </div>
         
            <div className="space-y-2">
              <Label htmlFor="eval-from" className="text-xs text-muted-foreground">
                From (UTC date)
              </Label>
              <Input
                id="eval-from"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eval-to" className="text-xs text-muted-foreground">
                To (UTC date)
              </Label>
              <Input
                id="eval-to"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isError ? (
            <p className="px-6 py-8 text-center text-sm text-destructive">Could not load evaluations.</p>
          ) : (
            <div className="relative min-h-[140px]">
              {(isLoading || isFetching) && (
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-background/60">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Loading evaluations…</span>
                </div>
              )}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[48px]">#</TableHead>
                      <TableHead>Learner</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className="text-center">Scores (1–5)</TableHead>
                      <TableHead className="text-center">Avg</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {docs.length === 0 && !isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                          No evaluations found for these filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      docs.map((doc, idx) => {
                        const serial = (page - 1) * PAGE_LIMIT + idx + 1;
                        const user = isPopulatedUser(doc.user) ? doc.user : undefined;
                        const lesson = isPopulatedLesson(doc.lesson) ? doc.lesson : undefined;
                        const courseTitle =
                          lesson?.course && typeof lesson.course === "object"
                            ? lesson.course.title ?? "—"
                            : "—";
                        const lessonLabel = lesson?.lesson?.title ?? "—";
                          
                        const created = doc.createdAt ? new Date(doc.createdAt).toLocaleString() : "—";
                        const avg = avgScore(doc);
                        const scores = [
                          doc.scaleGainedNewKnowledge,
                          doc.scaleApplyRealWorld,
                          doc.scaleImprovedUnderstanding,
                          doc.scaleInstructionClear,
                          doc.scaleWouldRecommend,
                        ];
                        const scoreStr = scores.every((n) => typeof n === "number")
                          ? scores.join(" · ")
                          : "—";

                        return (
                          <TableRow key={doc._id ?? `eval-${page}-${idx}`}>
                            <TableCell className="tabular-nums text-sm font-medium text-muted-foreground">
                              {serial}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-foreground">{learnerDisplayName(user)}</div>
                              {user?.email ? (
                                <div className="text-xs text-muted-foreground break-all">{user.email}</div>
                              ) : null}
                              {user?.role ? (
                                <Badge variant="outline" className="mt-1 text-xs capitalize">
                                  {user.role}
                                </Badge>
                              ) : null}
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <span className="line-clamp-2 text-sm" title={courseTitle}>
                                {courseTitle}
                              </span>
                            </TableCell>
                            <TableCell className="text-center font-mono text-xs tabular-nums text-foreground">
                              {scoreStr}
                            </TableCell>
                            <TableCell className="text-center tabular-nums text-sm font-medium">
                              {avg != null ? avg.toFixed(1) : "—"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{created}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 0 ? (
                <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    Page <span className="font-medium text-foreground">{page}</span> of{" "}
                    <span className="font-medium text-foreground">{totalPages}</span>
                    <span className="mx-2">·</span>
                    <span className="font-medium text-foreground">{totalDocs}</span> total
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!hasPrevPage || isLoading}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!hasNextPage || isLoading}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
