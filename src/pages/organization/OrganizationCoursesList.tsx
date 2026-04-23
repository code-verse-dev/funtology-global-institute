import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";
import type { ApiCourse } from "@/redux/services/apiSlices/courseSlice";
import { useGetCoursesQuery } from "@/redux/services/apiSlices/courseSlice";
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PAGE_SIZE = 10;
const OVERVIEW_LIMIT = 6;

function CourseRowCard({
  course,
  index,
  linkBase,
}: {
  course: ApiCourse;
  index: number;
  linkBase: string;
}) {
  const coverSrc = lessonFileUrl(course.image);
  const detailPath = `${linkBase.replace(/\/$/, "")}/${course._id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-md transition-all overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <div className="relative sm:w-44 md:w-72 shrink-0 aspect-[4/3] sm:aspect-auto sm:min-h-[140px] bg-muted">
              {coverSrc ? (
                <img src={coverSrc} alt={course.title} className="absolute inset-0 w-full h-full object-contain" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <BookOpen className="w-10 h-10 opacity-40" />
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-1 min-w-0 p-5 md:p-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-muted-foreground shrink-0 sm:hidden" />
                  <h3 className="font-heading font-semibold text-foreground">{course.title}</h3>
                  <Badge variant="outline" className="capitalize">
                    {course.status}
                  </Badge>
                </div>
                {course.description ? (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{course.description}</p>
                ) : null}
                <p className="text-sm text-muted-foreground">{course.ceHours} Ongoing hours</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 w-full sm:w-auto" asChild>
                <Link to={detailPath}>
                  View details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

type Variant = "overview" | "full";

export type OrganizationCoursesListProps = {
  variant: Variant;
  /** Base path without trailing slash, e.g. `/organization/courses` or `/dashboard/courses` */
  linkBase?: string;
};

export function OrganizationCoursesList({ variant, linkBase = "/organization/courses" }: OrganizationCoursesListProps) {
  const location = useLocation();
  const [keywordInput, setKeywordInput] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refetchedForPaymentNavKeyRef = useRef<string | null>(null);

  const isOverview = variant === "overview";

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOverview) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedKeyword(keywordInput.trim() || undefined);
      setPage(1);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [keywordInput, isOverview]);

  const queryArgs = isOverview
    ? { page: 1, limit: OVERVIEW_LIMIT, status: "published" as const }
    : { page, limit: PAGE_SIZE, status: "published" as const, keyword: debouncedKeyword };

  const { data, isLoading, isFetching, isError, error, refetch } = useGetCoursesQuery(queryArgs);

  useEffect(() => {
    const fromPayment =
      location.state &&
      typeof location.state === "object" &&
      "fromPayment" in location.state &&
      Boolean((location.state as { fromPayment?: boolean }).fromPayment);
    if (!fromPayment) return;
    if (refetchedForPaymentNavKeyRef.current === location.key) return;
    refetchedForPaymentNavKeyRef.current = location.key;
    void refetch();
  }, [location.key, location.state, refetch]);

  const pageData = data?.data;
  const courses = pageData?.docs ?? [];
  const totalPages = pageData?.totalPages ?? 1;
  const totalDocs = pageData?.totalDocs ?? 0;

  const listErrorMessage =
    isError && error && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
      ? String((error.data as { message: string }).message)
      : "Could not load courses.";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground py-12">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading courses…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-destructive">{listErrorMessage}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isOverview && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses…"
            className="pl-10"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
        </div>
      )}

      {courses.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {!isOverview && debouncedKeyword ? "No courses match your search." : "No published courses yet."}
        </p>
      ) : (
        <div className="space-y-4">
          {courses.map((course, index) => (
            <CourseRowCard key={course._id} course={course} index={index} linkBase={linkBase} />
          ))}
        </div>
      )}

      {isOverview && totalDocs > OVERVIEW_LIMIT && (
        <div className="pt-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={linkBase}>
              View all courses
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      )}

      {!isOverview && totalDocs > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground pt-2">
          <span>
            {totalDocs} course{totalDocs === 1 ? "" : "s"}
            {isFetching ? " · Updating…" : ""}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
