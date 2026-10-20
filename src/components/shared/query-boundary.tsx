import PageLoader from "@/components/shared/page-loader";
import { ErrorState } from "@/components/shared/query-state";
import type { ApiQuery } from "@/hooks/use-api";
import type { ReactNode } from "react";

// Loader until the first response, error with retry on failure, then the content
export default function QueryBoundary<T>({
  query,
  children,
}: {
  query: ApiQuery<T>;
  children: (data: T) => ReactNode;
}) {
  if (!query.data && query.error) {
    return <ErrorState error={query.error} onRetry={query.refetch} />;
  }
  if (!query.data) return <PageLoader className="min-h-60" />;
  return children(query.data);
}
