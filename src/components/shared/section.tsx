import { cn } from "@/lib/utils";
import { type PropsWithChildren } from "react";

interface SectionProps {
  className?: string;
}

export default function Section({
  children,
  className,
}: PropsWithChildren<SectionProps>) {
  return (
    <section className={cn("bg-cover bg-center bg-no-repeat", className)}>
      {children}
    </section>
  );
}
