import type {
  AuthSession,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/services/auth";
import { createContext, useContext } from "react";

export type AuthStatus = "loading" | "authenticated" | "guest";

export type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  // Store a session issued outside login/register (e.g. business onboarding sign up)
  startSession: (session: AuthSession) => void;
  // Re-read /auth/me after the profile changes
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
