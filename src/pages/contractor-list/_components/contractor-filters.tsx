import { ChevronDown } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import {
  contractorList,
  initialFilters,
  type ContractorFiltersState,
} from "../data/contractor-list";

const { filters: copy } = contractorList;

type ContractorFiltersProps = {
  slug: string;
  filters: ContractorFiltersState;
  onChange: (filters: ContractorFiltersState) => void;
};

function FilterGroup({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-base leading-5 font-medium text-[#0a0a0a]">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[13px] leading-5 text-[#0a0a0a]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-secondary-foreground size-4 cursor-pointer rounded-[2.5px]"
      />
      {label}
    </label>
  );
}

export default function ContractorFilters({
  slug,
  filters,
  onChange,
}: ContractorFiltersProps) {
  const navigate = useNavigate();

  const toggleCredential = (value: string, checked: boolean) =>
    onChange({
      ...filters,
      credentials: checked
        ? [...filters.credentials, value]
        : filters.credentials.filter((credential) => credential !== value),
    });

  return (
    <aside className="h-fit space-y-6 rounded-2xl border border-[#ebebeb] bg-white p-6 lg:w-72 lg:shrink-0">
      <div className="flex items-end justify-between gap-6">
        <h2 className="text-[17.4px] leading-6.75 font-bold text-[#0a0a0a]">
          {copy.title}
        </h2>
        <button
          type="button"
          onClick={() => onChange(initialFilters)}
          className="text-primary text-xs font-medium hover:underline"
        >
          {copy.clear}
        </button>
      </div>

      <div className="space-y-3">
        <label
          htmlFor="filter-zip"
          className="block text-base leading-5 font-medium text-[#0a0a0a]"
        >
          {copy.zip.label}
        </label>
        <input
          id="filter-zip"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={10}
          value={filters.zip}
          onChange={(event) =>
            onChange({ ...filters, zip: event.target.value })
          }
          placeholder={copy.zip.placeholder}
          className="h-10.25 w-full rounded-xl border border-black/8 bg-[#f8fafc] px-4.25 text-xs text-[#0a0a0a] outline-none placeholder:text-[#0a0a0a]/50 focus:border-black/20"
        />
      </div>

      <FilterGroup label={copy.category.label}>
        <div className="space-y-2.5">
          {copy.category.options.map((option) => (
            <FilterCheckbox
              key={option.slug}
              label={option.label}
              checked={option.slug === slug}
              onChange={(checked) =>
                checked && navigate(`/category/${option.slug}`)
              }
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label={copy.credentials.label}>
        <div className="space-y-2.5">
          {copy.credentials.options.map((option) => (
            <FilterCheckbox
              key={option.value}
              label={option.label}
              checked={filters.credentials.includes(option.value)}
              onChange={(checked) => toggleCredential(option.value, checked)}
            />
          ))}
        </div>
      </FilterGroup>

      <div className="space-y-3">
        <label
          htmlFor="filter-rating"
          className="block text-base leading-5 font-medium text-[#0a0a0a]"
        >
          {copy.rating.label}
        </label>
        <div className="relative">
          <select
            id="filter-rating"
            value={filters.minRating}
            onChange={(event) =>
              onChange({ ...filters, minRating: Number(event.target.value) })
            }
            className="h-9 w-full cursor-pointer appearance-none rounded-xl border border-black/8 bg-[#f8fafc] px-4.25 text-xs text-[#0a0a0a] outline-none focus:border-black/20"
          >
            {copy.rating.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4.25 size-4 -translate-y-1/2 text-[#0a0a0a]"
          />
        </div>
      </div>
    </aside>
  );
}
