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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/redux/services/apiSlices/authSlice";
import { removeUser } from "@/redux/services/Slices/userSlice";
import type { RootState } from "@/redux/store";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { hasParentOrganization } from "@/pages/protectedRoute/SubscriptionRequiredRoute";
import { BookOpen, Headphones, Home, LogOut, Menu, Package, Settings, User } from "lucide-react";
import { useState } from "react";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  const mobileSheetNavClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container-wide">
          <div className="flex min-h-16 items-center justify-between gap-3 py-2 sm:h-16 sm:gap-4 sm:py-0">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-6">
              <Link
                to="/"
                className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial sm:gap-3"
              >
                <img
                  src={fgiLogo}
                  alt="FGI"
                  className="h-14 w-14 shrink-0 rounded-md object-contain sm:h-10 sm:w-10 sm:rounded-none"
                />
                <div className="min-w-0">
                  <p className="font-heading truncate text-sm font-bold leading-tight text-primary sm:text-base">
                    FGI
                  </p>
                  <p className="truncate text-[11px] leading-tight text-muted-foreground sm:text-xs">
                    Learning Portal
                  </p>
                </div>
              </Link>
              <nav className="hidden items-center gap-1 sm:flex">
                <NavLink to="/dashboard" end className={navClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <Home className="h-4 w-4" />
                    Home
                  </span>
                </NavLink>
                <NavLink to="/dashboard/courses" className={navClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    My Courses
                  </span>
                </NavLink>
                {showPlatformFeesNav ? (
                  <NavLink to="/dashboard/subscription" className={navClass}>
                    <span className="inline-flex items-center gap-1.5">
                      <Package className="h-4 w-4" />
                      Course Fees
                    </span>
                  </NavLink>
                ) : null}
                <NavLink to="/dashboard/support" className={navClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <Headphones className="h-4 w-4" />
                    Support
                  </span>
                </NavLink>
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="sm:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex w-[min(100vw-2rem,20rem)] flex-col gap-0 p-0 sm:max-w-sm">
                  <SheetHeader className="border-b border-border px-6 py-4 text-left">
                    <SheetTitle className="font-heading">Menu</SheetTitle>
                    <p className="text-sm font-normal text-muted-foreground">Learning Portal</p>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 p-3" aria-label="Mobile navigation">
                    <NavLink
                      to="/dashboard"
                      end
                      className={mobileSheetNavClass}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <Home className="h-5 w-5 shrink-0" />
                      Home
                    </NavLink>
                    <NavLink
                      to="/dashboard/courses"
                      className={mobileSheetNavClass}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <BookOpen className="h-5 w-5 shrink-0" />
                      My Courses
                    </NavLink>
                    {showPlatformFeesNav ? (
                      <NavLink
                        to="/dashboard/subscription"
                        className={mobileSheetNavClass}
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <Package className="h-5 w-5 shrink-0" />
                        Course Fees
                      </NavLink>
                    ) : null}
                    <NavLink
                      to="/dashboard/support"
                      className={mobileSheetNavClass}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <Headphones className="h-5 w-5 shrink-0" />
                      Support
                    </NavLink>
                  </nav>
                </SheetContent>
              </Sheet>

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
                    <button type="button" onClick={onLogout} className="cursor-pointer">
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

      <main className="container-wide py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
