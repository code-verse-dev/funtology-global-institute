import CheckoutForm from "@/components/checkoutForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useGetLearnerSeatFeeQuery } from "@/redux/services/apiSlices/subscriptionSlice";

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

  const {
    data: learnerSeatFeeRes,
    isLoading: seatFeeLoading,
    isError: seatFeeError,
  } = useGetLearnerSeatFeeQuery(undefined, {
    skip: !isSubscription || !isOrganization,
  });

  const feeUsd = useMemo(() => {
    const raw = (learnerSeatFeeRes as { data?: { feeUsd?: unknown } } | undefined)?.data?.feeUsd;
    if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) return raw;
    if (typeof raw === "string") {
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed >= 0) return parsed;
    }
    return null;
  }, [learnerSeatFeeRes]);

  const needsSeatFee = isSubscription && isOrganization;
  const seatFeeResolved = !needsSeatFee || feeUsd !== null;

  useEffect(() => {
    if (needsSeatFee && seatFeeError) {
      toast.error("Could not load learner seat fee.");
    }
  }, [needsSeatFee, seatFeeError]);

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

  const selectedCourses = useMemo(
    () =>
      allCourses.filter((c) => {
        const id = String(c._id ?? "");
        return id && selectedCourseIds.includes(id);
      }),
    [allCourses, selectedCourseIds]
  );

  const coursesSubtotal = useMemo(
    () => selectedCourses.reduce((sum, c) => sum + courseAmount(c), 0),
    [selectedCourses],
  );

  const learnersForBilling = needsSeatFee ? Math.max(1, totalLearners) : 0;
  const seatFeesTotal = needsSeatFee && feeUsd !== null ? feeUsd * learnersForBilling : 0;

  const total = useMemo(() => {
    if (isSubscription) {
      if (!seatFeeResolved || coursesSubtotal <= 0) return undefined;
      return coursesSubtotal + seatFeesTotal;
    }
    if (typeof totalFromState === "number" && !Number.isNaN(totalFromState) && totalFromState > 0) {
      return totalFromState;
    }
    return undefined;
  }, [isSubscription, coursesSubtotal, seatFeesTotal, seatFeeResolved, totalFromState]);

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
  }, [total, type, lessonId, user, createPaymentIntent, navigate]);

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

  return (
    <div className="min-h-screen bg-muted">
      <div className="container-wide py-10 max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {isSubscription ? "Platform Fees" : "Payment"}
            </h1>
            {isSubscription ? (
              <p className="text-sm text-muted-foreground mt-1">
                Select courses and applicable fees. The total is calculated based on selected courses and the number of learners.
              </p>
            ) : null}
          </div>
          <Button variant="ghost" size="sm" type="button" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>

        {isSubscription ? (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">Select courses</p>
            {coursesLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading courses…
              </div>
            ) : allCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses available for subscription.</p>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
                {allCourses.map((course) => {
                  const id = String(course._id ?? "");
                  if (!id) return null;
                  const title = String(course.title ?? "Untitled course");
                  const amount = courseAmount(course);
                  const selected = selectedCourseIds.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleCourse(id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left transition flex items-center justify-between ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{title}</p>
                        <p className="text-xs text-muted-foreground">${amount.toFixed(2)} USD</p>
                      </div>
                      {selected ? <CheckCircle2 className="h-4 w-4 text-primary" /> : null}
                    </button>
                  );
                })}
              </div>
            )}
            {isOrganization && isSubscription ? (
              <div className="space-y-2 pt-2 border-t border-border">
                <Label htmlFor="org-learner-count" className="text-sm font-medium text-foreground">
                  Number of learners
                </Label>
                <Input
                  id="org-learner-count"
                  type="number"
                  min={1}
                  step={1}
                  className="[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={totalLearners}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (Number.isNaN(v)) setTotalLearners(1);
                    else setTotalLearners(Math.max(1, v));
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  {feeUsd !== null
                    ? `Learner fee: $${feeUsd.toFixed(2)} USD per learner × ${learnersForBilling}`
                    : seatFeeLoading
                      ? "Loading learner fee…"
                      : "Learner fee unavailable"}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {isSubscription && isOrganization && seatFeeLoading ? (
          <p className="text-sm text-muted-foreground">Loading seat pricing…</p>
        ) : null}

        {total != null ? (
          <div className="space-y-1">
            {isSubscription ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Courses subtotal:{" "}
                  <span className="text-foreground font-medium">${coursesSubtotal.toFixed(2)} USD</span>
                </p>
                {needsSeatFee && feeUsd !== null ? (
                  <p className="text-sm text-muted-foreground">
                    Learner seats ({learnersForBilling} × ${feeUsd.toFixed(2)}):{" "}
                    <span className="text-foreground font-medium">${seatFeesTotal.toFixed(2)} USD</span>
                  </p>
                ) : null}
              </>
            ) : null}
            <p className="text-lg font-semibold text-foreground">
              Total: <span className="text-secondary">${total.toFixed(2)} USD</span>
            </p>
          </div>
        ) : null}

        {clientSecret && stripePromise ? (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
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
          </div>
        ) : isSubscription && (!total || total <= 0) ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
            <p className="text-sm">
              {needsSeatFee && seatFeeError
                ? "Could not load seat pricing. Refresh the page or try again later."
                : isOrganization && (seatFeeLoading || !seatFeeResolved)
                  ? "Loading pricing…"
                  : "Select at least one course to continue."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="text-sm">Loading payment form…</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
