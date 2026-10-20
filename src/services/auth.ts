import { api } from "@/lib/api";

export type UserRole = "customer" | "business";

// AuthUserResource
export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: string;
  role: UserRole;
  email_verified_at: string | null;
  customer: { city: string | null; state: string | null } | null;
  business: {
    business_name: string | null;
    is_elite: boolean;
    plan: string | null;
    plan_slug: string | null;
    onboarding_step: number | string | null;
    onboarding_completed: boolean;
  } | null;
  created_at: string | null;
};

export type AuthSession = {
  token: string;
  token_type: "bearer";
  expires_in: number;
  user: AuthUser;
};

export type LoginPayload = { email: string; password: string };

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
};

export type ResetPasswordPayload = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthSession>("/auth/login", payload),
  register: (payload: RegisterPayload) =>
    api.post<AuthSession>("/auth/register", payload),
  me: () => api.get<AuthUser>("/auth/me"),
  logout: () => api.post<null>("/auth/logout"),
  forgotPassword: (email: string) =>
    api.post<null>("/auth/forgot-password", { email }),
  resetPassword: (payload: ResetPasswordPayload) =>
    api.post<null>("/auth/reset-password", payload),
};

export function homePathFor(user: AuthUser) {
  if (user.role !== "business") return "/dashboard";
  return user.business?.onboarding_completed
    ? "/contractor/dashboard"
    : "/join";
}

// Only same-site paths are followed after login, never an absolute or protocol-relative URL
export function safeRedirect(path: string | null) {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : null;
}
