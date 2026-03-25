import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetCourseByIdQuery } from "@/redux/services/apiSlices/courseSlice";
import {
  useGetLessonsByCourseQuery,
  useUpdateLessonMutation,
} from "@/redux/services/apiSlices/lessonSlice";
import { FileText, GraduationCap, Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { lessonFileUrl } from "./lessonFileUrl";

const AdminCourseContent = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const { data: courseRes, isLoading: courseLoading } = useGetCourseByIdQuery(courseId!, {
    skip: !courseId,
  });
  const {
    data: lessonsRes,
    isLoading: lessonsLoading,
    isError: lessonsError,
  } = useGetLessonsByCourseQuery({ course: courseId! }, { skip: !courseId });

  const [updateLesson, { isLoading: saving }] = useUpdateLessonMutation();

  const course = courseRes?.data;
  const lessons = lessonsRes?.data ?? [];
  const pdfLesson = lessons.find((l) => l.type === "PDF");
  const quizLesson = lessons.find((l) => l.type === "QUIZ");

  const pdfSrc = lessonFileUrl(pdfLesson?.fileUrl);

  const onSubmitPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !pdfLesson || !pdfFile) {
      toast.error("Choose a PDF file to upload");
      return;
    }
    try {
      const res = await updateLesson({
        id: pdfLesson._id,
        course: courseId,
        type: "PDF",
        order: pdfLesson.order,
        file: pdfFile,
      }).unwrap();
      if (res.status) {
        toast.success(res.message || "PDF updated");
        setPdfFile(null);
      } else {
        toast.error(res.message || "Could not update lesson");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Could not update PDF";
      toast.error(msg);
    }
  };

  if (!courseId) {
    return (
      <p className="text-muted-foreground">
        <Link to="/admin/courses" className="text-secondary underline">
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

  if (lessonsError || !courseRes?.status) {
    return (
      <p className="text-destructive text-sm">
        Could not load lessons.{" "}
        <Link to="/admin/courses" className="underline">
          Back to courses
        </Link>
      </p>
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
            <h2 className="font-heading text-lg font-bold">Upload content</h2>
            <p className="text-sm text-muted-foreground">{course?.title ?? "Course"}</p>
          </div>
        </div>
        {quizLesson && (
          <Button variant="outline" size="sm" asChild>
            <Link to={`/admin/courses/${courseId}/question-bank`}>
              <GraduationCap className="w-4 h-4 mr-2" />
              Question bank &amp; quiz
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              <CardTitle className="font-heading text-base">PDF lesson</CardTitle>
            </div>
            <CardDescription>Order {pdfLesson?.order ?? "—"} · Learners view this document in the course.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!pdfLesson ? (
              <p className="text-sm text-muted-foreground">
                No PDF lesson found for this course. Create one in the backend if missing.
              </p>
            ) : (
              <>
                {pdfSrc ? (
                  <div className="space-y-2">
                    <div className="rounded-lg border border-border overflow-hidden bg-muted/30 min-h-[320px]">
                      <iframe title="Course PDF" src={pdfSrc} className="w-full h-[min(55vh,480px)]" />
                    </div>
                    <Button variant="link" size="sm" className="px-0 h-auto" asChild>
                      <a href={pdfSrc} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open PDF in new tab
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No PDF file uploaded yet.</p>
                )}

                <form onSubmit={onSubmitPdf} className="space-y-3 border-t border-border pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="pdf-replace">Replace PDF</Label>
                    <Input
                      id="pdf-replace"
                      key={pdfLesson.fileUrl ?? "no-file"}
                      type="file"
                      accept="application/pdf,.pdf"
                      className="cursor-pointer"
                      onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                  <Button type="submit" variant="secondary" disabled={!pdfFile || saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      "Save new PDF"
                    )}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-secondary" />
              <CardTitle className="font-heading text-base">Quiz lesson</CardTitle>
            </div>
            <CardDescription>Order {quizLesson?.order ?? "—"} · Questions and attempts are managed separately.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!quizLesson ? (
              <p className="text-sm text-muted-foreground">No quiz lesson found for this course.</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{quizLesson.status ?? "ACTIVE"}</Badge>
                  <span className="text-sm text-muted-foreground">ID: {quizLesson._id}</span>
                </div>
                <Button asChild>
                  <Link to={`/admin/courses/${courseId}/question-bank`}>Open question bank</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCourseContent;
