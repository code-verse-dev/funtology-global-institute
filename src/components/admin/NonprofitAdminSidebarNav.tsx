import { cn } from "@/lib/utils";
import { Bell, Building2, ClipboardList, HeartHandshake, MessageSquare, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const BASE = "/admin/nonprofit";

const items = [
  { to: `${BASE}/organization-requests`, label: "Organization requests", icon: Building2, end: true },
  { to: `${BASE}/users`, label: "User management", icon: Users, end: false },
  { to: `${BASE}/evaluations`, label: "Course evaluations", icon: ClipboardList, end: false },
  { to: `${BASE}/complaints`, label: "Complaints & appeals", icon: MessageSquare, end: false },
] as const;

type NonprofitAdminSidebarNavProps = {
  orientation?: "vertical" | "horizontal";
  className?: string;
};

export function NonprofitAdminSidebarNav({ orientation = "vertical", className }: NonprofitAdminSidebarNavProps) {
  const isVertical = orientation === "vertical";

  return (
    <nav
      className={cn(
        isVertical ? "flex-1 p-4 space-y-1 overflow-y-auto" : "flex gap-2 overflow-x-auto pb-2",
        className,
      )}
      aria-label="Non-profit admin sections"
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-2 mb-2",
          !isVertical && "shrink-0",
        )}
      >
        <HeartHandshake className="h-4 w-4 text-secondary shrink-0" />
        <span className="text-xs font-semibold text-primary-foreground">Non-profit programs</span>
      </div>
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
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
                  : "bg-card text-muted-foreground border border-border hover:bg-muted",
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

export function pageTitleForNonprofitAdminPath(pathname: string): string {
  if (pathname.includes("/admin/nonprofit/notifications")) return "Notifications";
  if (pathname.includes("/admin/nonprofit/organization-requests")) return "Organization requests";
  if (pathname.includes("/admin/nonprofit/users")) return "User management";
  if (pathname.includes("/admin/nonprofit/evaluations")) return "Course evaluations";
  if (pathname.includes("/admin/nonprofit/complaints")) return "Complaints & appeals";
  return "Non-profit admin";
}
