import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { Link } from "react-router";

type PanelProps = {
  title: string;
  href: string;
  className?: string;
};

export default function Panel({
  title,
  href,
  className,
  children,
}: PropsWithChildren<PanelProps>) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-[#efefef] bg-white",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#f1f5f9] px-5 py-4">
        <h2 className="text-sm leading-5 font-semibold text-[#0f172a]">
          {title}
        </h2>
        <Link
          to={href}
          className="text-xs leading-4 font-medium text-[#262262] hover:underline"
        >
          View all<span className="sr-only"> {title.toLowerCase()}</span>
        </Link>
      </div>
      {children}
    </section>
  );
}
