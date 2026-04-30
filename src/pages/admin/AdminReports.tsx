import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Download, Loader2, Search } from "lucide-react";
import { useExportResponsesXlsxMutation, useGetAllResponsesQuery } from "@/redux/services/apiSlices/quizResponseSlice";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type QuizResponseDoc = {
  _id?: string;
  lesson?: {
    _id?: string;
    course?: {
      _id?: string;
      title?: string;
      sortOrder?: number;
    };
  };
  user?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  score?: number;
  percentage?: number;
  result?: string;
  createdAt?: string;
  totalQuestions?: number;
};

const PAGE_LIMIT = 10;

const AdminReports = () => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedKeyword(keyword.trim()), 350);
    return () => window.clearTimeout(t);
  }, [keyword]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  const queryArg = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(debouncedKeyword ? { keyword: debouncedKeyword } : {}),
    }),
    [page, debouncedKeyword],
  );

  const { data: responsesData, isLoading, isFetching } = useGetAllResponsesQuery(queryArg);
  const [exportResponsesXlsx] = useExportResponsesXlsxMutation();

  const paginated = responsesData?.data;
  const docs: QuizResponseDoc[] = Array.isArray(paginated?.docs) ? paginated.docs : [];
  const totalDocs = typeof paginated?.totalDocs === "number" ? paginated.totalDocs : 0;
  const totalPages = typeof paginated?.totalPages === "number" ? paginated.totalPages : 0;
  const hasNextPage = Boolean(paginated?.hasNextPage);
  const hasPrevPage = Boolean(paginated?.hasPrevPage);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportResponsesXlsx({
        keyword: debouncedKeyword,
      }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "lesson-quiz-responses-report.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not export reports.");
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-heading">Quiz reports</CardTitle>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports…"
                className="pl-9"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-label="Search quiz reports"
              />
            </div>
            <Button variant="outline" size="sm" type="button" onClick={handleExport} disabled={isExporting}>
              {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              {isExporting ? "Exporting…" : "Export PDF"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative min-h-[120px]">
            {(isLoading || isFetching) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                <p className="text-sm text-muted-foreground">Loading reports…</p>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.no</TableHead>
                  <TableHead>Learner</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Total Questions</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docs.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No reports found
                      {debouncedKeyword ? ` for “${debouncedKeyword}”.` : "."}
                    </TableCell>
                  </TableRow>
                ) : (
                  docs.map((r, idx) => {
                    const serial = (page - 1) * PAGE_LIMIT + idx + 1;
                    const learner = [r.user?.firstName, r.user?.lastName].filter(Boolean).join(" ").trim() || r.user?.email || "—";
                    const courseTitle = r.lesson?.course?.title ?? "—";
                    const score = typeof r.score === "number" ? r.score : Number(r.score ?? 0);
                    const percentage = typeof r.percentage === "number" ? r.percentage : Number(r.percentage ?? 0);
                    const passed = String(r.result ?? "").toUpperCase() === "PASSED";
                    const totalQuestions = r.totalQuestions ?? 0;
                    return (
                      <TableRow key={r._id ?? `response-${page}-${idx}`}>
                        <TableCell className="w-[1%] whitespace-nowrap tabular-nums text-sm font-medium text-foreground">
                          {serial}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{learner}</div>
                          {r.user?.email ? <div className="text-xs text-muted-foreground">{r.user.email}</div> : null}
                        </TableCell>
                        <TableCell className="max-w-[260px] truncate" title={courseTitle}>
                          {courseTitle}
                        </TableCell>
                        <TableCell>{Number.isFinite(score) ? score : "—"}</TableCell>
                        <TableCell>{Number.isFinite(percentage) ? `${percentage}%` : "—"}</TableCell>
                        <TableCell>
                          <Badge variant={passed ? "secondary" : "outline"} className="gap-1 capitalize">
                            {passed ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {passed ? "passed" : "failed"}
                          </Badge>
                        </TableCell>
                        <TableCell>{totalQuestions}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                        </TableCell>
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminReports;
