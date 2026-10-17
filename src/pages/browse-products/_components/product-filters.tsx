import { marketplace } from "@/pages/marketplace/data/marketplace";
import type { PropsWithChildren } from "react";
import {
  browseProducts,
  initialFilters,
  priceBounds,
  type ProductFiltersState,
} from "../data/browse-products";
import FilterCheckbox from "./filter-checkbox";
import PriceRange from "./price-range";

const { filters: copy } = browseProducts;

type ProductFiltersProps = {
  filters: ProductFiltersState;
  onChange: (filters: ProductFiltersState) => void;
};

function FilterGroup({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <fieldset className="space-y-2.5 border-b border-[#e6eaf2] pb-5.5">
      <legend className="mb-3 text-[13px] leading-[normal] font-bold text-[#1e293b]">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

const toggle = (list: string[], value: string, checked: boolean) =>
  checked ? [...list, value] : list.filter((item) => item !== value);

export default function ProductFilters({
  filters,
  onChange,
}: ProductFiltersProps) {
  return (
    <aside className="h-fit space-y-5.5 rounded-[14px] border border-[#e6eaf2] bg-white p-5.5 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] lg:mt-9.25 lg:w-65 lg:shrink-0">
      <div className="flex items-center justify-between border-b border-[#e6eaf2] pb-5.5">
        <h2 className="text-base leading-[normal] font-bold text-[#1e293b]">
          {copy.title}
        </h2>
        <button
          type="button"
          onClick={() => onChange(initialFilters)}
          className="text-xs leading-[normal] font-medium text-[#c92032] hover:underline"
        >
          {copy.reset}
        </button>
      </div>

      <FilterGroup label={copy.price}>
        <PriceRange
          bounds={priceBounds}
          value={filters.price}
          onChange={(price) => onChange({ ...filters, price })}
        />
      </FilterGroup>

      <FilterGroup label={copy.category}>
        {marketplace.categories.items.map((category) => (
          <FilterCheckbox
            key={category.slug}
            label={category.label}
            checked={filters.categories.includes(category.slug)}
            onChange={(checked) =>
              onChange({
                ...filters,
                categories: toggle(filters.categories, category.slug, checked),
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup label={copy.credentials.label}>
        {copy.credentials.options.map((option) => (
          <FilterCheckbox
            key={option.value}
            label={option.label}
            checked={filters.credentials.includes(option.value)}
            onChange={(checked) =>
              onChange({
                ...filters,
                credentials: toggle(filters.credentials, option.value, checked),
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup label={copy.availability.label}>
        <FilterCheckbox
          label={copy.availability.option}
          checked={filters.inStock}
          onChange={(inStock) => onChange({ ...filters, inStock })}
        />
      </FilterGroup>
    </aside>
  );
}
