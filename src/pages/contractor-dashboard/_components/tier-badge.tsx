import { cn } from "@/lib/utils";
import { Award } from "lucide-react";

export default function TierBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5.5 shrink-0 items-center gap-1 rounded-full border border-[#fee685] bg-[#fef3c6] px-2.25 text-xs font-semibold text-[#bb4d00]",
        className,
      )}
    >
      <Award aria-hidden className="size-2.5" strokeWidth={2.5} />
      {label}
    </span>
  );
}
