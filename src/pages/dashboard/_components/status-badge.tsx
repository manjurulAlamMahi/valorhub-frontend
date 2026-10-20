import { cn } from "@/lib/utils";
import { statusStyles, type StatusKey } from "../data/dashboard";

export default function StatusBadge({ status }: { status: string }) {
  // Unknown statuses fall back to their raw value rather than crashing
  const style = statusStyles[status as StatusKey] ?? {
    label: status.replace(/_/g, " "),
    className: "bg-[#64748b]/10 text-[#64748b]",
  };

  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-3 py-1.25 text-xs leading-[normal] font-medium whitespace-nowrap capitalize",
        style.className,
      )}
    >
      {style.label}
    </span>
  );
}
