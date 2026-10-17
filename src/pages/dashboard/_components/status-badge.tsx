import { cn } from "@/lib/utils";
import { statusStyles, type StatusKey } from "../data/dashboard";

export default function StatusBadge({ status }: { status: StatusKey }) {
  const style = statusStyles[status];

  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-3 py-1.25 text-xs leading-[normal] font-medium whitespace-nowrap",
        style.className,
      )}
    >
      {style.label}
    </span>
  );
}
