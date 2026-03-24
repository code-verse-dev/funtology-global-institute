import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Shield, Building2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import fgiLogo from "@/assets/fgi-logo.png";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/services/Slices/userSlice";
import { useForgetPasswordMutation, useLoginMutation } from "@/redux/services/apiSlices/authSlice";

type LoginRole = "learner" | "admin" | "organization";

const roleOptions = [
  { id: "learner" as LoginRole, label: "Learner", icon: GraduationCap, desc: "Access courses & certificates", route: "/dashboard" },
  { id: "organization" as LoginRole, label: "Organization", icon: Building2, desc: "Manage team learning", route: "/organization" },
  { id: "admin" as LoginRole, label: "Administrator", icon: Shield, desc: "System administration", route: "/admin" },
];

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState<LoginRole>("learner");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await login({
        identifier: formData.email, password: formData.password,
        role: selectedRole === "learner" ? "learner" : selectedRole === "organization" ? "organization" : "admin"
      }).unwrap();
      if (res?.status) {
        toast.success("Signed in successfully");
        dispatch(addUser({ user: res?.data?.user }));
        navigate(selectedRole === "learner" ? "/dashboard" : selectedRole === "organization" ? "/organization" : "/admin")
      }
      else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (err: any) {
      console.log("error----", err);
      let message = err?.data?.message || err?.message;
      toast.error(message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
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

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mb-6">
            Sign in to continue your learning journey
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {roleOptions.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all ${selectedRole === role.id
                  ? "border-secondary bg-secondary/10"
                  : "border-border hover:border-secondary/40"
                  }`}
              >
                <role.icon className={`w-5 h-5 shrink-0 ${selectedRole === role.id ? "text-secondary" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-sm font-medium ${selectedRole === role.id ? "text-foreground" : "text-muted-foreground"}`}>{role.label}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{role.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-sm text-secondary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, rememberMe: checked as boolean })
                }
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            <Button type="submit" variant="secondary" size="lg" className="w-full font-heading font-semibold">
              Sign In as {roleOptions.find((r) => r.id === selectedRole)?.label}
            </Button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-secondary font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center p-12">
        <motion.div
          className="max-w-lg text-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8">
            <img
              src={fgiLogo}
              alt="FGI Logo"
              className="w-32 h-32 mx-auto drop-shadow-2xl"
            />
          </div>
          <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">
            Advancing Levels. Elevating Futures.
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Access your continuing education courses, track your progress, and earn
            professional certifications that advance your career.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-heading text-3xl font-bold text-secondary">50+</p>
              <p className="text-sm text-primary-foreground/70">Courses</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-secondary">10K+</p>
              <p className="text-sm text-primary-foreground/70">Learners</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-secondary">100%</p>
              <p className="text-sm text-primary-foreground/70">Online</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
