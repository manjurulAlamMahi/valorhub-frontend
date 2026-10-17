import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { onboarding } from "../data/onboarding";

export default function AccountCreated({
  accountNumber,
}: {
  accountNumber: string;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="rounded-3xl border border-[#26225f]/8 bg-white p-6 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)]">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-mono text-2xl leading-8 font-bold text-[#1a1830] outline-none"
      >
        {onboarding.done.title}
      </h1>
      <p className="pt-2 text-sm leading-5 text-[#6b6e8a]">
        {onboarding.done.description}
      </p>
      <div className="flex flex-col items-center gap-3.5 pt-6">
        <span className="grid size-18 place-content-center rounded-full bg-[#ccf0de]">
          <Check
            aria-hidden
            className="size-8 text-[#00a35c]"
            strokeWidth={3}
          />
        </span>
        <p className="bg-input rounded-full px-4 py-2 font-mono text-[13px] font-medium text-[#64748b]">
          Account #{accountNumber} · Active
        </p>
        <Link
          to="/contractor/dashboard"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#c92032] font-mono text-base font-bold text-white hover:bg-[#a51a27]"
        >
          {onboarding.done.cta}
        </Link>
      </div>
    </section>
  );
}
