import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PdfFlipViewer from "@/components/pdf/PdfFlipViewer";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";
import { useGetCourseByIdQuery } from "@/redux/services/apiSlices/courseSlice";
import { useGetLessonsByCourseQuery, useGetQuizQuestionsQuery, type ApiQuizQuestion } from "@/redux/services/apiSlices/lessonSlice";
import { ArrowLeft, FileText, GraduationCap, ListOrdered, Loader2 } from "lucide-react";
import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";

export type ReadOnlyCourseDetailProps = {
  /** e.g. `/organization/courses` or `/dashboard/courses` */
  listPath: string;
  variant?: "organization" | "learner";
};

export function ReadOnlyCourseDetail({ listPath, variant = "organization" }: ReadOnlyCourseDetailProps) {
  const { courseId } = useParams<{ courseId: string }>();
  const isLearner = variant === "learner";

  const { data: courseRes, isLoading: courseLoading, isError: courseError } = useGetCourseByIdQuery(courseId!, {
    skip: !courseId,
  });
  const {
    data: lessonsRes,
    isLoading: lessonsLoading,
    isError: lessonsError,
  } = useGetLessonsByCourseQuery({ course: courseId! }, { skip: !courseId });

  const course = courseRes?.data;
  const lessons = lessonsRes?.data ?? [];
  const pdfLesson = lessons.find((l) => l.type === "PDF");
  const quizLesson = lessons.find((l) => l.type === "QUIZ");
  const quizLessonId = quizLesson?._id;

  const { data: questionsRes, isLoading: questionsLoading } = useGetQuizQuestionsQuery(
    { lessonId: quizLessonId! },
    { skip: !quizLessonId || isLearner },
  );

  const questions = (questionsRes?.data ?? []) as ApiQuizQuestion[];
  const pdfSrc = lessonFileUrl(pdfLesson?.fileUrl);
  const coverSrc = lessonFileUrl(course?.image);

  const handlePdfDownload = useCallback(async () => {
    if (!pdfSrc) return;
    const nameBase = course?.title ?? pdfLesson?.fileUrl?.split("/").pop() ?? "document.pdf";
    try {
      const res = await fetch(pdfSrc);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nameBase.endsWith(".pdf") ? nameBase : `${nameBase}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(pdfSrc, "_blank", "noopener,noreferrer");
    }
  }, [pdfSrc, course?.title, pdfLesson?.fileUrl]);

  if (!courseId) {
    return (
      <p className="text-muted-foreground">
        <Link to={listPath} className="text-secondary underline">
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

  if (courseError || !courseRes?.status || !course) {
    return (
      <p className="text-destructive text-sm">
        Could not load course.{" "}
        <Link to={listPath} className="underline">
          Back to courses
        </Link>
      </p>
    );
  }

  if (isLearner) {
    return (
      <div className="flex flex-col gap-4 min-h-[calc(100dvh-11rem)]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" asChild>
              <Link to={listPath} aria-label="Back to courses">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h2 className="font-heading text-lg font-bold truncate">{course.title}</h2>
              <p className="text-sm text-muted-foreground">{course.ceHours} CE hours</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="capitalize">
              {course.status}
            </Badge>
            <Button type="button" variant="secondary">
              Attempt quiz
            </Button>
          </div>
        </div>

        {lessonsError ? (
          <p className="text-sm text-destructive">Could not load course content.</p>
        ) : !pdfLesson ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No PDF lesson is configured for this course.
            </CardContent>
          </Card>
        ) : !pdfSrc ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No PDF file has been uploaded yet.
            </CardContent>
          </Card>
        ) : (
          <Card className="flex-1 flex flex-col overflow-hidden border shadow-sm min-h-[min(78dvh,880px)] p-0">
            <PdfFlipViewer
              fileUrl={pdfSrc}
              title={course.title}
              onDownload={handlePdfDownload}
              maxPageWidth={720}
              className="flex-1 min-h-0"
            />
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={listPath} aria-label="Back to courses">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h2 className="font-heading text-lg font-bold">Course details</h2>
            <p className="text-sm text-muted-foreground">{course.title}</p>
          </div>
        </div>
        <Badge variant="outline" className="capitalize w-fit">
          {course.status}
        </Badge>
      </div>

      {coverSrc ? (
        <div className="rounded-xl border border-border overflow-hidden bg-muted aspect-[21/9] max-h-56">
          <img src={coverSrc} alt={course.title} className="w-full h-full object-cover" />
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">About this course</CardTitle>
          <CardDescription>
            {course.ceHours} CE hours
            {course.sortOrder != null ? ` · Order ${course.sortOrder}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {course.description ? <p className="text-foreground whitespace-pre-wrap">{course.description}</p> : null}
          {course.learningObjectives && course.learningObjectives.length > 0 ? (
            <div>
              <p className="font-medium text-foreground mb-2">Learning objectives</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {course.learningObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {lessonsError ? (
        <p className="text-sm text-destructive">Could not load course content (lessons).</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" />
                <CardTitle className="font-heading text-base">PDF material</CardTitle>
              </div>
              <CardDescription>Flip through the reference document like a book.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-0">
              {!pdfLesson ? (
                <p className="text-sm text-muted-foreground px-6 pb-6">No PDF lesson is configured for this course.</p>
              ) : pdfSrc ? (
                <PdfFlipViewer fileUrl={pdfSrc} title={course.title} onDownload={handlePdfDownload} maxPageWidth={520} />
              ) : (
                <p className="text-sm text-muted-foreground px-6 pb-6">No PDF file has been uploaded yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-secondary" />
                <CardTitle className="font-heading text-base">Quiz material</CardTitle>
              </div>
              <CardDescription>Assessment content for this course (read-only).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!quizLesson ? (
                <p className="text-sm text-muted-foreground">No quiz lesson is configured for this course.</p>
              ) : questionsLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading questions…
                </div>
              ) : questions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No questions in the bank yet.</p>
              ) : (
                <ul className="space-y-3">
                  {questions
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((q, i) => (
                      <li key={q._id} className="rounded-lg border border-border p-3 text-sm">
                        <div className="flex items-start gap-2 mb-2">
                          <ListOrdered className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">
                              Q{i + 1}. {q.question}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {q.type.replace(/_/g, " ")}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{q.points} pt{q.points === 1 ? "" : "s"}</span>
                            </div>
                          </div>
                        </div>
                        {q.type === "multiple_choice" && q.options?.length ? (
                          <ul className="pl-6 mt-2 space-y-1 text-muted-foreground">
                            {q.options.map((opt, idx) => (
                              <li key={idx}>
                                {String.fromCharCode(65 + idx)}. {opt}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {q.type === "true_false" ? (
                          <p className="pl-6 mt-2 text-muted-foreground">True / False</p>
                        ) : null}
                        {q.type === "short_answer" ? (
                          <p className="pl-6 mt-2 text-muted-foreground">Short answer</p>
                        ) : null}
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
