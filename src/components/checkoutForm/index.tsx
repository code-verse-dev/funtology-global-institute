import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RootState } from "@/redux/store";
import {
  useGetSavedPaymentMethodsQuery,
  useQuizRetakePaymentMutation,
  useSubscriptionPaymentMutation,
} from "@/redux/services/apiSlices/paymentSlice";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { PaymentIntentResult } from "@stripe/stripe-js";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { AlertCircle, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

type PaymentResultState =
  | { open: false }
  | {
      open: true;
      success: true;
      message: string;
      onContinue: () => void;
    }
  | { open: true; success: false; message: string };

function effectiveRole(userRole: unknown): string {
  const r = String(userRole ?? "").toLowerCase().trim();
  if (r) return r;
  const token = Cookies.get("accessToken");
  if (!token) return "";
  try {
    return String(jwtDecode<{ role?: string }>(token).role ?? "")
      .toLowerCase()
      .trim();
  } catch {
    return "";
  }
}

interface CheckoutFormProps {
  type?: string;
  lessonId?: string;
  courseIds?: string[];
  amount?: number;
  clientSecret?: string;
  subscriptionType?: string;
  numberOfSeats?: number;
  courseType?: string;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  totalLearners?: number;
}

const CheckoutForm = ({
  type,
  lessonId,
  courseIds = [],
  clientSecret,
  isProcessing,
  setIsProcessing,
  totalLearners,
}: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user.userData) as { role?: string } | undefined;

  const [message, setMessage] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResultState>({ open: false });

  const [createSubscription] = useSubscriptionPaymentMutation();
  const [confirmQuizRetakePayment] = useQuizRetakePaymentMutation();

  const { data: paymentData, isLoading: cardsLoading } = useGetSavedPaymentMethodsQuery();
  const savedCards: unknown[] = paymentData?.data?.data ?? [];

  const selectedCard = savedCards.find((c) => typeof c === "object" && c !== null && "id" in c && (c as { id: string }).id === selectedCardId) as
    | { id: string; card?: { brand?: string; last4?: string; exp_month?: number; exp_year?: number } }
    | undefined;

  const navigateAfterSubscription = () => {
    if (effectiveRole(user?.role) === "organization") {
      navigate("/organization/overview", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  const savePayment = async (paymentIntent: { id: string }) => {
    try {
      if (type === "SUBSCRIPTION") {
        const res = await createSubscription({
          data: {
            paymentIntentId: paymentIntent.id,
            type: "SUBSCRIPTION",
            courseIds,
            totalLearners,
          },
        }).unwrap();
        if (res?.status) {
          setPaymentResult({
            open: true,
            success: true,
            message: res?.message || "Your subscription is active. Thank you for your payment.",
            onContinue: navigateAfterSubscription,
          });
        } else {
          setPaymentResult({
            open: true,
            success: false,
            message:
              res?.data?.error?.message ||
              res?.error?.message ||
              res?.message ||
              "We could not complete your subscription. Please try again or contact support.",
          });
        }
      } else if (type === "QUIZ_RETAKE") {
        const res = await confirmQuizRetakePayment({
          data: { paymentIntentId: paymentIntent.id },
        }).unwrap();
        if (res?.status) {
          const from = (location.state as { from?: string } | null)?.from;
          const go =
            typeof from === "string" && from.length > 0
              ? () => navigate(from, { replace: true, state: { retakePaid: true } })
              : () => navigate("/dashboard/courses", { replace: true });
          setPaymentResult({
            open: true,
            success: true,
            message: res?.message || "Quiz retake payment completed. You can continue to your quiz.",
            onContinue: go,
          });
        } else {
          setPaymentResult({
            open: true,
            success: false,
            message:
              res?.data?.error?.message ||
              res?.error?.message ||
              res?.message ||
              "Payment could not be confirmed. Please try again.",
          });
        }
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "An unexpected error occurred.";
      setPaymentResult({ open: true, success: false, message: msg });
    }
  };

  const closePaymentResult = () => setPaymentResult({ open: false });

  const handlePaymentResultContinue = () => {
    if (paymentResult.open && paymentResult.success) {
      const fn = paymentResult.onContinue;
      closePaymentResult();
      fn();
    }
  };

  const handleSavedCardPayment = async () => {
    if (!stripe || !clientSecret || !selectedCard) return;
    setIsProcessing(true);
    setMessage("");
    try {
      let result: PaymentIntentResult;
      if (type === "SUBSCRIPTION") {
        result = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            payment_method: selectedCard.id,
          },
          redirect: "if_required",
        });
      } else {
        result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: selectedCard.id,
        });
      }
      if (result.error) {
        setMessage(result.error.message || "Payment failed.");
      } else if (result.paymentIntent) {
        const st = result.paymentIntent.status;
        if (st === "succeeded" || st === "requires_capture") {
          await savePayment(result.paymentIntent);
        } else {
          setMessage(`Payment status: ${st}`);
        }
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage("");
    if (!stripe || !elements) {
      setMessage("Stripe has not loaded yet.");
      setIsProcessing(false);
      return;
    }
    try {
      const result: PaymentIntentResult = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: "if_required",
      });
      if (result.error) {
        setMessage(result.error.message || "An unexpected error occurred.");
      } else if (result.paymentIntent) {
        const st = result.paymentIntent.status;
        if (st === "succeeded" || st === "requires_capture") {
          await savePayment(result.paymentIntent);
        } else {
          setMessage(`Payment status: ${st}`);
        }
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative space-y-6">
      <Dialog
        open={paymentResult.open}
        onOpenChange={(open) => {
          if (!open && paymentResult.open) {
            if (paymentResult.success) return;
            closePaymentResult();
          }
        }}
      >
        <DialogContent
          className={
            paymentResult.open && paymentResult.success
              ? "max-w-[min(100vw-2rem,28rem)] gap-0 border-0 p-0 shadow-2xl sm:max-w-md [&>button]:hidden"
              : "max-w-[min(100vw-2rem,28rem)] gap-0 border-0 p-0 shadow-2xl sm:max-w-md"
          }
          onPointerDownOutside={(e) => {
            if (paymentResult.open && paymentResult.success) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (paymentResult.open && paymentResult.success) e.preventDefault();
          }}
        >
          {paymentResult.open ? (
            paymentResult.success ? (
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-background px-8 pb-6 pt-10 text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 ring-8 ring-primary/10">
                    <CheckCircle2 className="h-11 w-11 text-primary" strokeWidth={2} />
                  </div>
                  <DialogHeader className="space-y-3 text-center sm:text-center">
                    <DialogTitle className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                      Payment successful
                    </DialogTitle>
                    <DialogDescription className="text-base leading-relaxed text-muted-foreground">
                      {paymentResult.message}
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <DialogFooter className="flex-col gap-2 border-t border-border bg-muted/30 px-6 py-5 sm:flex-col">
                  <Button type="button" size="lg" className="w-full font-heading text-base font-semibold" onClick={handlePaymentResultContinue}>
                    Continue
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-destructive/20 bg-card">
                <div className="bg-gradient-to-br from-destructive/10 via-destructive/5 to-background px-8 pb-6 pt-10 text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/15 ring-8 ring-destructive/10">
                    <AlertCircle className="h-11 w-11 text-destructive" strokeWidth={2} />
                  </div>
                  <DialogHeader className="space-y-3 text-center sm:text-center">
                    <DialogTitle className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                      Payment could not be completed
                    </DialogTitle>
                    <DialogDescription className="text-base leading-relaxed text-muted-foreground">
                      {paymentResult.message}
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <DialogFooter className="border-t border-border bg-muted/30 px-6 py-5">
                  <Button type="button" variant="secondary" size="lg" className="w-full font-heading text-base font-semibold" onClick={closePaymentResult}>
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )
          ) : null}
        </DialogContent>
      </Dialog>

      {isProcessing && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Processing payment…</p>
        </div>
      )}

      {cardsLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading saved cards…
        </div>
      ) : savedCards.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold">Saved cards</p>
          <div className="space-y-2">
            {savedCards.map((raw) => {
              const pm = raw as {
                id: string;
                card?: { brand?: string; last4?: string; exp_month?: number; exp_year?: number };
              };
              const brand = pm?.card?.brand ?? "card";
              const last4 = pm?.card?.last4 ?? "****";
              const expMonth = String(pm?.card?.exp_month ?? "").padStart(2, "0");
              const expYear = String(pm?.card?.exp_year ?? "").slice(-2);
              const isSelected = selectedCardId === pm.id;

              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setSelectedCardId(isSelected ? null : pm.id)}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold capitalize">{brand} ****{last4}</p>
                      <p className="text-xs text-muted-foreground">
                        Expires {expMonth}/{expYear}
                      </p>
                    </div>
                  </div>
                  {isSelected ? <CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> : null}
                </button>
              );
            })}
          </div>

          {selectedCard ? (
            <Button type="button" className="w-full mt-2" disabled={isProcessing} onClick={handleSavedCardPayment}>
              Pay with saved card
            </Button>
          ) : null}

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">or use a new card</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </div>
      ) : null}

      {!selectedCard && (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement id="payment-element" />
          <Button type="submit" className="w-full sm:w-auto" id="submit" disabled={isProcessing || !stripe || !elements}>
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </span>
            ) : (
              "Pay now"
            )}
          </Button>
          {message ? <p className="text-sm text-destructive font-medium">{message}</p> : null}
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
