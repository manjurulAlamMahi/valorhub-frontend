import { api, ApiError, type Query } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

type State<T> = { key: string | null; data?: T; error?: ApiError };

export type ApiQuery<T> = {
  // Last successful payload; kept while a new key loads so lists don't flash empty
  data: T | undefined;
  error: ApiError | undefined;
  // True until the response for the current path/query arrives
  isLoading: boolean;
  refetch: () => void;
};

// GET `path` with `query`, refetching whenever either changes. Pass `null` to skip.
export function useApi<T>(path: string | null, query?: Query): ApiQuery<T> {
  const queryKey = JSON.stringify(query ?? {});
  const [nonce, setNonce] = useState(0);
  const [state, setState] = useState<State<T>>({ key: null });
  const key = path ? `${path}?${queryKey}#${nonce}` : null;

  useEffect(() => {
    if (!path || !key) return;
    const controller = new AbortController();

    api.get<T>(path, JSON.parse(queryKey) as Query, controller.signal).then(
      (response) => setState({ key, data: response.data }),
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setState((prev) => ({
          key,
          data: prev.data,
          error:
            error instanceof ApiError
              ? error
              : new ApiError("Something went wrong. Please try again.", 0),
        }));
      },
    );

    return () => controller.abort();
  }, [path, queryKey, key]);

  const refetch = useCallback(() => setNonce((value) => value + 1), []);
  const settled = state.key === key;

  return {
    data: state.data,
    error: settled ? state.error : undefined,
    isLoading: Boolean(key) && !settled,
    refetch,
  };
}
