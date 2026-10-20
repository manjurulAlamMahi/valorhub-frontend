import type { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { RotateCw } from "lucide-react";
import type { ReactNode } from "react";

export function ErrorState({
  error,
  onRetry,
  className,
}: {
  error: ApiError;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#ebebeb] bg-white p-10 text-center",
        className,
      )}
    >
      <p className="text-sm text-[#64748b]">{error.message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-secondary-foreground flex items-center gap-1.5 text-sm font-semibold hover:underline"
        >
          <RotateCw aria-hidden className="size-4" />
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-muted-foreground rounded-2xl border border-[#ebebeb] bg-white p-10 text-center text-sm",
        className,
      )}
    >
      {children}
    </p>
  );
}
