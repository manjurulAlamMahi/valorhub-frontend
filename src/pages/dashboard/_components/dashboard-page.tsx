import { cn } from "@/lib/utils";
import type { PropsWithChildren, ReactNode } from "react";

type DashboardPageProps = {
  title: string;
  description: string;
  action?: ReactNode;
  card?: boolean;
  className?: string;
};

export default function DashboardPage({
  title,
  description,
  action,
  card = false,
  className,
  children,
}: PropsWithChildren<DashboardPageProps>) {
  return (
    <section
      className={cn(
        "space-y-5",
        { "rounded-2xl bg-white p-4": card },
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 leading-[normal]">
        <div className="space-y-2.5">
          <h1 className="text-[26px] font-bold text-[#1e293b]">{title}</h1>
          <p className="text-sm text-[#64748b]">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
