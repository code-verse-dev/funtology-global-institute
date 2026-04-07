import fgiLogo from "@/assets/fgi-logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import type { RootState } from "@/redux/store";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { hasParentOrganization } from "@/pages/protectedRoute/SubscriptionRequiredRoute";
import { BookOpen, Headphones, Home, LogOut, Package, Settings, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

function learnerDisplayName(user: Record<string, unknown> | null | undefined) {
  if (!user || typeof user !== "object") return "Learner";
  const first = typeof user.firstName === "string" ? user.firstName : "";
  const last = typeof user.lastName === "string" ? user.lastName : "";
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  if (typeof user.email === "string" && user.email) return user.email.split("@")[0] ?? "Learner";
  return "Learner";
}

function learnerInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "L";
}

function userProfileImageSrc(raw: unknown): string | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const s = raw.trim();
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
  return lessonFileUrl(s) ?? undefined;
}

const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const userData = useSelector((s: RootState) => s.user.userData) as Record<string, unknown> | undefined;
  const showPlatformFeesNav =
    String(userData?.role ?? "").toLowerCase().trim() === "learner" && !hasParentOrganization(userData);
  const displayName = learnerDisplayName(userData);
  const email = typeof userData?.email === "string" ? userData.email : "";
  const profileImage = userProfileImageSrc(userData?.image);

  const onLogout = async () => {
    await logout().unwrap();
    dispatch(removeUser());
    navigate("/login", { replace: true });
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm font-medium px-3 py-1.5 rounded-md transition-colors",
      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted",
    );

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-6 min-w-0">
              <Link to="/" className="flex items-center gap-3 shrink-0">
                <img src={fgiLogo} alt="FGI" className="h-10 w-10" />
                <div className="hidden sm:block">
                  <p className="font-heading font-bold text-primary leading-tight">FGI</p>
                  <p className="text-xs text-muted-foreground">Learning Portal</p>
                </div>
              </Link>
              <nav className="hidden sm:flex items-center gap-1">
                <NavLink to="/dashboard" end className={navClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    Home
                  </span>
                </NavLink>
                <NavLink to="/dashboard/courses" className={navClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    My courses
                  </span>
                </NavLink>
                {showPlatformFeesNav ? (
                  <NavLink to="/dashboard/subscription" className={navClass}>
                    <span className="inline-flex items-center gap-1.5">
                      <Package className="w-4 h-4" />
                      Platform Fees
                    </span>
                  </NavLink>
                ) : null}
                <NavLink to="/dashboard/support" className={navClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <Headphones className="w-4 h-4" />
                    Support
                  </span>
                </NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      {profileImage ? <AvatarImage src={profileImage} alt={displayName} /> : null}
                      <AvatarFallback>{learnerInitials(displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{displayName}</p>
                      {email ? <p className="text-xs text-muted-foreground">{email}</p> : null}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" asChild>
                    <button type="button" onClick={onLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
                      Log out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex sm:hidden gap-1 pb-3 -mt-1">
            <NavLink to="/dashboard" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/dashboard/courses" className={navClass}>
              Courses
            </NavLink>
            {showPlatformFeesNav ? (
              <NavLink to="/dashboard/subscription" className={navClass}>
                Platform Fees
              </NavLink>
            ) : null}
            <NavLink to="/dashboard/support" className={navClass}>
              Support
            </NavLink>
          </div>
        </div>
      </header>

      <main className="container-wide py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
