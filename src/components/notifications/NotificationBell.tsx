import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import socket from "@/config/socket";
import {
  notificationsListPathForRole,
  useRoleBasedNotificationsQuery,
} from "@/hooks/useRoleBasedNotificationsQuery";

type NotificationDoc = {
  _id: string;
  title?: string;
  content?: string;
  createdAt?: string;
};

type NotificationBellProps = {
  /** e.g. organization header: primary foreground on primary bg */
  triggerClassName?: string;
  panelClassName?: string;
};

export function NotificationBell({ triggerClassName, panelClassName }: NotificationBellProps) {
  const role = useSelector((s: RootState) => s.user.userData?.role as string | undefined);
  const listPath = notificationsListPathForRole(role);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: notificationsData, refetch } = useRoleBasedNotificationsQuery({
    isRead: false,
    limit: 3,
  });

  const unreadCount: number = notificationsData?.data?.unreadCount ?? 0;
  const topNotifs: NotificationDoc[] =
    notificationsData?.data?.notifications?.docs?.slice(0, 3) ?? [];

  useEffect(() => {
    socket.on("notification", () => {
      refetch();
    });
    return () => {
      socket.off("notification");
    };
  }, [refetch]);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("relative", triggerClassName)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-4 min-w-4 px-0.5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold"
            aria-hidden
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-full z-50 mt-1 w-80 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-md",
            panelClassName
          )}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="text-sm font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold text-destructive">{unreadCount} unread</span>
            )}
          </div>
          <div className="my-1 h-px bg-border" />
          {topNotifs.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No new notifications.
            </div>
          ) : (
            <ul className="max-h-72 space-y-1 overflow-y-auto">
              {topNotifs.map((n) => (
                <li
                  key={n._id}
                  className="rounded-md px-2 py-2 text-left hover:bg-muted/80"
                >
                  <div className="text-sm font-semibold leading-snug">{n.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                    {n.content}
                  </div>
                  {n.createdAt && (
                    <div className="mt-0.5 text-[10px] text-muted-foreground/70">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="my-1 h-px bg-border" />
          <Link
            to={listPath}
            className="block rounded-md py-2 text-center text-xs font-semibold text-primary hover:bg-muted/60"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
