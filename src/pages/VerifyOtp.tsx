import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import fgiLogo from "@/assets/fgi-logo.png";
import { toast } from "sonner";
import { useVerifyOtpMutation } from "@/redux/services/apiSlices/authSlice";
import type { LoginRole } from "@/types/loginRole";

type LocationState = { email?: string; role?: LoginRole };

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [code, setCode] = useState("");

  const state = location.state as LocationState | null;
  const email = state?.email;
  const role = state?.role ?? "learner";

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = (await verifyOtp({ email, code }).unwrap()) as { status?: boolean; message?: string };
      if (res?.status) {
        toast.success("Verification successful");
        navigate("/recover-password", { state: { email, code, role } });
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Failed to verify code";
      toast.error(message);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-block mb-8">
            <img src={fgiLogo} alt="FGI Logo" className="h-16 w-16" />
          </Link>

          <Card className="border-border shadow-sm">
            <CardContent className="pt-8 pb-8 px-6 sm:px-8">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Enter verification code</h1>
              <p className="text-sm text-muted-foreground mb-6">
                We sent a code to <span className="font-medium text-foreground">{email}</span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp">Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={4}
                    minLength={4}
                    required
                    placeholder="0000"
                    className="text-center text-lg tracking-[0.4em] font-mono"
                    value={code}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setCode(val);
                    }}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" variant="secondary" size="lg" className="w-full font-heading font-semibold" disabled={isLoading}>
                  {isLoading ? "Verifying…" : "Continue"}
                </Button>

                <div className="flex flex-col gap-2 text-center text-sm">
                  <Link to="/forgot-password" state={{ role }} className="text-secondary hover:underline">
                    Resend or change email
                  </Link>
                  <Link to="/login" className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center p-12">
        <p className="font-heading text-2xl font-bold text-primary-foreground text-center max-w-md">
          Check your inbox for the verification code.
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
