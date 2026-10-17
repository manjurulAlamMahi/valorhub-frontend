import { Check } from "lucide-react";

type FilterCheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function FilterCheckbox({
  label,
  checked,
  onChange,
}: FilterCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] leading-[normal] text-[#64748b]">
      <span className="relative grid size-4 shrink-0 place-content-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer border-ring absolute inset-0 cursor-pointer appearance-none rounded-sm border-[1.5px] bg-white checked:border-[#c92032] checked:bg-[#c92032] focus-visible:ring-2 focus-visible:ring-[#c92032]/30"
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none relative size-2.5 text-white opacity-0 peer-checked:opacity-100"
        />
      </span>
      {label}
    </label>
  );
}
