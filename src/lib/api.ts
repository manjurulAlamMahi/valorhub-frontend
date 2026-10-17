const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

// Response envelope returned by the Laravel ApiResponseTrait
export type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
  code: number;
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

export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "We couldn't reach the server. Please check your connection and try again.",
      0,
    );
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    // Laravel validation errors arrive as `errors` (default) or `data` (ApiResponseTrait)
    const fieldErrors: FieldErrors =
      json?.errors ?? (response.status === 422 ? json?.data : {}) ?? {};
    throw new ApiError(
      json?.message ?? "Something went wrong. Please try again.",
      response.status,
      fieldErrors,
    );
  }

  return json as ApiResponse<T>;
}
