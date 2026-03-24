import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import fgiLogo from "@/assets/fgi-logo.png";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/services/apiSlices/authSlice";
import type { LoginRole } from "@/types/loginRole";

type LocationState = { email?: string; code?: string; role?: LoginRole };

const RecoverPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const state = location.state as LocationState | null;
  const email = state?.email;
  const code = state?.code;
  const role = state?.role ?? "learner";

  useEffect(() => {
    if (!email || !code) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, code, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) return;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = (await resetPassword({ email, code, password, type: role }).unwrap()) as {
        status?: boolean;
        message?: string;
      };
      if (res?.status) {
        toast.success("Password reset successfully");
        navigate("/login", { replace: true });
      } else {
        toast.error(res?.message || "Could not reset password");
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Failed to reset password";
      toast.error(message);
    }
  };

  if (!email || !code) {
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
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Create new password</h1>
              <p className="text-sm text-muted-foreground mb-6">Choose a strong password for your account.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="secondary" size="lg" className="w-full font-heading font-semibold" disabled={isLoading}>
                  {isLoading ? "Saving…" : "Reset password"}
                </Button>

                <div className="text-center">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm text-secondary hover:underline">
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
          Your account security matters. Use a password you do not use elsewhere.
        </p>
      </div>
    </div>
  );
};

export default RecoverPassword;
