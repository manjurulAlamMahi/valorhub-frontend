import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

interface ContainerProps {
  className?: string;
}

export default function Container({
  children,
  className,
}: PropsWithChildren<ContainerProps>) {
  return (
    <div
      className={cn(
        "container mx-auto py-5 max-lg:px-4 md:py-10 lg:py-15 xl:max-w-300",
        className,
      )}
    >
      {children}
    </div>
  );
}
