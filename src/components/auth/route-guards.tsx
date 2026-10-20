import PageLoader from "@/components/shared/page-loader";
import { useAuth } from "@/hooks/use-auth";
import { homePathFor, safeRedirect, type UserRole } from "@/services/auth";
import type { PropsWithChildren } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router";

// Sends guests to /login (and back afterwards), users of the other role to their own
// dashboard, and contractors with an unfinished signup back to /join
export function RequireAuth({
  role,
  children,
}: PropsWithChildren<{ role: UserRole }>) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <PageLoader className="min-h-svh" />;

  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );
  }

  if (user.role !== role) return <Navigate to={homePathFor(user)} replace />;

  // Contractors finish signup (plan, ID.me, profile…) before using the dashboard
  if (user.role === "business" && !user.business?.onboarding_completed) {
    return <Navigate to="/join" replace />;
  }

  return children;
}

// Login / register screens are pointless once signed in
export function GuestOnly({ children }: PropsWithChildren) {
  const { user, status } = useAuth();
  const [params] = useSearchParams();

  if (status === "loading") return <PageLoader />;

  if (user) {
    return (
      <Navigate
        to={safeRedirect(params.get("redirect")) ?? homePathFor(user)}
        replace
      />
    );
  }

  return children;
}
