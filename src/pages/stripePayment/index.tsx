import CheckoutForm from "@/components/checkoutForm";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PRICE_USD } from "@/constants/subscription";
import { useLogoutMutation } from "@/redux/services/apiSlices/authSlice";
import { usePaymentConfigQuery, usePaymentIntentMutation } from "@/redux/services/apiSlices/paymentSlice";
import { removeUser } from "@/redux/services/Slices/userSlice";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const type = location.state?.type as string | undefined;
  const totalFromState = location.state?.total as number | undefined;

  const total = useMemo(() => {
    if (typeof totalFromState === "number" && !Number.isNaN(totalFromState) && totalFromState > 0) {
      return totalFromState;
    }
    if (type === "SUBSCRIPTION") {
      return SUBSCRIPTION_PRICE_USD;
    }
    return undefined;
  }, [totalFromState, type]);

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
        toast.error("Invalid subscription checkout. Please try signing in again.");
        navigate("/login", { replace: true });
        return;
      }
      toast.error("Invalid payment amount");
      navigate("/", { replace: true });
      return;
    }

    let cancelled = false;

    const createIntent = async () => {
      try {
        const res = await createPaymentIntent({
          amount: Math.round(total * 100),
          currency: "usd",
        }).unwrap();

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
  }, [total, type, createPaymentIntent, navigate]);

  const [isProcessing, setIsProcessing] = useState(false);

  const isSubscription = type === "SUBSCRIPTION";

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
              {isSubscription ? "Platform subscription" : "Payment"}
            </h1>
            {isSubscription ? (
              <p className="text-sm text-muted-foreground mt-1">
                Complete your ${SUBSCRIPTION_PRICE_USD} USD subscription to continue using FGI as a learner or organization account.
              </p>
            ) : null}
          </div>
          <Button variant="ghost" size="sm" type="button" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>

        {total != null ? (
          <p className="text-lg font-semibold text-foreground">
            Total: <span className="text-secondary">${total.toFixed(2)} USD</span>
          </p>
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
              />
            </Elements>
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
