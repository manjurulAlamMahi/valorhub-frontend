import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Link, type LinkProps } from "react-router";

type Variant = "solid" | "outline" | "outline-accent";

const variants: Record<Variant, string> = {
  solid: "bg-[#c92032] text-white hover:bg-[#c92032]/90",
  outline:
    "border-[1.5px] border-secondary-foreground text-secondary-foreground hover:bg-secondary",
  "outline-accent":
    "border border-[#c92032] text-[#c92032] hover:bg-[#c92032] hover:text-white",
};

const base =
  "inline-flex shrink-0 items-center justify-center rounded-xl px-6 py-3 text-base leading-6 font-bold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export function ActionButton({
  variant = "solid",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
}

export function ActionLink({
  variant = "solid",
  className,
  ...props
}: LinkProps & { variant?: Variant }) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
