import fgiLogo from "@/assets/fgi-logo.png";
import {
  NonprofitAdminSidebarNav,
  pageTitleForNonprofitAdminPath,
} from "@/components/admin/NonprofitAdminSidebarNav";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NonprofitAdminProvider } from "@/contexts/NonprofitAdminContext";
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
import { useLogoutMutation } from "@/redux/services/apiSlices/authSlice";
import { removeUser } from "@/redux/services/Slices/userSlice";
import type { RootState } from "@/redux/store";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";
import { HeartHandshake, LogOut, Settings, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminData } from "./admin/data";

function adminDisplayName(user: Record<string, unknown> | undefined) {
  if (!user) return adminData.name;
  const first = typeof user.firstName === "string" ? user.firstName.trim() : "";
  const last = typeof user.lastName === "string" ? user.lastName.trim() : "";
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  if (typeof user.email === "string" && user.email) return user.email.split("@")[0] ?? adminData.name;
  return adminData.name;
}

function adminInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "AD";
}

function userProfileImageSrc(raw: unknown): string | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const s = raw.trim();
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
  return lessonFileUrl(s) ?? undefined;
}

function AdminNonprofitDashboardLayoutInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const userData = useSelector((s: RootState) => s.user.userData) as Record<string, unknown> | undefined;
  const headerName = adminDisplayName(userData);
  const headerEmail = typeof userData?.email === "string" ? userData.email : "";
  const profileImage = userProfileImageSrc(userData?.image);
  const pageTitle = pageTitleForNonprofitAdminPath(location.pathname);

  const onLogout = async () => {
    await logout().unwrap();
    dispatch(removeUser());
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-primary-foreground/10 bg-primary lg:flex">
        <div className="p-6 border-b border-primary-foreground/10">
          <Link to="/admin/overview" className="flex items-center gap-3">
            <img src={fgiLogo} alt="FGI" className="h-10 w-10" />
            <div>
              <p className="font-heading font-bold text-primary-foreground leading-tight">FGI Admin</p>
              <p className="text-xs text-secondary">Non-profit</p>
            </div>
          </Link>
        </div>
        <NonprofitAdminSidebarNav orientation="vertical" />
        <div className="p-4 border-t border-primary-foreground/10 mt-auto">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <HeartHandshake className="w-4 h-4 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-foreground">Non-profit API</p>
              <p className="text-xs text-primary-foreground/60">Separate backend</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex min-h-dvh min-w-0 flex-1 flex-col bg-background lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <div className="shrink-0 lg:hidden">
                <Link to="/admin/overview">
                  <img src={fgiLogo} alt="FGI" className="h-8 w-8" />
                </Link>
              </div>
              <h1 className="font-heading min-w-0 flex-1 truncate text-lg font-bold text-foreground sm:text-xl">{pageTitle}</h1>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="shrink-0 text-xs sm:text-sm" asChild>
                <Link to="/admin/overview" aria-label="Return to main admin dashboard">
                  <span className="sm:hidden">Main</span>
                  <span className="hidden sm:inline">Main admin</span>
                </Link>
              </Button>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      {profileImage ? <AvatarImage src={profileImage} alt={headerName} /> : null}
                      <AvatarFallback>{adminInitials(headerName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{headerName}</p>
                      {headerEmail ? <p className="text-xs text-muted-foreground">{headerEmail}</p> : null}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link to="/admin/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" asChild>
                    <button type="button" className="cursor-pointer w-full" onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
                      Log out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col space-y-6 p-4 sm:p-6">
          <div className="lg:hidden -mx-4 border-b border-border px-4 pb-3 sm:-mx-6 sm:px-6">
            <NonprofitAdminSidebarNav orientation="horizontal" className="-mx-1 px-1" />
          </div>
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

/** Wraps non-profit admin routes; enables `useNonprofitAdminMode()` for API switching. */
export default function AdminNonprofitDashboardLayout() {
  return (
    <NonprofitAdminProvider>
      <AdminNonprofitDashboardLayoutInner />
    </NonprofitAdminProvider>
  );
}
