import type {
  ProductCredentialKey,
  ProductsData,
} from "@/services/marketplace";
import { useState, type PropsWithChildren } from "react";
import { useDebounceCallback } from "usehooks-ts";
import {
  browseProducts,
  credentialKeys,
  type ProductFilters,
} from "../data/browse-products";
import FilterCheckbox from "./filter-checkbox";
import PriceRange from "./price-range";

const { filters: copy } = browseProducts;

type ProductFiltersPanelProps = {
  filters: ProductFilters;
  options?: ProductsData["filter_options"];
  onChange: (changes: Record<string, string | null>) => void;
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

// Slider bounds rounded out to whole tens so the handles land on clean prices
function boundsFrom(range: { min: number; max: number }): [number, number] {
  const min = Math.floor(range.min / 10) * 10;
  return [min, Math.max(Math.ceil(range.max / 10) * 10, min + 10)];
}

export default function ProductFiltersPanel({
  filters,
  options,
  onChange,
}: ProductFiltersPanelProps) {
  const bounds = options ? boundsFrom(options.price_range) : null;
  const applied: [number, number] | null = bounds && [
    filters.min_price ?? bounds[0],
    filters.max_price ?? bounds[1],
  ];

  // Dragging stays local; the URL (and the request) follow once the user pauses
  const [price, setPrice] = useState(applied);
  const [syncedPrice, setSyncedPrice] = useState(applied);
  if (applied?.join() !== syncedPrice?.join()) {
    setSyncedPrice(applied);
    setPrice(applied);
  }
  const commitPrice = useDebounceCallback(([low, high]: [number, number]) => {
    if (!bounds) return;
    onChange({
      min_price: low > bounds[0] ? String(low) : null,
      max_price: high < bounds[1] ? String(high) : null,
    });
  }, 400);

  const toggleCategory = (id: number, checked: boolean) => {
    const next = checked
      ? [...filters.categories, id]
      : filters.categories.filter((item) => item !== id);
    onChange({ categories: next.length ? next.join(",") : null });
  };

  const toggleCredential = (key: ProductCredentialKey, checked: boolean) =>
    onChange({ [key]: checked ? "1" : null });

  const reset = () => {
    commitPrice.cancel();
    onChange({
      categories: null,
      min_price: null,
      max_price: null,
      in_stock_only: null,
      ...Object.fromEntries(credentialKeys.map((key) => [key, null])),
    });
  };

  return (
    <aside className="h-fit space-y-5.5 rounded-[14px] border border-[#e6eaf2] bg-white p-5.5 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] lg:mt-12 lg:w-65 lg:shrink-0">
      <div className="flex items-center justify-between border-b border-[#e6eaf2] pb-5.5">
        <h2 className="text-base leading-[normal] font-bold text-[#1e293b]">
          {copy.title}
        </h2>
        <button
          type="button"
          onClick={reset}
          className="text-xs leading-[normal] font-medium text-[#c92032] hover:underline"
        >
          {copy.reset}
        </button>
      </div>

      {options && bounds && price && (
        <>
          <FilterGroup label={copy.price}>
            <PriceRange
              bounds={bounds}
              value={price}
              onChange={(next) => {
                setPrice(next);
                commitPrice(next);
              }}
            />
          </FilterGroup>

          <FilterGroup label={copy.category}>
            {options.categories.map((category) => (
              <FilterCheckbox
                key={category.id}
                label={category.name}
                checked={filters.categories.includes(category.id)}
                onChange={(checked) => toggleCategory(category.id, checked)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label={copy.credentials}>
            {options.credentials.map((option) => (
              <FilterCheckbox
                key={option.key}
                label={option.label}
                checked={filters.credentials.includes(option.key)}
                onChange={(checked) => toggleCredential(option.key, checked)}
              />
            ))}
          </FilterGroup>
        </>
      )}

      <FilterGroup label={copy.availability.label}>
        <FilterCheckbox
          label={copy.availability.option}
          checked={filters.in_stock_only}
          onChange={(checked) =>
            onChange({ in_stock_only: checked ? "1" : null })
          }
        />
      </FilterGroup>
    </aside>
  );
}
