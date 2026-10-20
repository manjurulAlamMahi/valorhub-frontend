import { AuthContext, type AuthStatus } from "@/hooks/use-auth";
import { AUTH_EXPIRED_EVENT, ApiError } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/auth-token";
import {
  authApi,
  type AuthSession,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "@/services/auth";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    getToken() ? "loading" : "guest",
  );

  const startSession = useCallback((session: AuthSession) => {
    setToken(session.token);
    setUser(session.user);
    setStatus("authenticated");
  }, []);

  const endSession = useCallback(() => {
    clearToken();
    setUser(null);
    setStatus("guest");
  }, []);

  const refreshUser = useCallback(
    () =>
      authApi.me().then(
        (response) => {
          setUser(response.data);
          setStatus("authenticated");
        },
        (error: unknown) => {
          // Keep the session through network blips; only a rejected token logs the user out
          if (error instanceof ApiError && error.status === 401) {
            endSession();
          } else {
            setStatus((prev) => (prev === "loading" ? "guest" : prev));
          }
        },
      ),
    [endSession],
  );

  // Restore the session from a stored token on first load
  useEffect(() => {
    if (getToken()) void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, endSession);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, endSession);
  }, [endSession]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authApi.login(payload);
      startSession(response.data);
      return response.data.user;
    },
    [startSession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authApi.register(payload);
      startSession(response.data);
      return response.data.user;
    },
    [startSession],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // The token is dropped locally either way
    }
    endSession();
  }, [endSession]);

  const value = useMemo(
    () => ({
      user,
      status,
      login,
      register,
      logout,
      startSession,
      refreshUser,
    }),
    [user, status, login, register, logout, startSession, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
