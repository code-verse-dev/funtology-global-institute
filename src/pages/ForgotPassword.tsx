import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, GraduationCap, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import fgiLogo from "@/assets/fgi-logo.png";
import { toast } from "sonner";
import { useForgetPasswordMutation } from "@/redux/services/apiSlices/authSlice";
import type { LoginRole } from "@/types/loginRole";

const roleOptions = [
  { id: "learner" as LoginRole, label: "Learner", icon: GraduationCap, desc: "Student account" },
  { id: "organization" as LoginRole, label: "Organization", icon: Building2, desc: "Org account" },
  { id: "admin" as LoginRole, label: "Administrator", icon: Shield, desc: "Admin account" },
];

type LocationState = { role?: LoginRole };

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const [selectedRole, setSelectedRole] = useState<LoginRole>("learner");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fromLogin = (location.state as LocationState | null)?.role;
    if (fromLogin && roleOptions.some((r) => r.id === fromLogin)) {
      setSelectedRole(fromLogin);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = (await forgetPassword({
        data: { email, type: selectedRole },
      }).unwrap()) as { status?: boolean; message?: string };
      if (res?.status) {
        toast.success("Recovery email sent");
        navigate("/verify-otp", { state: { email, role: selectedRole } });
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Failed to send recovery email";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="inline-block mb-8">
            <img src={fgiLogo} alt="FGI Logo" className="h-16 w-16" />
          </Link>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Forgot password</h1>
          <p className="text-muted-foreground mb-6">Choose your account type and enter your email. We will send a verification code.</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {roleOptions.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                disabled={isLoading}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all ${
                  selectedRole === role.id
                    ? "border-secondary bg-secondary/10"
                    : "border-border hover:border-secondary/40"
                }`}
              >
                <role.icon
                  className={`w-5 h-5 shrink-0 ${selectedRole === role.id ? "text-secondary" : "text-muted-foreground"}`}
                />
                <div>
                  <p
                    className={`text-sm font-medium ${selectedRole === role.id ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {role.label}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{role.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" variant="secondary" size="lg" className="w-full font-heading font-semibold" disabled={isLoading}>
              {isLoading ? "Sending…" : "Send verification code"}
            </Button>

            <div className="text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-secondary font-medium hover:underline">
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>
          </form>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center p-12">
        <motion.div
          className="max-w-lg text-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src={fgiLogo} alt="FGI Logo" className="w-32 h-32 mx-auto drop-shadow-2xl mb-8" />
          <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">Reset your password</h2>
          <p className="text-primary-foreground/80 text-lg">
            Use the same account type you use to sign in so we can send the code to the right profile.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
