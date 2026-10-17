import { cn } from "@/lib/utils";

type FilterTabsProps<T extends string> = {
  label: string;
  tabs: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
};

export default function FilterTabs<T extends string>({
  label,
  tabs,
  value,
  onChange,
}: FilterTabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.value === value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-[13px] leading-[normal] font-medium transition-colors",
              isActive
                ? "bg-secondary-foreground border-transparent text-white"
                : "border-[#e6eaf2] bg-white text-[#64748b] hover:text-[#1e293b]",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
