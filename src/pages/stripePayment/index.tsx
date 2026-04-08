import CheckoutForm from "@/components/checkoutForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { hasActiveSubscription, hasParentOrganization } from "@/pages/protectedRoute/SubscriptionRequiredRoute";
import { useLogoutMutation } from "@/redux/services/apiSlices/authSlice";
import { useGetAllCoursesQuery } from "@/redux/services/apiSlices/courseSlice";
import {
  useGetMySubscriptionQuery,
  usePaymentConfigQuery,
  usePaymentIntentMutation,
} from "@/redux/services/apiSlices/paymentSlice";
import { removeUser } from "@/redux/services/Slices/userSlice";
import { RootState } from "@/redux/store";
import type { CourseRate } from "@/utils/upgradeSubscriptionPricing";
import { computeUpgradeSubscriptionPricing } from "@/utils/upgradeSubscriptionPricing";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const lessonId = location.state?.lessonId;
  const learnerId = location.state?.learnerId;
  const user = useSelector((state: RootState) => state.user.userData) as Record<string, unknown> | undefined;
  const isOrganization = String(user?.role ?? "").toLowerCase().trim() === "organization";
  const isLearnerRole = String(user?.role ?? "").toLowerCase().trim() === "learner";
  const isStandaloneSubscriberLearner = isLearnerRole && !hasParentOrganization(user);

  const type = location.state?.type as string | undefined;
  const totalFromState = location.state?.total as number | undefined;
  const isSubscription = type === "SUBSCRIPTION";
  const isUpgradeSubscription = type === "UPGRADE_SUBSCRIPTION";
  const subscriptionFlow = isSubscription || isUpgradeSubscription;
  const showUpgradeSeatControls = isUpgradeSubscription && isOrganization;

  const returnPath =
    typeof (location.state as { from?: string } | null)?.from === "string" &&
      (location.state as { from?: string }).from!.length > 0
      ? (location.state as { from: string }).from
      : isOrganization
        ? "/organization/subscription"
        : "/dashboard/subscription";

  useEffect(() => {
    if (!isUpgradeSubscription) return;
    if (isOrganization || isStandaloneSubscriberLearner) return;
    toast.error("You don't have access to subscription upgrades here.");
    navigate("/dashboard", { replace: true });
  }, [isUpgradeSubscription, isOrganization, isStandaloneSubscriberLearner, navigate]);

  const [totalLearners, setTotalLearners] = useState(0);
  // useEffect(() => {
  //   if (isOrganization && isSubscription) {
  //     setTotalLearners((n) => (n < 1 ? 1 : n));
  //   } else {
  //     setTotalLearners(0);
  //   }
  // }, [isOrganization, isSubscription]);

  const {
    data: subApiRes,
    isLoading: subLoading,
    isError: subError,
  } = useGetMySubscriptionQuery(undefined, {
    skip: !isUpgradeSubscription || (!isOrganization && !isStandaloneSubscriberLearner),
  });

  const activeSub = useMemo(() => {
    const r = subApiRes as { data?: unknown } | undefined;
    const d = r?.data;
    if (d == null || typeof d !== "object" || Array.isArray(d)) return null;
    return d as Record<string, unknown>;
  }, [subApiRes]);

  const existingCourseIds = useMemo(() => {
    const raw = activeSub?.courseIds;
    if (!Array.isArray(raw)) return [];
    return raw.map((item: unknown) => {
      if (item && typeof item === "object" && item !== null && "_id" in item) {
        return String((item as { _id: string })._id);
      }
      return String(item);
    });
  }, [activeSub]);

  const prevTotalLearners = useMemo(() => {
    const n = activeSub?.totalLearners;
    return typeof n === "number" && Number.isFinite(n) ? Math.max(0, n) : 0;
  }, [activeSub]);

  const subCourseById = useMemo(() => {
    const m = new Map<string, CourseRate>();
    const raw = activeSub?.courseIds;
    if (!Array.isArray(raw)) return m;
    for (const item of raw) {
      if (item && typeof item === "object" && item !== null && "_id" in item) {
        const o = item as Record<string, unknown>;
        const id = String(o._id);
        const amount = Number(o.amount);
        const groupAmount = Number(o.groupAmount);
        m.set(id, {
          title: typeof o.title === "string" ? o.title : id,
          amount: Number.isFinite(amount) ? amount : undefined,
          groupAmount: Number.isFinite(groupAmount) ? groupAmount : undefined,
        });
      }
    }
    return m;
  }, [activeSub]);

  useEffect(() => {
    if (!isUpgradeSubscription || subLoading) return;
    if (subError || !hasActiveSubscription(subApiRes)) {
      toast.error("You need an active subscription to upgrade.");
      navigate("/payment", { replace: true, state: { type: "SUBSCRIPTION" } });
    }
  }, [isUpgradeSubscription, subLoading, subError, subApiRes, navigate]);

  const { data: allCoursesRes, isLoading: coursesLoading } = useGetAllCoursesQuery(undefined, {
    skip: !subscriptionFlow,
  });
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedNewCourseIds, setSelectedNewCourseIds] = useState<string[]>([]);
  const [additionalLearners, setAdditionalLearners] = useState(0);

  const allCourses = useMemo(() => {
    const raw = allCoursesRes?.data;
    return Array.isArray(raw) ? (raw as Array<Record<string, unknown>>) : [];
  }, [allCoursesRes?.data]);

  const courseAmount = (course: Record<string, unknown>) => {
    const candidates = [course.amount, course.price, course.subscriptionAmount, course.fee];
    for (const value of candidates) {
      if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
      if (typeof value === "string") {
        const parsed = Number(value);
        if (Number.isFinite(parsed) && parsed > 0) return parsed;
      }
    }
    return 0;
  };

  const courseGroupAmount = (course: Record<string, unknown>) => {
    const candidates = [course.groupAmount, course.group_amount];
    for (const value of candidates) {
      if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
      if (typeof value === "string") {
        const parsed = Number(value);
        if (Number.isFinite(parsed) && parsed >= 0) return parsed;
      }
    }
    return 0;
  };

  const getUpgradeCourseRate = useCallback(
    (id: string): CourseRate | undefined => {
      const cat = allCourses.find((c) => String(c._id ?? "") === id);
      if (cat) {
        return {
          title: String(cat.title ?? id),
          amount: courseAmount(cat),
          groupAmount: courseGroupAmount(cat),
        };
      }
      return subCourseById.get(id);
    },
    [allCourses, subCourseById]
  );

  const upgradeAvailableCourses = useMemo(() => {
    const set = new Set(existingCourseIds);
    return allCourses.filter((c) => !set.has(String(c._id ?? "")));
  }, [allCourses, existingCourseIds]);

  const upgradePricing = useMemo(() => {
    if (!isUpgradeSubscription) {
      return { total: 0, uniqueNewCourseIds: [] as string[], lines: [], error: undefined as string | undefined };
    }
    return computeUpgradeSubscriptionPricing({
      prevTotalLearners,
      newLearnersCount: isOrganization ? additionalLearners : 0,
      existingCourseIds,
      selectedNewCourseIds,
      getCourse: getUpgradeCourseRate,
    });
  }, [
    isUpgradeSubscription,
    isOrganization,
    prevTotalLearners,
    additionalLearners,
    existingCourseIds,
    selectedNewCourseIds,
    getUpgradeCourseRate,
  ]);

  const selectedCourses = useMemo(
    () =>
      allCourses.filter((c) => {
        const id = String(c._id ?? "");
        return id && selectedCourseIds.includes(id);
      }),
    [allCourses, selectedCourseIds]
  );

  const learnersForBilling = isOrganization && isSubscription ? Math.max(1, totalLearners) : 0;
  const useGroupCourseRate = isOrganization && learnersForBilling >= 3;

  const coursesSubtotal = useMemo(() => {
    if (!isSubscription || selectedCourses.length === 0) return 0;
    if (isOrganization) {
      const n = learnersForBilling;
      return selectedCourses.reduce((sum, c) => {
        const perLearner = useGroupCourseRate ? courseGroupAmount(c) : courseAmount(c);
        return sum + n * perLearner;
      }, 0);
    }
    return selectedCourses.reduce((sum, c) => sum + courseAmount(c), 0);
  }, [isSubscription, isOrganization, selectedCourses, learnersForBilling, useGroupCourseRate]);

  const total = useMemo(() => {
    if (isUpgradeSubscription) {
      if (upgradePricing.error || upgradePricing.total <= 0) return undefined;
      return upgradePricing.total;
    }
    if (isSubscription) {
      if (coursesSubtotal <= 0) return undefined;
      return Math.round(coursesSubtotal * 100) / 100;
    }
    if (typeof totalFromState === "number" && !Number.isNaN(totalFromState) && totalFromState > 0) {
      return totalFromState;
    }
    return undefined;
  }, [isUpgradeSubscription, isSubscription, upgradePricing.error, upgradePricing.total, coursesSubtotal, totalFromState]);

 

  const orgSubscriptionLines = useMemo(() => {
    if (!isSubscription || !isOrganization || selectedCourses.length === 0) return [];
    const n = learnersForBilling;
    return selectedCourses.map((c) => {
      const title = String(c.title ?? "Course");
      const perLearner = useGroupCourseRate ? courseGroupAmount(c) : courseAmount(c);
      const lineTotal = Math.round(n * perLearner * 100) / 100;
      return {
        id: String(c._id ?? ""),
        title,
        perLearner,
        learners: n,
        lineTotal,
        rateLabel: useGroupCourseRate ? "Group rate (3+ learners)" : "Standard rate (1–2 learners)",
      };
    });
  }, [isSubscription, isOrganization, selectedCourses, learnersForBilling, useGroupCourseRate]);

  const learnerSubscriptionLines = useMemo(() => {
    if (!isSubscription || isOrganization || selectedCourses.length === 0) return [];
    return selectedCourses.map((c) => ({
      id: String(c._id ?? ""),
      title: String(c.title ?? "Course"),
      amount: courseAmount(c),
    }));
  }, [isSubscription, isOrganization, selectedCourses]);

  const courseType = location.state?.courseType;
  const numberOfSeats = location.state?.numberOfSeats;
  const subscriptionType = location.state?.subscriptionType;

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState("");

  const { data: paymentData } = usePaymentConfigQuery({});
  const [createPaymentIntent] = usePaymentIntentMutation();

  useEffect(() => {
    if (paymentData?.publishableKey) {
      setStripePromise(loadStripe(paymentData.publishableKey));
    }
  }, [paymentData]);

  useEffect(() => {
    if (total == null || Number.isNaN(total) || total <= 0) {
      if (type === "SUBSCRIPTION" || type === "UPGRADE_SUBSCRIPTION") {
        setClientSecret("");
        return;
      }
      toast.error("Invalid payment amount");
      navigate("/", { replace: true });
      return;
    }

    let cancelled = false;

    const createIntent = async () => {
      const intentPayload: Record<string, unknown> = {
        amount: total,
        currency: "usd",
      };
      if (type === "QUIZ_RETAKE") {
        intentPayload.lessonId = lessonId;
        intentPayload.learnerId = learnerId;
        intentPayload.kind = "QUIZ_RETAKE";
      }
      try {
        const res = await createPaymentIntent(intentPayload as any).unwrap();

        if (!cancelled && res?.clientSecret) {
          setClientSecret(res.clientSecret);
        }
      } catch (err: unknown) {
        const msg =
          err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
            ? String((err.data as { message: string }).message)
            : "Failed to create payment intent";
        toast.error(msg);
        if (type === "SUBSCRIPTION" || type === "UPGRADE_SUBSCRIPTION") {
          navigate(isUpgradeSubscription ? returnPath : "/login", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    };

    createIntent();
    return () => {
      cancelled = true;
    };
  }, [total, type, lessonId, learnerId, createPaymentIntent, navigate, isUpgradeSubscription, returnPath]);

  const [isProcessing, setIsProcessing] = useState(false);

  const toggleCourse = (courseId: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const toggleNewCourse = (courseId: string) => {
    setSelectedNewCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleSignOut = async () => {
    try {
      await logout().unwrap();
    } catch {
      /* still clear client state */
    }
    dispatch(removeUser());
    navigate("/login", { replace: true });
  };

  const checkoutFormInner = clientSecret && stripePromise && (
    <Elements stripe={stripePromise} options={{ clientSecret }} key={clientSecret}>
      <CheckoutForm
        type={type}
        amount={total}
        clientSecret={clientSecret}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        courseType={courseType}
        numberOfSeats={numberOfSeats}
        subscriptionType={subscriptionType}
        lessonId={lessonId}
        courseIds={isUpgradeSubscription ? selectedNewCourseIds : selectedCourseIds}
        totalLearners={isOrganization && isSubscription ? learnersForBilling : 0}
        upgradeNewLearnersCount={isUpgradeSubscription ? (isOrganization ? additionalLearners : 0) : undefined}
        returnPath={isUpgradeSubscription ? returnPath : undefined}
      />
    </Elements>
  );

  if (isUpgradeSubscription) {
    if (subLoading || coursesLoading) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-muted text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-sm">Loading upgrade options…</p>
        </div>
      );
    }

    const totalAfter = prevTotalLearners + (showUpgradeSeatControls ? additionalLearners : 0);
    const newCourseLines = upgradePricing.lines.filter((l) => l.section === "new_courses");
    const newSeatLines = upgradePricing.lines.filter((l) => l.section === "new_seats");
    return (
      <div className="min-h-screen bg-muted">
        <div className="container-wide mx-auto max-w-6xl px-4 py-6 lg:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="-ml-2 mb-2 h-9 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => navigate(returnPath)}
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                Go Back
              </Button>
              <h1 className="font-heading text-2xl font-bold text-foreground">Upgrade Plan</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Add published courses not already on your plan and/or increase learner seats. New seats apply the rate for your learner count
                after upgrade across all included courses.
              </p>
            </div>
            <Button variant="ghost" size="sm" type="button" onClick={handleSignOut} className="shrink-0 self-start sm:self-center">
              Sign out
            </Button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
            <div className="min-w-0 space-y-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {!isStandaloneSubscriberLearner && <div className="rounded-lg border border-border bg-card px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current learners</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{prevTotalLearners}</p>
                </div>}
                <div className="rounded-lg border border-border bg-card px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Courses on plan</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{existingCourseIds.length}</p>
                </div>
                {!isStandaloneSubscriberLearner && <div className="rounded-lg border border-border bg-card px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">After upgrade</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{totalAfter} learners</p>
                </div>}
              </div>

              <div className="space-y-3 rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-medium text-foreground">Add courses</p>
                <p className="text-xs text-muted-foreground">Only courses not already on your subscription are listed.</p>
                {upgradeAvailableCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No additional published courses available.</p>
                ) : (
                  <div className="max-h-[min(36vh,280px)] space-y-2 overflow-auto pr-1">
                    {upgradeAvailableCourses.map((course) => {
                      const id = String(course._id ?? "");
                      if (!id) return null;
                      const title = String(course.title ?? "Untitled course");
                      const amount = courseAmount(course);
                      const groupAmt = courseGroupAmount(course);
                      const selected = selectedNewCourseIds.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleNewCourse(id)}
                          className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-sm font-medium text-foreground">{title}</p>
                            {isOrganization ? (
                            <p className="text-xs text-muted-foreground">
                              Standard Rate (1–2 Learners): ${amount.toFixed(2)} per Learner <br />
                              Group Rate (3+ Learners): ${groupAmt.toFixed(2)} per Learner
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">${amount.toFixed(2)} USD</p>
                          )}
                          </div>
                          {selected ? <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> : null}
                        </button>
                      );
                    })}
                  </div>
                )}

                {showUpgradeSeatControls ? (
                  <div className="space-y-2 border-t border-border pt-3">
                    <Label htmlFor="upgrade-additional-learners" className="text-sm font-medium text-foreground">
                      Additional learner seats
                    </Label>
                    <Input
                      id="upgrade-additional-learners"
                      type="number"
                      min={0}
                      step={1}
                      className="[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      value={additionalLearners}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (Number.isNaN(v)) setAdditionalLearners(0);
                        else setAdditionalLearners(Math.max(0, v));
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Added to your current {prevTotalLearners} learner{prevTotalLearners !== 1 ? "s" : ""}. New-seat pricing uses the
                      tier for {totalAfter} total learner{totalAfter !== 1 ? "s" : ""}.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-foreground">Upgrade summary</h2>
                <Separator className="my-4" />
                {upgradePricing.error ? (
                  <p className="text-sm text-destructive">{upgradePricing.error}</p>
                ) : selectedNewCourseIds.length === 0 && (showUpgradeSeatControls ? additionalLearners <= 0 : true) ? (
                  <p className="text-sm text-muted-foreground">Select new courses.</p>
                ) : (
                  <div className="space-y-6">
                    {newCourseLines.length > 0 ? (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          New courses
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-border">
                          <table className="w-full min-w-[280px] text-left text-sm">
                            <thead>
                              <tr className="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                <th className="px-3 py-2">Course</th>
                                <th className="px-3 py-2 text-right">Per Head</th>
                                <th className="px-3 py-2 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {newCourseLines.map((line) => (
                                <tr key={`nc-${line.courseId}`} className="border-b border-border/80 last:border-0">
                                  <td className="px-3 py-2.5 align-top">
                                    <span className="font-medium text-foreground">{line.title}</span>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                      {isOrganization ? line.tierLabel : "Standard rate"}
                                    </p>
                                    {isOrganization ? <p className="text-xs text-muted-foreground">× {line.learners} learners</p> : null}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums">${line.perSeat.toFixed(2)}</td>
                                  <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium tabular-nums">
                                    ${line.subtotal.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}

                    {showUpgradeSeatControls && newSeatLines.length > 0 ? (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Additional seats (all courses after upgrade)
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-border">
                          <table className="w-full min-w-[280px] text-left text-sm">
                            <thead>
                              <tr className="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                <th className="px-3 py-2">Course</th>
                                <th className="px-3 py-2 text-right">Per seat</th>
                                <th className="px-3 py-2 text-right">Line</th>
                              </tr>
                            </thead>
                            <tbody>
                              {newSeatLines.map((line) => (
                                <tr key={`ns-${line.courseId}`} className="border-b border-border/80 last:border-0">
                                  <td className="px-3 py-2.5 align-top">
                                    <span className="font-medium text-foreground">{line.title}</span>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                      {isOrganization ? line.tierLabel : "Standard rate"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">× {line.newSeats} new seats</p>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums">${line.perSeat.toFixed(2)}</td>
                                  <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium tabular-nums">
                                    ${line.subtotal.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}

                    <Separator />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-muted-foreground">Total due</span>
                      <span className="font-heading text-xl font-bold text-secondary tabular-nums">
                        ${(total ?? 0).toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 space-y-3 lg:sticky lg:top-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">Pay securely</h2>
                <p className="text-xs text-muted-foreground">Card is authorized first; your subscription updates after successful payment.</p>
              </div>
              {checkoutFormInner ? (
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">{checkoutFormInner}</div>
              ) : !total || total <= 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    Configure an upgrade above to load the payment form. Total must be greater than zero.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-14 text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="text-sm">Loading payment form…</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSubscription) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="container-wide mx-auto max-w-lg space-y-6 py-10">
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-heading text-2xl font-bold text-foreground">Payment</h1>
            <Button variant="ghost" size="sm" type="button" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
          {total != null ? (
            <p className="text-lg font-semibold text-foreground">
              Total: <span className="text-secondary">${total.toFixed(2)} USD</span>
            </p>
          ) : null}
          {checkoutFormInner ? (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">{checkoutFormInner}</div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="text-sm">Loading payment form…</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="container-wide mx-auto max-w-6xl px-4 py-6 lg:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Platform Fees</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {isOrganization
                ? "Choose courses and enter learner count. With 3 or more learners, per-learner course pricing uses each course’s group rate; otherwise the standard course amount applies per learner."
                : "Choose the courses to include. Your total is the sum of each course’s listed amount."}
            </p>
          </div>
          <Button variant="ghost" size="sm" type="button" onClick={handleSignOut} className="shrink-0 self-start sm:self-center">
            Sign out
          </Button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
          <div className="min-w-0 space-y-6">
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground">Select courses</p>
              {coursesLoading ? (
                <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading courses…
                </div>
              ) : allCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No courses available for subscription.</p>
              ) : (
                <div className="max-h-[min(40vh,320px)] space-y-2 overflow-auto pr-1 lg:max-h-[280px]">
                  {allCourses.map((course) => {
                    const id = String(course._id ?? "");
                    if (!id) return null;
                    const title = String(course.title ?? "Untitled course");
                    const amount = courseAmount(course);
                    const groupAmt = courseGroupAmount(course);
                    const selected = selectedCourseIds.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleCourse(id)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-sm font-medium text-foreground">{title}</p>
                          {isOrganization ? (
                            <p className="text-xs text-muted-foreground">
                              Standard Rate (1–2 Learners): ${amount.toFixed(2)} per Learner <br />
                              Group Rate (3+ Learners): ${groupAmt.toFixed(2)} per Learner
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">${amount.toFixed(2)} USD</p>
                          )}
                        </div>
                        {selected ? <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> : null}
                      </button>
                    );
                  })}
                </div>
              )}
              {isOrganization ? (
                <div className="space-y-2 border-t border-border pt-3">
                  <Label htmlFor="org-learner-count" className="text-sm font-medium text-foreground">
                    Number of learners
                  </Label>
                  <Input
                    id="org-learner-count"
                    type="number"
                    min={1}
                    step={1}
                    className="[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    value={totalLearners}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (Number.isNaN(v)) setTotalLearners(1);
                      else setTotalLearners(Math.max(1, v));
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {useGroupCourseRate
                      ? `Group pricing: ${learnersForBilling} learners × group rate per selected course.`
                      : `Standard pricing: ${learnersForBilling} learner${learnersForBilling !== 1 ? "s" : ""} × standard amount per selected course.`}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-foreground">Payment summary</h2>
              <p className="mt-1 text-xs text-muted-foreground">Review line items before entering your card on the right.</p>
              <Separator className="my-4" />
              {selectedCourseIds.length === 0 ? (
                <p className="text-sm text-muted-foreground">Select at least one course to see amounts.</p>
              ) : isOrganization ? (
                <div className="space-y-4">
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="rounded-lg bg-muted/60 px-3 py-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Learners</p>
                      <p className="font-semibold text-foreground">{learnersForBilling}</p>
                    </div>
                    <div className="rounded-lg bg-muted/60 px-3 py-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pricing tier</p>
                      <p className="font-semibold text-foreground">{useGroupCourseRate ? "Group (3+)" : "Standard (1–2)"}</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full min-w-[280px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <th className="px-3 py-2">Course</th>
                          <th className="px-3 py-2 text-right">Per learner</th>
                          <th className="px-3 py-2 text-right">Line total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orgSubscriptionLines.map((line) => (
                          <tr key={line.id} className="border-b border-border/80 last:border-0">
                            <td className="px-3 py-2.5 align-top">
                              <span className="font-medium text-foreground">{line.title}</span>
                              <p className="mt-0.5 text-xs text-muted-foreground">{line.rateLabel}</p>
                              <p className="text-xs text-muted-foreground">× {line.learners} learners</p>
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-foreground">
                              ${line.perLearner.toFixed(2)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium tabular-nums text-foreground">
                              ${line.lineTotal.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Total due</span>
                    <span className="font-heading text-xl font-bold text-secondary tabular-nums">${(total ?? 0).toFixed(2)} USD</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <ul className="space-y-2">
                    {learnerSubscriptionLines.map((line) => (
                      <li
                        key={line.id}
                        className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 text-sm last:border-0 last:pb-0"
                      >
                        <span className="min-w-0 text-foreground">{line.title}</span>
                        <span className="shrink-0 tabular-nums font-medium text-foreground">${line.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Total due</span>
                    <span className="font-heading text-xl font-bold text-secondary tabular-nums">${(total ?? 0).toFixed(2)} USD</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 space-y-3 lg:sticky lg:top-6">
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Pay securely</h2>
              <p className="text-xs text-muted-foreground">Enter your card details below. Amount matches the summary.</p>
            </div>
            {checkoutFormInner ? (
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">{checkoutFormInner}</div>
            ) : !total || total <= 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-12 text-center">
                <p className="text-sm text-muted-foreground">Select at least one course with a valid price to load the payment form.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-14 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin" />
                <p className="text-sm">Loading payment form…</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
