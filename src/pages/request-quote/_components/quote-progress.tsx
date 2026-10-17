import { cn } from "@/lib/utils";
import { requestQuote } from "../data/request-quote";

const { steps } = requestQuote;

export default function QuoteProgress({ step }: { step: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-mono text-2xl leading-8 font-bold text-[#111827]">
          {requestQuote.title}
        </h1>
        <p className="text-sm leading-5 text-[#64748b]">
          Step {step + 1} of {steps.length}
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Request progress"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={step + 1}
        className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8ecf4]"
      >
        <div
          className="bg-secondary-foreground h-full rounded-full transition-[width] duration-300"
          style={{ width: `${steps[step].progress}%` }}
        />
      </div>

      <ol className="flex justify-between gap-2 pt-2 max-sm:hidden">
        {steps.map((item, index) => (
          <li
            key={item.key}
            aria-current={index === step ? "step" : undefined}
            className={cn("text-xs leading-4 font-semibold text-[#94a3b8]", {
              "text-[#00bc7d]": index < step,
              "text-secondary-foreground": index === step,
            })}
          >
            {index < step && "✓ "}
            {item.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
