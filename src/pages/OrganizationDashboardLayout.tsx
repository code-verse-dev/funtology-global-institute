import fgiLogo from "@/assets/fgi-logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Award, BarChart3, BookOpen, Building2, CreditCard, Headphones, LogOut, Package, RefreshCw, Settings, User, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RootState } from "@/redux/store";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";

const orgNavItems = [
  { to: "overview", label: "Overview", icon: BarChart3 },
  { to: "learners", label: "Learners", icon: Users },
  { to: "courses", label: "Courses", icon: BookOpen },
  { to: "retake-requests", label: "Retake Requests", icon: RefreshCw },
  { to: "subscription", label: "Course Fees", icon: Package },
  { to: "billing", label: "Billing", icon: CreditCard },
  { to: "certificates", label: "Certificates", icon: Award },
  { to: "support", label: "Support", icon: Headphones },
] as const;

function userProfileImageSrc(raw: unknown): string | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const s = raw.trim();
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
  return lessonFileUrl(s) ?? undefined;
}

const OrganizationDashboardLayout = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const onLogout = async () => {
    await logout().unwrap();
    dispatch(removeUser());
    navigate("/login", { replace: true });
  };

  const user = useSelector((state: any) => state.user.userData);
  const profileImage = userProfileImageSrc(user?.image);

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-40 bg-primary">
        <div className="container-wide">
          <div className="flex min-h-16 items-center justify-between gap-2 py-1 sm:h-16 sm:gap-3 sm:py-0">
            <Link
              to="/"
              className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial sm:gap-3"
            >
              <img
                src={fgiLogo}
                alt="FGI"
                className="h-14 w-14 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <p className="font-heading truncate text-sm font-bold leading-tight text-primary-foreground sm:text-base">
                  FGI
                </p>
                <p className="truncate text-[11px] leading-tight text-secondary sm:text-xs">
                  Organization Portal
                </p>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex gap-1">
                <Building2 className="w-3 h-3" />
                {user?.organizationName}
              </Badge>
              <NotificationBell
                triggerClassName="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                panelClassName="border-primary-foreground/20"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-secondary">
                      {profileImage ? (
                        <AvatarImage
                          src={profileImage}
                          alt={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User"}
                        />
                      ) : null}
                      <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem> */}
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
