import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { requestQuote } from "../data/request-quote";

const { success } = requestQuote;

export default function QuoteSuccess({ reference }: { reference?: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="flex flex-col items-center gap-5 rounded-[18px] border border-[#e8ecf4] bg-white px-5 py-16 text-center leading-[normal] shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)] sm:px-8">
      <span className="grid size-18 place-content-center rounded-full bg-[#ccf0de]">
        <Check aria-hidden className="size-8 text-[#00a35c]" strokeWidth={3} />
      </span>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-[#1e293b] outline-none"
      >
        {success.title}
      </h1>
      <p className="max-w-120 text-[15px] text-[#64748b]">
        {success.description}
      </p>

      {reference && (
        <p className="bg-input rounded-full px-4 py-2 text-[13px] font-medium text-[#64748b]">
          {success.reference} #{reference}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-px sm:flex-row">
        <Link
          to="/dashboard/requests"
          className="border-secondary-foreground text-secondary-foreground hover:bg-secondary rounded-xl border-[1.5px] px-6 py-3 text-base leading-6 font-bold transition-colors"
        >
          {success.viewRequests}
        </Link>
        <Link
          to="/dashboard"
          className="rounded-xl bg-[#c92032] px-6 py-3 text-base leading-6 font-bold text-white transition-colors hover:bg-[#c92032]/90"
        >
          {success.dashboard}
        </Link>
      </div>
    </section>
  );
}
