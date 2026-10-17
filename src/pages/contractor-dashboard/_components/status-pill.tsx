import { cn } from "@/lib/utils";
import type { Status } from "../data/contractor-dashboard";

const tones: Record<Status, string> = {
  green: "border-[#bbf7d0] bg-[#dcfce7] text-[#16a34a]",
  blue: "border-[#bfdbfe] bg-[#dbeafe] text-[#3b82f6]",
  orange: "border-[#fef3c7] bg-[#fffbeb] text-[#f59e0b]",
  red: "border-[#ffb5b5] bg-[#ffe9e9] text-[#dc2626]",
};

export default function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: Status;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-full border px-1.5 text-xs leading-4 font-medium tracking-[0.24px]",
        tones[tone],
      )}
    >
      {label}
    </span>
  );
}
