import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useGetCourseByIdQuery } from "@/redux/services/apiSlices/courseSlice";
import {
  useGetLessonsByCourseQuery,
  useGetQuizQuestionsQuery,
  useSubmitQuizResponseMutation,
  type ApiQuizQuestion,
} from "@/redux/services/apiSlices/lessonSlice";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type AnswerMap = Record<string, string>;

const LearnerQuizAttempt = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const { data: courseRes, isLoading: courseLoading } = useGetCourseByIdQuery(courseId!, {
    skip: !courseId,
  });
  const { data: lessonsRes, isLoading: lessonsLoading } = useGetLessonsByCourseQuery(
    { course: courseId! },
    { skip: !courseId },
  );

  const quizLesson = (lessonsRes?.data ?? []).find((l) => l.type === "QUIZ");
  const quizLessonId = quizLesson?._id;
  const { data: questionsRes, isLoading: questionsLoading } = useGetQuizQuestionsQuery(
    { lessonId: quizLessonId! },
    { skip: !quizLessonId },
  );
  const [submitQuizResponse, { isLoading: submitting }] = useSubmitQuizResponseMutation();
  const shouldBlockNavigation = Boolean(quizLessonId) && !quizSubmitted;

  const course = courseRes?.data;
  const questions = useMemo(() => {
    const list = ((questionsRes?.data ?? []) as ApiQuizQuestion[]).slice();
    // Randomize question order for each quiz page load.
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [questionsRes?.data]);

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // useEffect(() => {
  //   if (!shouldBlockNavigation) return;

  //   const currentUrl = window.location.href;
  //   const originalPushState = window.history.pushState.bind(window.history);
  //   const originalReplaceState = window.history.replaceState.bind(window.history);

  //   const blockNavigation = () => {
  //     toast.error("Please submit your quiz before leaving this page.");
  //   };

  //   window.history.pushState = function pushStateOverride(...args) {
  //     const nextUrl = args[2];
  //     const next =
  //       typeof nextUrl === "string" ? new URL(nextUrl, window.location.href).href : window.location.href;
  //     if (next !== currentUrl) {
  //       blockNavigation();
  //       return;
  //     }
  //     return originalPushState(...args);
  //   };

  //   window.history.replaceState = function replaceStateOverride(...args) {
  //     const nextUrl = args[2];
  //     const next =
  //       typeof nextUrl === "string" ? new URL(nextUrl, window.location.href).href : window.location.href;
  //     if (next !== currentUrl) {
  //       blockNavigation();
  //       return;
  //     }
  //     return originalReplaceState(...args);
  //   };

  //   const handlePopState = () => {
  //     blockNavigation();
  //     originalPushState(null, "", currentUrl);
  //   };

  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //     event.returnValue = "";
  //   };

  //   originalPushState(null, "", currentUrl);
  //   window.addEventListener("popstate", handlePopState);
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     window.history.pushState = originalPushState;
  //     window.history.replaceState = originalReplaceState;
  //     window.removeEventListener("popstate", handlePopState);
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [shouldBlockNavigation]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!quizLessonId) return;

    const missing = questions.find((q) => !String(answers[q._id] ?? "").trim());
    if (missing) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    const payload = {
      answers: questions.map((q) => ({
        questionId: q._id,
        answer: String(answers[q._id]).trim(),
      })),
    };

    try {
      const res = await submitQuizResponse({ lessonId: quizLessonId, answers: payload.answers }).unwrap();
      if (res?.status === false) {
        toast.error(res?.message || "Could not submit quiz response.");
        return;
      }
      // setQuizSubmitted(true);
      if (res?.data?.certificate) {
        toast.success(res?.message || "Quiz submitted successfully.");
        navigate("/dashboard", {
          replace: true,
          state: { activeTab: "certificates" as const },
        });
        return;
      }
      toast.error(res?.message || "Could not submit quiz response.");
      navigate(`/dashboard/courses/${courseId}`, { replace: true });
    } catch (err: unknown) {
      console.log(err, 'err');
      const msg =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Could not submit quiz response.";
      toast.error(msg);
    }
  };

  if (!courseId) {
    return <p className="text-sm text-muted-foreground">Invalid course.</p>;
  }

  if (courseLoading || lessonsLoading || questionsLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-16">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading quiz…
      </div>
    );
  }

  if (!quizLessonId) {
    return (
      <Card>
        <CardContent className="py-10 space-y-3">
          <p className="text-sm text-muted-foreground">No quiz is configured for this course yet.</p>
          <Button variant="outline" asChild>
            <Link to={`/dashboard/courses/${courseId}`}>Back to course</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label="Submit quiz to unlock navigation"
            disabled={shouldBlockNavigation}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="font-heading text-lg font-bold">Attempt quiz</h2>
            <p className="text-sm text-muted-foreground">{course?.title ?? "Course quiz"}</p>
          </div>
        </div>
        <Badge variant="outline">{questions.length} question{questions.length === 1 ? "" : "s"}</Badge>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-sm text-muted-foreground">No questions found in this quiz.</CardContent>
        </Card>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          {questions.map((q, index) => (
            <Card key={q._id}>
              <CardHeader>
                <CardTitle className="text-base">
                  Q{index + 1}. {q.question}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {q.type.replace(/_/g, " ")} · {q.points} pt{q.points === 1 ? "" : "s"}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {q.type === "multiple_choice" && q.options?.length ? (
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => (
                      <label
                        key={`${q._id}-${idx}`}
                        className="flex items-center gap-2 rounded-md border border-border px-3 py-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`q-${q._id}`}
                          value={opt}
                          checked={answers[q._id] === opt}
                          onChange={(e) => setAnswer(q._id, e.target.value)}
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : null}

                {q.type === "true_false" ? (
                  <div className="flex gap-3">
                    {["true", "false"].map((val) => (
                      <label key={val} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`q-${q._id}`}
                          value={val}
                          checked={answers[q._id] === val}
                          onChange={(e) => setAnswer(q._id, e.target.value)}
                        />
                        <span className="text-sm capitalize">{val}</span>
                      </label>
                    ))}
                  </div>
                ) : null}

                {q.type === "short_answer" ? (
                  <Textarea
                    value={answers[q._id] ?? ""}
                    onChange={(e) => setAnswer(q._id, e.target.value)}
                    placeholder="Type your answer..."
                    rows={4}
                  />
                ) : null}
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit quiz
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LearnerQuizAttempt;
