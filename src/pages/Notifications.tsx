import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, CheckCheck, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  useToggleNotificationMutation,
  useMarkAllReadMutation,
} from "@/redux/services/apiSlices/notificationSlice";
import socket from "@/config/socket";
import { useRoleBasedNotificationsQuery } from "@/hooks/useRoleBasedNotificationsQuery";

type FilterType = "all" | "unread" | "read";

type NotificationsChromeProps = {
  backLink?: { to: string; label: string };
  children: React.ReactNode;
};

function NotificationsChrome({ backLink, children }: NotificationsChromeProps) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {backLink && (
        <Button variant="ghost" size="sm" className="px-0 text-muted-foreground" asChild>
          <Link to={backLink.to}>{backLink.label}</Link>
        </Button>
      )}
      {children}
    </div>
  );
}

export function NotificationsPageContent() {
  const [filter, setFilter] = useState<FilterType>("all");

  const queryArg =
    filter === "unread" ? { isRead: false } : filter === "read" ? { isRead: true } : {};

  const { data: notificationsData, isLoading, refetch } =
    useRoleBasedNotificationsQuery(queryArg);
  const [toggleNotification] = useToggleNotificationMutation();
  const [markAllRead] = useMarkAllReadMutation();

  useEffect(() => {
    document.title = "Notifications • FGI";
  }, []);

  const notifDocs: any[] = notificationsData?.data?.notifications?.docs ?? [];
  const unreadCount: number = notificationsData?.data?.unreadCount ?? 0;

  const filterLabel =
    filter === "unread" ? "Unread" : filter === "read" ? "Read" : "All Notifications";

  useEffect(() => {
    socket.on("notification", () => {
      refetch();
    });
    return () => {
      socket.off("notification");
    };
  }, [refetch]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl font-extrabold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="rounded-full border-none bg-primary px-2.5 py-0.5 text-xs font-bold hover:bg-primary/90">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium text-foreground outline-none">
                {filterLabel}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setFilter("all")}>All Notifications</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("unread")}>Unread</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("read")}>Read</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            variant="outline"
            className="gap-2 rounded-lg border-primary/30 font-semibold text-primary hover:bg-primary/5"
            onClick={() => markAllRead()}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <p className="mb-6 text-sm font-bold text-foreground">All notifications</p>

        {isLoading ? (
          <div className="py-12 text-center">
            <p className="font-medium text-muted-foreground">Loading notifications…</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifDocs.map((n) => (
              <div
                key={n._id}
                className={cn(
                  "relative flex items-center gap-4 rounded-2xl border p-4 transition-all",
                  n.isRead
                    ? "border-border bg-transparent"
                    : "border-primary/20 bg-primary/5"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                    n.isRead
                      ? "border-border bg-background text-muted-foreground"
                      : "border-primary/30 bg-background text-primary"
                  )}
                >
                  <Bell className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{n.title}</h3>
                    {!n.isRead && (
                      <Badge className="h-4 border-none bg-primary px-2 py-0 text-[10px] font-bold uppercase hover:bg-primary/90">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{n.content}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                  </p>
                </div>

                <div className="shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    title={n.isRead ? "Mark as unread" : "Mark as read"}
                    className={cn(
                      "h-8 w-8 rounded-full",
                      n.isRead
                        ? "border-border text-muted-foreground"
                        : "border-primary/30 text-primary"
                    )}
                    onClick={() => toggleNotification({ id: n._id })}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {notifDocs.length === 0 && (
              <div className="py-12 text-center">
                <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="font-medium text-muted-foreground">No notifications found.</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  );
}

/** Learner dashboard — inside existing layout */
export default function LearnerNotifications() {
  return (
    <NotificationsChrome backLink={{ to: "/dashboard", label: "← Back to dashboard" }}>
      <NotificationsPageContent />
    </NotificationsChrome>
  );
}

export function AdminNotifications() {
  return (
    <NotificationsChrome backLink={{ to: "/admin/overview", label: "← Back to admin" }}>
      <NotificationsPageContent />
    </NotificationsChrome>
  );
}

export function OrganizationNotifications() {
  return (
    <NotificationsChrome backLink={{ to: "/organization/overview", label: "← Back to organization" }}>
      <NotificationsPageContent />
    </NotificationsChrome>
  );
}
