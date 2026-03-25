import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useGetCourseByIdQuery } from "@/redux/services/apiSlices/courseSlice";
import {
  useCreateLessonQuizQuestionsMutation,
  useGetLessonsByCourseQuery,
  useGetQuizQuestionsQuery,
  useGetQuizResponsesQuery,
  useGetResponseByIdQuery,
  useUpdateQuizQuestionMutation,
  type ApiQuizQuestion,
  type QuizQuestionType,
} from "@/redux/services/apiSlices/lessonSlice";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

type PopulatedQuestion = {
  _id?: string;
  question?: string;
  type?: string;
  options?: string[];
  correctAnswer?: unknown;
  points?: number;
};

type AnswerWithQuestion = {
  answer?: unknown;
  correct?: boolean;
  question?: PopulatedQuestion | string;
};

const emptyQuestionForm = {
  question: "",
  type: "multiple_choice" as QuizQuestionType,
  optionsText: "",
  correctMcIndex: "0",
  correctTf: "true",
  correctShort: "",
  points: "1",
};

const AdminCourseQuestionBank = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<ApiQuizQuestion | null>(null);
  const [addForm, setAddForm] = useState(emptyQuestionForm);
  const [editForm, setEditForm] = useState(emptyQuestionForm);
  const [responsePage, setResponsePage] = useState(1);
  const [responseFilter, setResponseFilter] = useState<string>("all");
  const [detailId, setDetailId] = useState<string | null>(null);

  const pageSize = 10;

  const { data: courseRes, isLoading: courseLoading } = useGetCourseByIdQuery(courseId!, {
    skip: !courseId,
  });
  const { data: lessonsRes, isLoading: lessonsLoading } = useGetLessonsByCourseQuery(
    { course: courseId! },
    { skip: !courseId }
  );

  const lessons = lessonsRes?.data ?? [];
  const quizLesson = lessons.find((l) => l.type === "QUIZ");
  const quizLessonId = quizLesson?._id;

  const {
    data: questionsRes,
    isLoading: questionsLoading,
    refetch: refetchQuestions,
  } = useGetQuizQuestionsQuery({ lessonId: quizLessonId! }, { skip: !quizLessonId });

  const questions = (questionsRes?.data ?? []) as ApiQuizQuestion[];

  const {
    data: responsesRes,
    isLoading: responsesLoading,
    refetch: refetchResponses,
  } = useGetQuizResponsesQuery(
    {
      lessonId: quizLessonId!,
      page: String(responsePage),
      limit: String(pageSize),
      ...(responseFilter === "PASSED" || responseFilter === "FAILED" ? { result: responseFilter } : {}),
    },
    { skip: !quizLessonId }
  );

  const responsesPayload = responsesRes?.data;
  const responseRows = responsesPayload?.data ?? [];
  const totalResponsePages = responsesPayload?.totalPages ?? 1;
  const passThreshold = responsesPayload?.passThresholdPercent;

  const { data: detailRes, isLoading: detailLoading } = useGetResponseByIdQuery(
    { responseId: detailId! },
    { skip: !detailId }
  );

  const [createQuestions, { isLoading: creating }] = useCreateLessonQuizQuestionsMutation();
  const [updateQuestion, { isLoading: updating }] = useUpdateQuizQuestionMutation();

  const course = courseRes?.data;

  const nextOrder = useMemo(() => {
    if (!questions.length) return 1;
    return Math.max(...questions.map((q) => q.order)) + 1;
  }, [questions]);

  const parseMcOptions = (text: string) =>
    text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const buildCorrectAnswer = (
    type: QuizQuestionType,
    opts: string[],
    mcIndex: string,
    tf: string,
    short: string
  ): string | number | boolean => {
    if (type === "true_false") return tf === "true";
    if (type === "short_answer") return short.trim();
    const idx = Math.max(0, parseInt(mcIndex, 10) || 0);
    if (idx >= 0 && idx < opts.length) return idx;
    return 0;
  };

  const openEdit = (q: ApiQuizQuestion) => {
    setEditing(q);
    const opts = q.options ?? [];
    let mcIndex = "0";
    if (q.type === "multiple_choice" && typeof q.correctAnswer === "number") {
      mcIndex = String(q.correctAnswer);
    }
    setEditForm({
      question: q.question,
      type: q.type,
      optionsText: opts.join("\n"),
      correctMcIndex: mcIndex,
      correctTf: q.type === "true_false" && q.correctAnswer === false ? "false" : "true",
      correctShort: q.type === "short_answer" ? String(q.correctAnswer ?? "") : "",
      points: String(q.points ?? 1),
    });
    setEditOpen(true);
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizLessonId) return;
    const opts = addForm.type === "multiple_choice" ? parseMcOptions(addForm.optionsText) : [];
    if (addForm.type === "multiple_choice" && opts.length < 2) {
      toast.error("Add at least two options (one per line)");
      return;
    }
    const correctAnswer = buildCorrectAnswer(
      addForm.type,
      opts,
      addForm.correctMcIndex,
      addForm.correctTf,
      addForm.correctShort
    );
    try {
      const res = await createQuestions({
        lesson: quizLessonId,
        questions: [
          {
            question: addForm.question.trim(),
            type: addForm.type,
            options: addForm.type === "multiple_choice" ? opts : undefined,
            correctAnswer,
            points: Math.max(1, parseInt(addForm.points, 10) || 1),
            order: nextOrder,
          },
        ],
      }).unwrap();
      if (res.status) {
        toast.success(res.message || "Question added");
        setAddOpen(false);
        setAddForm(emptyQuestionForm);
        refetchQuestions();
      } else {
        toast.error(res.message || "Could not add question");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Could not add question";
      toast.error(msg);
    }
  };

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const opts = editForm.type === "multiple_choice" ? parseMcOptions(editForm.optionsText) : [];
    if (editForm.type === "multiple_choice" && opts.length < 2) {
      toast.error("Add at least two options (one per line)");
      return;
    }
    const correctAnswer = buildCorrectAnswer(
      editForm.type,
      opts,
      editForm.correctMcIndex,
      editForm.correctTf,
      editForm.correctShort
    );
    try {
      const res = await updateQuestion({
        id: editing._id,
        question: editForm.question.trim(),
        type: editForm.type,
        options: editForm.type === "multiple_choice" ? opts : [],
        correctAnswer,
        points: String(Math.max(1, parseInt(editForm.points, 10) || 1)),
        order: editing.order,
      }).unwrap();
      if (res.status) {
        toast.success(res.message || "Question updated");
        setEditOpen(false);
        setEditing(null);
        refetchQuestions();
      } else {
        toast.error(res.message || "Could not update");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Could not update question";
      toast.error(msg);
    }
  };

  const detailDoc = detailRes?.data as
    | {
        user?: { firstName?: string; lastName?: string; email?: string };
        score?: number;
        totalPoints?: number;
        percentage?: number;
        result?: string;
        passThresholdPercent?: number;
        answers?: AnswerWithQuestion[];
      }
    | undefined;

  if (!courseId) {
    return (
      <p className="text-muted-foreground">
        <Link to="/admin/courses" className="underline">
          Back to courses
        </Link>
      </p>
    );
  }

  if (courseLoading || lessonsLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-16">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/courses" aria-label="Back to courses">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h2 className="font-heading text-lg font-bold">Question bank</h2>
            <p className="text-sm text-muted-foreground">{course?.title ?? "Course"}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/admin/courses/${courseId}/content`}>
            <Upload className="w-4 h-4 mr-2" />
            Upload content (PDF)
          </Link>
        </Button>
      </div>

      {!quizLessonId ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground text-sm">
            No quiz lesson exists for this course. Add a QUIZ-type lesson in the backend first.
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="questions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="questions" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="responses">Quiz responses</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setAddOpen(true)} disabled={!quizLessonId}>
                <Plus className="w-4 h-4 mr-2" />
                Add question
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">Quiz questions</CardTitle>
                <CardDescription>
                  Passing score uses server rules (typically 50% of points). Lesson ID: {quizLessonId}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {questionsLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-12 px-6">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading questions…
                  </div>
                ) : questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-10 px-6">No questions yet. Add one to build the quiz.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead className="w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions.map((q) => (
                        <TableRow key={q._id}>
                          <TableCell>{q.order}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate font-medium">{q.question}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{q.type.replace("_", " ")}</Badge>
                          </TableCell>
                          <TableCell>{q.points}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => openEdit(q)}>
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="font-heading text-base">Learner attempts</CardTitle>
                  <CardDescription>
                    {passThreshold != null ? `Pass threshold: ${passThreshold}%` : "Review submitted quizzes."}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={responseFilter} onValueChange={(v) => { setResponseFilter(v); setResponsePage(1); }}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All results</SelectItem>
                      <SelectItem value="PASSED">Passed</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="sm" onClick={() => refetchResponses()}>
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {responsesLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-12 px-6">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading responses…
                  </div>
                ) : responseRows.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-10 px-6">No quiz responses yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Learner</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {responseRows.map((row) => {
                        const u = row.user;
                        const name = u ? [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email : "—";
                        return (
                          <TableRow key={row._id}>
                            <TableCell>
                              <div className="text-sm font-medium">{name}</div>
                              {u?.email ? <div className="text-xs text-muted-foreground">{u.email}</div> : null}
                            </TableCell>
                            <TableCell>
                              {row.score ?? 0} / {row.totalPoints ?? 0}{" "}
                              <span className="text-muted-foreground">({Math.round(row.percentage ?? 0)}%)</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={row.result === "PASSED" ? "secondary" : "destructive"}>
                                {row.result ?? "—"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                              {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="gap-1" onClick={() => setDetailId(row._id)}>
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
                {responseRows.length > 0 && (
                  <div className="flex items-center justify-between px-6 py-3 border-t border-border text-sm text-muted-foreground">
                    <span>
                      Page {responsePage} of {totalResponsePages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={responsePage <= 1 || responsesLoading}
                        onClick={() => setResponsePage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={responsePage >= totalResponsePages || responsesLoading}
                        onClick={() => setResponsePage((p) => p + 1)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Add question</DialogTitle>
            <DialogDescription>New question order: {nextOrder}</DialogDescription>
          </DialogHeader>
          <form onSubmit={onCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={addForm.type}
                onValueChange={(v) => setAddForm((f) => ({ ...f, type: v as QuizQuestionType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple choice</SelectItem>
                  <SelectItem value="true_false">True / false</SelectItem>
                  <SelectItem value="short_answer">Short answer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-q">Question text</Label>
              <Textarea
                id="add-q"
                required
                value={addForm.question}
                onChange={(e) => setAddForm((f) => ({ ...f, question: e.target.value }))}
                rows={3}
              />
            </div>
            {addForm.type === "multiple_choice" && (
              <div className="space-y-2">
                <Label htmlFor="add-opts">Options (one per line)</Label>
                <Textarea
                  id="add-opts"
                  value={addForm.optionsText}
                  onChange={(e) => setAddForm((f) => ({ ...f, optionsText: e.target.value }))}
                  rows={4}
                  placeholder={"Option A\nOption B"}
                />
                <div className="space-y-2">
                  <Label>Correct option (0 = first line)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={addForm.correctMcIndex}
                    onChange={(e) => setAddForm((f) => ({ ...f, correctMcIndex: e.target.value }))}
                  />
                </div>
              </div>
            )}
            {addForm.type === "true_false" && (
              <div className="space-y-2">
                <Label>Correct answer</Label>
                <Select
                  value={addForm.correctTf}
                  onValueChange={(v) => setAddForm((f) => ({ ...f, correctTf: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {addForm.type === "short_answer" && (
              <div className="space-y-2">
                <Label htmlFor="add-short">Correct answer (matched ignoring case)</Label>
                <Input
                  id="add-short"
                  value={addForm.correctShort}
                  onChange={(e) => setAddForm((f) => ({ ...f, correctShort: e.target.value }))}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="add-pts">Points</Label>
              <Input
                id="add-pts"
                type="number"
                min={1}
                value={addForm.points}
                onChange={(e) => setAddForm((f) => ({ ...f, points: e.target.value }))}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={creating}>
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add question"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={(o) => { if (!o) { setEditOpen(false); setEditing(null); } }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit question</DialogTitle>
            <DialogDescription>Order is fixed at {editing?.order}. Change ordering in backend if needed.</DialogDescription>
          </DialogHeader>
          {editing && (
            <form onSubmit={onUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={editForm.type}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, type: v as QuizQuestionType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple choice</SelectItem>
                    <SelectItem value="true_false">True / false</SelectItem>
                    <SelectItem value="short_answer">Short answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-q">Question text</Label>
                <Textarea
                  id="edit-q"
                  required
                  value={editForm.question}
                  onChange={(e) => setEditForm((f) => ({ ...f, question: e.target.value }))}
                  rows={3}
                />
              </div>
              {editForm.type === "multiple_choice" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-opts">Options (one per line)</Label>
                  <Textarea
                    id="edit-opts"
                    value={editForm.optionsText}
                    onChange={(e) => setEditForm((f) => ({ ...f, optionsText: e.target.value }))}
                    rows={4}
                  />
                  <div className="space-y-2">
                    <Label>Correct option index</Label>
                    <Input
                      type="number"
                      min={0}
                      value={editForm.correctMcIndex}
                      onChange={(e) => setEditForm((f) => ({ ...f, correctMcIndex: e.target.value }))}
                    />
                  </div>
                </div>
              )}
              {editForm.type === "true_false" && (
                <div className="space-y-2">
                  <Label>Correct answer</Label>
                  <Select
                    value={editForm.correctTf}
                    onValueChange={(v) => setEditForm((f) => ({ ...f, correctTf: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {editForm.type === "short_answer" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-short">Correct answer</Label>
                  <Input
                    id="edit-short"
                    value={editForm.correctShort}
                    onChange={(e) => setEditForm((f) => ({ ...f, correctShort: e.target.value }))}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-pts">Points</Label>
                <Input
                  id="edit-pts"
                  type="number"
                  min={1}
                  value={editForm.points}
                  onChange={(e) => setEditForm((f) => ({ ...f, points: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setEditOpen(false); setEditing(null); }}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" disabled={updating}>
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!detailId} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Quiz response detail</DialogTitle>
            <DialogDescription>Per-question breakdown</DialogDescription>
          </DialogHeader>
          {detailLoading && (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading…
            </div>
          )}
          {!detailLoading && detailDoc && (
            <div className="space-y-4 text-sm">
              <div className="rounded-lg border border-border p-3 space-y-1">
                <p>
                  <span className="text-muted-foreground">Learner: </span>
                  {[detailDoc.user?.firstName, detailDoc.user?.lastName].filter(Boolean).join(" ") || "—"}
                </p>
                {detailDoc.user?.email && (
                  <p className="text-muted-foreground text-xs">{detailDoc.user.email}</p>
                )}
                <p>
                  Score {detailDoc.score ?? 0} / {detailDoc.totalPoints ?? 0} ({Math.round(detailDoc.percentage ?? 0)}%)
                </p>
                <Badge variant={detailDoc.result === "PASSED" ? "secondary" : "destructive"}>
                  {detailDoc.result ?? "—"}
                </Badge>
                {detailDoc.passThresholdPercent != null && (
                  <p className="text-xs text-muted-foreground">Pass threshold: {detailDoc.passThresholdPercent}%</p>
                )}
              </div>
              <div className="space-y-3">
                {(detailDoc.answers ?? []).map((row, idx) => {
                  const q = typeof row.question === "object" ? row.question : null;
                  return (
                    <div key={idx} className="rounded-md border border-border p-3 space-y-1">
                      <p className="font-medium">{q?.question ?? "Question"}</p>
                      <p className="text-muted-foreground">
                        User: <span className="text-foreground">{String(row.answer ?? "—")}</span>
                      </p>
                      {q?.correctAnswer !== undefined && (
                        <p className="text-muted-foreground text-xs">
                          Correct: {String(q.correctAnswer)}
                        </p>
                      )}
                      <Badge variant={row.correct ? "secondary" : "outline"}>
                        {row.correct ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseQuestionBank;
