import { cn } from "@/lib/utils";
import type { PropsWithChildren, ReactNode } from "react";

type ProfileSectionProps = {
  title: ReactNode;
  action?: ReactNode;
  bordered?: boolean;
  className?: string;
};

export default function ProfileSection({
  title,
  action,
  bordered = false,
  className,
  children,
}: PropsWithChildren<ProfileSectionProps>) {
  return (
    <section
      className={cn(
        "space-y-4 rounded-2xl bg-white p-6",
        { "border border-[rgba(38,34,95,0.1)]": bordered },
        className,
      )}
    >
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-mono text-lg leading-[normal] font-bold text-[#0a0a0a]">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
