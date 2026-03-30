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
import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { lessonFileUrl } from "./lessonFileUrl";
import PdfFlipViewer from "@/components/pdf/PdfFlipViewer";

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
  // const handlePdfDownload = useCallback(async () => {
  //   if (!pdfSrc) return;
  //   const nameBase = course?.title ?? pdfLesson?.fileUrl?.split("/").pop() ?? "document.pdf";
  //   try {
  //     const res = await fetch(pdfSrc);
  //     const blob = await res.blob();
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = nameBase.endsWith(".pdf") ? nameBase : `${nameBase}.pdf`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   } catch {
  //     window.open(pdfSrc, "_blank", "noopener,noreferrer");
  //   }
  // }, [pdfSrc, course?.title, pdfLesson?.fileUrl]);


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

      <div className="grid gap-6 lg:grid-cols-1">

        <Card className="flex flex-col overflow-hidden border shadow-sm min-h-[min(78dvh,880px)] p-0">
          <CardHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              <CardTitle className="font-heading text-base">PDF material</CardTitle>
            </div>
            <CardDescription>Flip through the reference document like a book.</CardDescription>
          </CardHeader>
          {!pdfLesson ? (
            <CardContent>
              <p className="text-sm text-muted-foreground">No PDF lesson is configured for this course.</p>
            </CardContent>
          ) : !pdfSrc ? (
            <CardContent>
              <p className="text-sm text-muted-foreground">No PDF file has been uploaded yet.</p>
            </CardContent>
          ) : (
            <PdfFlipViewer
              fileUrl={pdfSrc}
              title={course.title}
              // onDownload={handlePdfDownload}
              maxPageWidth={720}
              className="flex-1 min-h-0 border-t border-border"
            />
          )}
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
