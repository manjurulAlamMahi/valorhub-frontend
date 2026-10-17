import { cn } from "@/lib/utils";

type StepIndicatorProps = {
  current: number;
  total: number;
  label: string;
};

export default function StepIndicator({
  current,
  total,
  label,
}: StepIndicatorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4 text-xs leading-4 font-semibold">
        <p className="tracking-[0.3px] text-[#6b6e8a] uppercase">
          Step {current} of {total}
        </p>
        <p className="text-secondary-foreground">{label}</p>
      </div>
      <div
        role="progressbar"
        aria-label="Signup progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`Step ${current} of ${total}: ${label}`}
        className="flex gap-1.5"
      >
        {Array.from({ length: total }).map((_, index) => (
          <span
            key={index}
            className={cn("h-1.5 flex-1 rounded-full bg-[#e8eaf2]", {
              "bg-secondary-foreground": index < current,
            })}
          />
        ))}
      </div>
    </div>
  );
}
