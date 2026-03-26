import fgiLogo from "@/assets/fgi-logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/redux/services/apiSlices/authSlice";
import { removeUser } from "@/redux/services/Slices/userSlice";
import { Award, BarChart3, Bell, BookOpen, Building2, CreditCard, LogOut, RefreshCw, Settings, User, Users } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { orgData } from "./organization/orgDashboardData";

const orgNavItems = [
  { to: "overview", label: "Overview", icon: BarChart3 },
  { to: "learners", label: "Learners", icon: Users },
  { to: "courses", label: "Courses", icon: BookOpen },
  { to: "retake-requests", label: "Retake Requests", icon: RefreshCw },
  { to: "billing", label: "Billing", icon: CreditCard },
  { to: "certificates", label: "Certificates", icon: Award },
] as const;

const OrganizationDashboardLayout = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const onLogout = async () => {
    await logout().unwrap();
    dispatch(removeUser());
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-40 bg-primary">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src={fgiLogo} alt="FGI" className="h-10 w-10" />
              <div className="hidden sm:block">
                <p className="font-heading font-bold text-primary-foreground leading-tight">FGI</p>
                <p className="text-xs text-secondary">Organization Portal</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex gap-1">
                <Building2 className="w-3 h-3" />
                {orgData.name}
              </Badge>
              <Button variant="ghost" size="icon" className="text-primary-foreground relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-secondary">
                      <AvatarFallback>JA</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{orgData.admin}</p>
                    <p className="text-xs text-muted-foreground">{orgData.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" asChild>
                    <button type="button" onClick={onLogout} className="cursor-pointer w-full">
                      <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
                      Log out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container-wide py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Organization Dashboard</h1>
          <p className="text-muted-foreground">Manage your team&apos;s learning progress and certifications.</p>
        </motion.div>

        <nav className="flex gap-2 overflow-x-auto pb-4 mb-6" aria-label="Organization sections">
          {orgNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "overview"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </main>
    </div>
  );
};

export default OrganizationDashboardLayout;
