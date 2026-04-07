import { useGetMySubscriptionQuery } from "@/redux/services/apiSlices/paymentSlice";
import type { RootState } from "@/redux/store";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Interprets GET /subscription/my envelope: { status, data }.
 * Active if data is a non-null object that is not explicitly inactive/expired.
 */
export function hasActiveSubscription(apiResponse: unknown): boolean {
  if (apiResponse == null || typeof apiResponse !== "object") return false;
  const r = apiResponse as { status?: boolean; data?: unknown };
  if (r.status === false) return false;
  const d = r.data;
  if (d == null || d === false) return false;
  if (typeof d !== "object" || Array.isArray(d)) return Boolean(d);
  const o = d as Record<string, unknown>;
  if (o.active === false || o.isActive === false) return false;
  const st = typeof o.status === "string" ? o.status.toLowerCase() : "";
  if (st && ["expired", "cancelled", "canceled", "inactive", "unpaid"].includes(st)) return false;
  if (o.expiresAt) {
    const t = new Date(String(o.expiresAt)).getTime();
    if (!Number.isNaN(t) && t < Date.now()) return false;
  }
  if (o.active === true || o.isActive === true) return true;
  if (st && ["active", "paid", "trialing", "current"].includes(st)) return true;
  if (o._id != null || o.id != null) return true;
  return false;
}

function normalizeRole(role: unknown): string {
  return typeof role === "string" ? role.toLowerCase().trim() : "";
}

export function hasParentOrganization(user: Record<string, unknown> | null | undefined): boolean {
  const p = user?.parentOrganization;
  if (p == null) return false;
  if (typeof p === "string") return p.length > 0;
  if (typeof p === "object") return Object.keys(p as object).length > 0;
  return Boolean(p);
}

function roleFromAccessToken(): string {
  const token = Cookies.get("accessToken");
  if (!token) return "";
  try {
    const decoded = jwtDecode<{ role?: string }>(token);
    return normalizeRole(decoded.role);
  } catch {
    return "";
  }
}

const SubscriptionRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((s: RootState) => s.user.userData) as Record<string, unknown> | undefined;
  const navigate = useNavigate();
  const location = useLocation();

  const role = normalizeRole(user?.role) || roleFromAccessToken();
  const isLearner = role === "learner";
  const isOrganization = role === "organization";

  const skipForOrgLearner = isLearner && hasParentOrganization(user);

  const shouldEnforce = (isLearner && !skipForOrgLearner) || isOrganization;

  const { data, isLoading, isError, refetch } = useGetMySubscriptionQuery(undefined, {
    skip: !shouldEnforce,
  });

  const subscribed = useMemo(() => hasActiveSubscription(data), [data]);

  useEffect(() => {
    if (!shouldEnforce || isLoading) return;
    if (subscribed) return;
    navigate("/payment", {
      replace: true,
      state: {
        type: "SUBSCRIPTION",
        from: location.pathname,
      },
    });
  }, [shouldEnforce, isLoading , subscribed, navigate, location.pathname]);

  if (!shouldEnforce) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">Checking subscription…</span>
      </div>
    );
  }

  // if (isError) {
  //   return (
  //     <div className="container-wide py-16 flex flex-col items-center gap-4 text-center">
  //       <p className="text-sm text-destructive max-w-md">We could not verify your subscription. Check your connection and try again.</p>
  //       <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
  //         Retry
  //       </Button>
  //     </div>
  //   );
  // }

  if (!subscribed) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">Redirecting to payment…</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionRequiredRoute;
