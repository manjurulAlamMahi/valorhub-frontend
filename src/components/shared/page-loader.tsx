import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export default function PageLoader({ className }: { className?: string }) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-[60svh] items-center justify-center text-[#64748b]",
        className,
      )}
    >
      <LoaderCircle aria-hidden className="size-6 animate-spin" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
