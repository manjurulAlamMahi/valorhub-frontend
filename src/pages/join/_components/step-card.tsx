import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, type PropsWithChildren } from "react";

type StepCardProps = {
  title: string;
  description?: string;
  onBack?: () => void;
  className?: string;
};

export default function StepCard({
  title,
  description,
  onBack,
  className,
  children,
}: PropsWithChildren<StepCardProps>) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the new step so screen readers announce it
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [title]);

  return (
    <section
      className={cn(
        "rounded-3xl border border-[#26225f]/8 bg-white p-5 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)] sm:p-8.25",
        className,
      )}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex h-5 items-center gap-1 text-sm leading-5 font-semibold text-[#6b6e8a] hover:text-[#1a1830]"
        >
          <ChevronLeft aria-hidden className="size-4" />
          Back
        </button>
      )}
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-mono text-2xl leading-8 font-bold text-[#1a1830] outline-none"
      >
        {title}
      </h1>
      {description && (
        <p className="pt-1 text-sm leading-5 text-[#6b6e8a]">{description}</p>
      )}
      <div className="pt-6">{children}</div>
    </section>
  );
}
