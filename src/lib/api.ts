import { clearToken, getToken, setToken } from "./auth-token";

export const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

// Fired when the session can no longer be refreshed, so the auth context can drop the user
export const AUTH_EXPIRED_EVENT = "auth:expired";

// Response envelope returned by the Laravel ApiResponseTrait
export type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
  code: number;
};

// `pagination` block used by every paginated list endpoint
export type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
};

export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FieldErrors;

  constructor(message: string, status: number, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

// First message per field, ready for form inputs
export function firstFieldErrors(error: ApiError): Record<string, string> {
  return Object.fromEntries(
    Object.entries(error.fieldErrors).map(([field, messages]) => [
      field,
      messages[0],
    ]),
  );
}

type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue | QueryValue[]>;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: Method;
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
};

// Endpoints where a 401 means bad credentials, not an expired session
const NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh"];

function buildUrl(path: string, query?: Query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (Array.isArray(value)) {
      value
        .filter((item) => item !== null && item !== undefined && item !== "")
        .forEach((item) => params.append(`${key}[]`, String(item)));
    } else if (value !== null && value !== undefined && value !== "") {
      params.append(
        key,
        typeof value === "boolean" ? (value ? "1" : "0") : String(value),
      );
    }
  }
  const search = params.toString();
  return `${API_URL}/api${path}${search ? `?${search}` : ""}`;
}

async function send(
  path: string,
  { method = "GET", body, query, signal }: RequestOptions,
  token: string | null,
) {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  let verb = method;
  if (body instanceof FormData) {
    // PHP only parses multipart bodies on POST, so Laravel needs method spoofing for file updates
    if (method !== "POST" && method !== "GET") {
      body.set("_method", method);
      verb = "POST";
    }
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  try {
    return await fetch(buildUrl(path, query), {
      method: verb,
      headers,
      body: payload,
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError(
      "We couldn't reach the server. Please check your connection and try again.",
      0,
    );
  }
}

// Concurrent 401s share one refresh call; the old token is blacklisted as soon as it is refreshed
let refreshing: Promise<string | null> | null = null;

function refreshToken(): Promise<string | null> {
  refreshing ??= (async () => {
    const token = getToken();
    if (!token) return null;
    try {
      const response = await send("/auth/refresh", { method: "POST" }, token);
      const json = await response.json().catch(() => null);
      const next: string | undefined = json?.data?.token;
      if (!response.ok || !next) return null;
      setToken(next);
      return next;
    } catch {
      return null;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

// Sends with the stored token, refreshing it once on a 401
async function sendAuthorized(path: string, options: RequestOptions) {
  const token = getToken();
  let response = await send(path, options, token);

  if (response.status === 401 && token && !NO_REFRESH_PATHS.includes(path)) {
    // Another request may already have swapped the token while this one was in flight
    const current = getToken();
    const next = current && current !== token ? current : await refreshToken();
    if (next) {
      response = await send(path, options, next);
    } else {
      clearToken();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
  }
  return response;
}

async function toApiError(response: Response) {
  const json = await response.json().catch(() => null);
  // Laravel validation errors arrive as `errors` (default) or `data` (ApiResponseTrait)
  const fieldErrors: FieldErrors =
    json?.errors ?? (response.status === 422 ? json?.data : {}) ?? {};
  return new ApiError(
    json?.message ?? "Something went wrong. Please try again.",
    response.status,
    fieldErrors,
  );
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const response = await sendAuthorized(path, options);
  if (!response.ok) throw await toApiError(response);
  return (await response.json().catch(() => null)) as ApiResponse<T>;
}

// Downloads a file endpoint (e.g. an invoice PDF) and saves it under `filename`
export async function apiDownload(path: string, filename: string) {
  const response = await sendAuthorized(path, {});
  if (!response.ok) throw await toApiError(response);
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const api = {
  get: <T>(path: string, query?: Query, signal?: AbortSignal) =>
    apiRequest<T>(path, { query, signal }),
  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "DELETE", body }),
};

export function apiPost<T>(path: string, body: unknown) {
  return api.post<T>(path, body);
}
