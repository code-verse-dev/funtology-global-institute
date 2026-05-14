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
        isVertical ? "flex-1 space-y-1 overflow-y-auto p-4" : "flex flex-col gap-2",
        className,
      )}
      aria-label="Non-profit admin sections"
    >
      {isVertical ? (
        <>
          <div className="mb-2 flex items-center gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-2">
            <HeartHandshake className="h-4 w-4 shrink-0 text-secondary" />
            <span className="text-xs font-semibold text-primary-foreground">Non-profit programs</span>
          </div>
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                  "px-4 py-3",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </>
      ) : (
        <>
          <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-semibold text-foreground">
            Non-profit programs
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium whitespace-nowrap transition-all",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted",
                  )
                }
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>
        </>
      )}
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
