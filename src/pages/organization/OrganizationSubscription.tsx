import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hasActiveSubscription, hasParentOrganization } from "@/pages/protectedRoute/SubscriptionRequiredRoute";
import { useGetMySubscriptionQuery } from "@/redux/services/apiSlices/paymentSlice";
import type { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { ArrowUpCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

type CourseInSubscription = {
  _id?: string;
  title?: string;
  amount?: number;
  groupAmount?: number;
  sortOrder?: number;
  status?: string;
};

type SubscriptionData = {
  status?: string;
  amount?: number;
  totalAmount?: number;
  totalLearners?: number;
  usedLearners?: number;
  certificatesIssued?: number;
  createdAt?: string;
  updatedAt?: string;
  courseIds?: unknown;
  user?: unknown;
  _id?: string;
  id?: string;
};

function parseSubscriptionEnvelope(res: unknown): SubscriptionData | null {
  if (res == null || typeof res !== "object") return null;
  const r = res as { data?: unknown };
  const inner = r.data;
  if (inner == null || typeof inner !== "object" || Array.isArray(inner)) return null;
  return inner as SubscriptionData;
}

function parseCourses(raw: unknown): CourseInSubscription[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((c): c is CourseInSubscription => c != null && typeof c === "object" && !Array.isArray(c));
}

function formatMoney(n: number): string {
  if (!Number.isFinite(n)) return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

function displayCoursePrice(course: CourseInSubscription, totalLearners: number): number {
  const useGroup = totalLearners > 2;
  const group = Number(course.groupAmount);
  const single = Number(course.amount);
  if (useGroup && Number.isFinite(group)) return group;
  if (Number.isFinite(single)) return single;
  return 0;
}

const OrganizationSubscription = () => {
  const user = useSelector((s: any) => s.user.userData) as Record<string, unknown> | undefined;
  const isLearner = String(user?.role ?? "").toLowerCase().trim() === "learner";
  const isStandaloneLearner = isLearner && !hasParentOrganization(user);
  const subscriptionBasePath = isStandaloneLearner ? "/dashboard/subscription" : "/organization/subscription";
  const billingPath = isStandaloneLearner ? "/dashboard/billing" : "/organization/billing";

  const { data: apiRes, isLoading, isError, error, refetch } = useGetMySubscriptionQuery();

  const sub = parseSubscriptionEnvelope(apiRes);
  const active = hasActiveSubscription(apiRes);

  const totalLearners = typeof sub?.totalLearners === "number" && Number.isFinite(sub.totalLearners) ? sub.totalLearners : 0;
  const courses = parseCourses(sub?.courseIds);

  const totalFromApiRaw = sub?.totalAmount ?? sub?.amount;
  const totalFromApi = typeof totalFromApiRaw === "number" && Number.isFinite(totalFromApiRaw) ? totalFromApiRaw : null;
  const computedCourseSum = courses.reduce((sum, c) => sum + displayCoursePrice(c, totalLearners), 0);
  const displayTotalAmount = totalFromApi != null ? totalFromApi : computedCourseSum;

  const listErrorMessage =
    isError && error && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
      ? String((error.data as { message: string }).message)
      : "Could not load subscription.";

  const statusLabel = typeof sub?.status === "string" ? sub.status : "—";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold">Platform Fees</h2>
          <p className="text-sm text-muted-foreground">Your organization&apos;s platform fees and included courses.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link
              to="/payment"
              state={{
                type: "UPGRADE_SUBSCRIPTION",
                from: subscriptionBasePath,
              }}
            >
              <ArrowUpCircle className="mr-2 h-4 w-4" aria-hidden />
              {isStandaloneLearner ? "Add Courses" : "Add Courses & learners"}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={billingPath}>View billing history</Link>
          </Button>
        </div>
      </div>

      {isError && (
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-destructive">{listErrorMessage}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-base">Courses overview</CardTitle>
            {isLoading ? (
              <Badge variant="outline" className="gap-1 font-normal">
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                Loading…
              </Badge>
            ) : active ? (
              <Badge variant="secondary" className="gap-1 border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" aria-hidden />
                Active
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1 font-normal">
                <XCircle className="h-3 w-3" aria-hidden />
                Not active
              </Badge>
            )}
          </div>
          <CardDescription>
            {totalLearners > 2
              ? "Course prices shown use group pricing (more than 2 learners)."
              : "Course prices shown use standard per-course amounts."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Loading subscription…
            </div>
          ) : sub == null ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No subscription details returned.</p>
          ) : (
            <>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">{statusLabel}</dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total learners</dt>
                  <dd className="mt-1 text-sm font-medium tabular-nums text-foreground">{totalLearners}</dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 sm:col-span-2 lg:col-span-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Started</dt>
                  <dd className="mt-1 text-sm text-foreground">{formatDate(sub.createdAt)}</dd>
                </div>
              </dl>

              <div>
                <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Courses</h3>
                {courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No courses on this subscription.</p>
                ) : (
                  <ul className="divide-y divide-border rounded-xl border border-border">
                    {courses.map((c, idx) => {
                      const title = typeof c.title === "string" && c.title.trim() ? c.title : `Course ${idx + 1}`;
                      const price = displayCoursePrice(c, totalLearners);
                      return (
                        <li key={typeof c._id === "string" ? c._id : idx} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-sm text-foreground">{title}</span>
                          <span className="text-sm font-medium tabular-nums text-foreground">{formatMoney(price)}</span>
                        </li>
                      );
                    })}
                    <li className="flex flex-col gap-1 bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-semibold text-foreground">Total amount</span>
                      <span className="text-sm font-bold tabular-nums text-foreground">{formatMoney(displayTotalAmount)}</span>
                    </li>
                  </ul>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrganizationSubscription;
