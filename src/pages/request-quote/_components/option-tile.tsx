import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type OptionTileProps = {
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  className?: string;
};

// Radio input styled as a selectable card
export default function OptionTile({
  name,
  value,
  checked,
  onSelect,
  className,
  children,
}: PropsWithChildren<OptionTileProps>) {
  return (
    <label
      className={cn(
        "flex cursor-pointer rounded-xl border-2 border-[#e8ecf4] bg-white text-sm leading-5 font-semibold text-[#64748b] transition-colors hover:border-[#cbd2e1] has-focus-visible:ring-3 has-focus-visible:ring-[#26225f]/20",
        {
          "border-secondary-foreground bg-secondary text-secondary-foreground hover:border-secondary-foreground":
            checked,
        },
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      {children}
    </label>
  );
}
