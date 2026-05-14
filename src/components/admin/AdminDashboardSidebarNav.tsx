import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  BookOpen,
  ClipboardList,
  DollarSign,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export type AdminNavSegment =
  | "overview"
  | "users"
  | "courses"
  | "sme"
  | "payments"
  | "evaluations"
  | "complaints"
  | "reports"
  | "audit"
  | "settings";

export type AdminNavItem = {
  segment: AdminNavSegment;
  label: string;
  icon: LucideIcon;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { segment: "overview", label: "Overview", icon: Activity },
  { segment: "users", label: "User Management", icon: Users },
  { segment: "courses", label: "Course Management", icon: BookOpen },
  // { segment: "sme", label: "SME Repository", icon: Briefcase },
  { segment: "payments", label: "Payments & Revenue", icon: DollarSign },
  { segment: "reports", label: "Reports", icon: BarChart3 },
  { segment: "evaluations", label: "Course evaluations", icon: ClipboardList },
  { segment: "complaints", label: "Complaints & Appeals", icon: MessageSquare },
  // { segment: "audit", label: "Audit Log", icon: History },
  { segment: "settings", label: "System Settings", icon: Settings },
];

export function adminRoutePath(segment: AdminNavSegment) {
  return `/admin/${segment}`;
}

export function pageTitleForAdminPath(pathname: string): string {
  if (pathname.includes("/admin/notifications")) return "Notifications";
  if (pathname.includes("/admin/evaluations")) return "Course evaluations";
  const m = pathname.match(/\/admin(?:\/([^/]+))?$/);
  const seg = (m?.[1] as AdminNavSegment | undefined) ?? "overview";
  return ADMIN_NAV_ITEMS.find((i) => i.segment === seg)?.label ?? "Overview";
}

type AdminDashboardSidebarNavProps = {
  orientation?: "vertical" | "horizontal";
  className?: string;
};

export function AdminDashboardSidebarNav({
  orientation = "vertical",
  className,
}: AdminDashboardSidebarNavProps) {
  const isVertical = orientation === "vertical";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium whitespace-nowrap transition-all sm:gap-3 sm:px-3 sm:py-2 sm:text-sm",
      isActive
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:bg-muted",
    );

  const verticalLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium whitespace-nowrap transition-all",
      isActive
        ? "bg-secondary text-secondary-foreground"
        : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground",
    );

  return (
    <nav
      className={cn(isVertical ? "flex-1 space-y-1 overflow-y-auto p-4" : "w-full", className)}
      aria-label="Admin sections"
    >
      {isVertical ? (
        ADMIN_NAV_ITEMS.map(({ segment, label, icon: Icon }) => (
          <NavLink key={segment} to={adminRoutePath(segment)} className={verticalLinkClass}>
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ADMIN_NAV_ITEMS.map(({ segment, label, icon: Icon }) => (
            <NavLink key={segment} to={adminRoutePath(segment)} className={linkClass}>
              <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
