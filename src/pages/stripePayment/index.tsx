import CheckoutForm from "@/components/checkoutForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLogoutMutation } from "@/redux/services/apiSlices/authSlice";
import { useGetAllCoursesQuery } from "@/redux/services/apiSlices/courseSlice";
import { usePaymentConfigQuery, usePaymentIntentMutation } from "@/redux/services/apiSlices/paymentSlice";
import { removeUser } from "@/redux/services/Slices/userSlice";
import { RootState } from "@/redux/store";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  const user = useSelector((state: RootState) => state.user.userData) as { role?: string } | undefined;
  const isOrganization = String(user?.role ?? "").toLowerCase().trim() === "organization";

  const type = location.state?.type as string | undefined;
  const totalFromState = location.state?.total as number | undefined;
  const isSubscription = type === "SUBSCRIPTION";

  const [totalLearners, setTotalLearners] = useState(0);
  useEffect(() => {
    if (isOrganization && isSubscription) {
      setTotalLearners((n) => (n < 1 ? 1 : n));
    } else {
      setTotalLearners(0);
    }
  }, [isOrganization, isSubscription]);

  const { data: allCoursesRes, isLoading: coursesLoading } = useGetAllCoursesQuery(undefined, {
    skip: !isSubscription,
  });
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

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

  /** Per-learner rate when org has 3+ learners (matches backend confirmSubscriptionWithPayment). */
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
  }, [
    isSubscription,
    isOrganization,
    selectedCourses,
    learnersForBilling,
    useGroupCourseRate,
  ]);

  const total = useMemo(() => {
    if (isSubscription) {
      if (coursesSubtotal <= 0) return undefined;
      return Math.round(coursesSubtotal * 100) / 100;
    }
    if (typeof totalFromState === "number" && !Number.isNaN(totalFromState) && totalFromState > 0) {
      return totalFromState;
    }
    return undefined;
  }, [isSubscription, coursesSubtotal, totalFromState]);

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
      if (type === "SUBSCRIPTION") {
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
        if (type === "SUBSCRIPTION") {
          navigate("/login", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    };

    createIntent();
    return () => {
      cancelled = true;
    };
  }, [total, type, lessonId, learnerId, createPaymentIntent, navigate]);

  const [isProcessing, setIsProcessing] = useState(false);

  const toggleCourse = (courseId: string) => {
    setSelectedCourseIds((prev) =>
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
        courseIds={selectedCourseIds}
        totalLearners={isOrganization ? learnersForBilling : 0}
      />
    </Elements>
  );

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
                              ${amount.toFixed(2)}/learner (1–2) · ${groupAmt.toFixed(2)}/learner (3+ group)
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
              <p className="mt-1 text-xs text-muted-foreground">
                Review line items before entering your card on the right.
              </p>
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
                      <p className="font-semibold text-foreground">
                        {useGroupCourseRate ? "Group (3+)" : "Standard (1–2)"}
                      </p>
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
                    <span className="font-heading text-xl font-bold text-secondary tabular-nums">
                      ${(total ?? 0).toFixed(2)} USD
                    </span>
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
              <p className="text-xs text-muted-foreground">Enter your card details below. Amount matches the summary.</p>
            </div>
            {checkoutFormInner ? (
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">{checkoutFormInner}</div>
            ) : !total || total <= 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Select at least one course with a valid price to load the payment form.
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
};

export default Payment;
