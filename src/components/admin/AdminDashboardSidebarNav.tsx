import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  BookOpen,
  Briefcase,
  DollarSign,
  History,
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
  { segment: "sme", label: "SME Repository", icon: Briefcase },
  { segment: "payments", label: "Payments & Revenue", icon: DollarSign },
  { segment: "complaints", label: "Complaints & Appeals", icon: MessageSquare },
  { segment: "reports", label: "Reports & Analytics", icon: BarChart3 },
  { segment: "audit", label: "Audit Log", icon: History },
  { segment: "settings", label: "System Settings", icon: Settings },
];

export function adminRoutePath(segment: AdminNavSegment) {
  return `/admin/${segment}`;
}

export function pageTitleForAdminPath(pathname: string): string {
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

  return (
    <nav
      className={cn(
        isVertical ? "flex-1 p-4 space-y-1 overflow-y-auto" : "flex gap-2 overflow-x-auto pb-2",
        className
      )}
      aria-label="Admin sections"
    >
      {ADMIN_NAV_ITEMS.map(({ segment, label, icon: Icon }) => (
        <NavLink
          key={segment}
          to={adminRoutePath(segment)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              isVertical ? "w-full px-4 py-3" : "px-3 py-2 text-xs shrink-0 rounded-lg",
              isActive
                ? isVertical
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground"
                : isVertical
                  ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  : "bg-card text-muted-foreground border border-border hover:bg-muted"
            )
          }
        >
          <Icon className={cn(isVertical ? "w-5 h-5" : "w-3 h-3 shrink-0")} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
