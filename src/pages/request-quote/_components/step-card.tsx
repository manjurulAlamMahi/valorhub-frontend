import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PropsWithChildren } from "react";
import { requestQuote } from "../data/request-quote";

const { actions } = requestQuote;

type StepCardProps = {
  title: string;
  description: string;
  isFirst?: boolean;
  isLast?: boolean;
  submitting?: boolean;
  error?: string;
  onPrevious: () => void;
  onNext: () => void;
};

export default function StepCard({
  title,
  description,
  isFirst = false,
  isLast = false,
  submitting = false,
  error,
  onPrevious,
  onNext,
  children,
}: PropsWithChildren<StepCardProps>) {
  return (
    <section className="rounded-[18px] border border-[#e8ecf4] bg-white p-5 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)] sm:p-8">
      <div className="space-y-1">
        <h2 className="text-xl leading-7 font-bold text-[#111827]">{title}</h2>
        <p className="text-sm leading-5 text-[#64748b]">{description}</p>
      </div>

      <div className="pt-5">{children}</div>

      {error && (
        <p role="alert" className="pt-4 text-sm text-[#c92032]">
          {error}
        </p>
      )}

      <div className="flex justify-between gap-3 pt-8">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst || submitting}
          className="flex items-center justify-center gap-2.5 rounded-xl border border-[#e8ecf4] px-6 py-3 text-sm leading-5 font-semibold text-[#64748b] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:text-[#a1a1a1] disabled:hover:bg-transparent sm:w-45.75"
        >
          <ArrowLeft aria-hidden className="size-4" />
          {actions.previous}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={submitting}
          className="flex items-center justify-center gap-2.5 rounded-xl bg-[#c92032] px-6 py-3 text-sm leading-5 font-semibold text-white transition-colors hover:bg-[#c92032]/90 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-40.75"
        >
          {isLast
            ? submitting
              ? actions.submitting
              : actions.submit
            : actions.next}
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
    </section>
  );
}
