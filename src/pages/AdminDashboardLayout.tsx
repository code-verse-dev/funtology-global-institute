import fgiLogo from "@/assets/fgi-logo.png";
import { AdminDashboardSidebarNav, pageTitleForAdminPath } from "@/components/admin/AdminDashboardSidebarNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Bell, LogOut, Settings, Shield, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminData } from "./admin/data";

const AdminDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const onLogout = async () => {
    await logout().unwrap();
    dispatch(removeUser());
    navigate("/login", { replace: true });
  };

  const pageTitle = pageTitleForAdminPath(location.pathname);

  return (
    <div className="min-h-screen bg-muted flex">
      <aside className="hidden lg:flex w-64 bg-primary flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-primary-foreground/10">
          <Link to="/" className="flex items-center gap-3">
            <img src={fgiLogo} alt="FGI" className="h-10 w-10" />
            <div>
              <p className="font-heading font-bold text-primary-foreground leading-tight">FGI Admin</p>
              <p className="text-xs text-secondary">Control Panel</p>
            </div>
          </Link>
        </div>
        <AdminDashboardSidebarNav orientation="vertical" />
        <div className="p-4 border-t border-primary-foreground/10">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Shield className="w-4 h-4 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-foreground">{adminData.name}</p>
              <p className="text-xs text-primary-foreground/60">{adminData.role}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <Link to="/">
                  <img src={fgiLogo} alt="FGI" className="h-8 w-8" />
                </Link>
              </div>
              <h1 className="font-heading text-xl font-bold text-foreground">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  7
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>{adminData.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
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

        <div className="p-6 space-y-6">
          <div className="lg:hidden">
            <AdminDashboardSidebarNav orientation="horizontal" />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
