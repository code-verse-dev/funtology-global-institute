import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";
import { useGetPublicCourseByIdQuery } from "@/redux/services/apiSlices/courseSlice";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Layers,
  Loader2,
  ShoppingCart,
  Timer,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { useEffect } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop&q=60";

export type CatalogCourseDetail = {
  _id?: string;
  title?: string;
  description?: string;
  amount?: number;
  groupAmount?: number;
  ceHours?: number;
  readingTime?: number;
  testTime?: number;
  level?: number;
  sortOrder?: number;
  status?: string;
  image?: string;
  learningObjectives?: string[];
  createdAt?: string;
  updatedAt?: string;
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { dateStyle: "medium" });
}

const PublicCourseDetail = () => {
  const user = useSelector((state: any) => state.user.userData);
  const isOrganization = user?.role && user?.role === "organization";
  const isLearner = user?.role && user?.role === "learner";
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const { data: envelope, isLoading, isError, error } = useGetPublicCourseByIdQuery(courseId ?? "", {
    skip: !courseId,
  });

  const course = (envelope?.data ?? null) as CatalogCourseDetail | null;

  const imageSrc = course?.image ? lessonFileUrl(course.image) ?? FALLBACK_IMAGE : FALLBACK_IMAGE;

  const errMsg =
    isError && error && typeof error === "object" && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
      ? String((error.data as { message: string }).message)
      : "We could not load this course.";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20">
          <div className="container-wide">
          <Button variant="ghost" size="sm" className="mt-8 text-center gap-1.5 text-muted-foreground" asChild>
            <Link to="/courses">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to catalog
            </Link>
          </Button>
          </div>

        {!courseId ? (
          <div className="container-wide py-16 text-center text-muted-foreground">
            <p>Missing course link.</p>
            <Button asChild className="mt-4" variant="secondary">
              <Link to="/courses">Browse courses</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm">Loading course…</p>
          </div>
        ) : isError || !course ? (
          <div className="container-wide max-w-lg mx-auto py-16 text-center">
            <p className="text-destructive mb-4">{errMsg}</p>
            <Button asChild variant="secondary">
              <Link to="/courses">Back to catalog</Link>
            </Button>
          </div>
        ) : course.status !== "published" ? (
          <div className="container-wide max-w-lg mx-auto py-16 text-center">
            <p className="text-muted-foreground mb-4">This course is not available in the catalog.</p>
            <Button asChild variant="secondary">
              <Link to="/courses">Back to catalog</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* <section className="relative h-[min(52vh,420px)] w-full overflow-hidden bg-muted">
              <img src={imageSrc} alt={course.title ?? "Course"} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end">
                <div className="container-wide pb-10 pt-24">
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                    {typeof course.level === "number" && course.level > 0 ? (
                      <Badge className="mb-3 gap-1 bg-secondary text-secondary-foreground">
                        <Layers className="h-3 w-3" />
                        Level {course.level}
                      </Badge>
                    ) : null}
                    <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground max-w-4xl">
                      {course.title ?? "Course"}
                    </h1>
                  </motion.div>
                </div>
              </div>
            </section> */}

            <section className="container-wide py-10 md:py-14">
              <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
                <div className="min-w-0 space-y-8">
                  <div className="flex flex-wrap gap-3">
                    {typeof course.ceHours === "number" ? (
                      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                        <Award className="h-4 w-4 text-secondary shrink-0" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">CE hours</p>
                          <p className="font-semibold text-foreground">{course.ceHours}</p>
                        </div>
                      </div>
                    ) : null}
                    {typeof course.readingTime === "number" ? (
                      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                        <BookOpen className="h-4 w-4 text-secondary shrink-0" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Reading time</p>
                          <p className="font-semibold text-foreground">{course.readingTime} hours</p>
                        </div>
                      </div>
                    ) : null}
                    {typeof course.testTime === "number" ? (
                      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                        <Timer className="h-4 w-4 text-secondary shrink-0" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Test time</p>
                          <p className="font-semibold text-foreground">{course.testTime} hours</p>
                        </div>
                      </div>
                    ) : null}
               
                  </div>

                  <div>
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-3">About this course</h2>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{course.description ?? "—"}</p>
                  </div>

                  {Array.isArray(course.learningObjectives) && course.learningObjectives.length > 0 ? (
                    <div>
                      <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Learning objectives</h2>
                      <ul className="space-y-3">
                        {course.learningObjectives.map((obj, i) => (
                          <li key={i} className="flex gap-3 text-sm text-foreground">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary mt-0.5" aria-hidden />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                </div>

                <aside className="lg:sticky lg:top-24 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Standard rate (1–2 learners)</p>
                    <p className="font-heading text-3xl font-bold text-foreground tabular-nums">
                      {typeof course.amount === "number" && Number.isFinite(course.amount) ? `$${course.amount.toFixed(2)}` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Group rate (3+ learners)</p>
                    <p className="font-heading text-2xl font-semibold text-foreground tabular-nums">
                      {typeof course.groupAmount === "number" && Number.isFinite(course.groupAmount)
                        ? `$${course.groupAmount.toFixed(2)}`
                        : "—"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="lg"
                    className="w-full font-heading font-semibold gap-2"
                    onClick={() => {
                      if (isOrganization) {
                        navigate("/organization/subscription");
                      } else if (isLearner) {
                        navigate("/dashboard/subscription");
                      } else if(!user?._id) {
                        navigate("/login");
                      }
                      else{
                        return;
                      }
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" aria-hidden />
                    Buy this course
                  </Button>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You will continue to subscription checkout to select this program and complete enrollment.
                  </p>
                </aside>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PublicCourseDetail;
