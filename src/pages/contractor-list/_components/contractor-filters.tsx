import type { ContractorsData, CredentialKey } from "@/services/public";
import { ChevronDown } from "lucide-react";
import { useState, type PropsWithChildren } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDebounceCallback } from "usehooks-ts";
import {
  contractorList,
  credentialKeys,
  type ContractorFilters,
} from "../data/contractor-list";

const { filters: copy } = contractorList;

type ContractorFiltersPanelProps = {
  categoryId?: number;
  filters: ContractorFilters;
  options?: ContractorsData["filter_options"];
  onChange: (changes: Record<string, string | null>) => void;
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

export default function ContractorFiltersPanel({
  categoryId,
  filters,
  options,
  onChange,
}: ContractorFiltersPanelProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Typing stays local; the URL (and the request) follow once the user pauses
  const [zip, setZip] = useState(filters.zip_code);
  const [syncedZip, setSyncedZip] = useState(filters.zip_code);
  if (filters.zip_code !== syncedZip) {
    setSyncedZip(filters.zip_code);
    setZip(filters.zip_code);
  }
  const commitZip = useDebounceCallback(
    (value: string) => onChange({ zip_code: value.trim() || null }),
    400,
  );

  // Switching category keeps the other filters but starts at page 1
  const goToCategory = (id: number | null) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    const search = params.toString();
    navigate(
      `${id ? `/category/${id}` : "/contractors"}${search ? `?${search}` : ""}`,
    );
  };

  const clear = () => {
    commitZip.cancel();
    setZip("");
    onChange({
      zip_code: null,
      min_rating: null,
      ...Object.fromEntries(credentialKeys.map((key) => [key, null])),
    });
  };

  const toggleCredential = (key: CredentialKey, checked: boolean) =>
    onChange({ [key]: checked ? "1" : null });

  return (
    <aside className="h-fit space-y-6 rounded-2xl border border-[#ebebeb] bg-white p-6 lg:w-72 lg:shrink-0">
      <div className="flex items-end justify-between gap-6">
        <h2 className="text-[17.4px] leading-6.75 font-bold text-[#0a0a0a]">
          {copy.title}
        </h2>
        <button
          type="button"
          onClick={clear}
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
          maxLength={20}
          value={zip}
          onChange={(event) => {
            setZip(event.target.value);
            commitZip(event.target.value);
          }}
          placeholder={copy.zip.placeholder}
          className="h-10.25 w-full rounded-xl border border-black/8 bg-[#f8fafc] px-4.25 text-xs text-[#0a0a0a] outline-none placeholder:text-[#0a0a0a]/50 focus:border-black/20"
        />
      </div>

      {options && (
        <>
          <FilterGroup label={copy.category.label}>
            <div className="space-y-2.5">
              {options.categories.map((option) => (
                <FilterCheckbox
                  key={option.id}
                  label={option.name}
                  checked={option.id === categoryId}
                  onChange={(checked) =>
                    goToCategory(checked ? option.id : null)
                  }
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label={copy.credentials.label}>
            <div className="space-y-2.5">
              {options.credentials.map((option) => (
                <FilterCheckbox
                  key={option.key}
                  label={option.label}
                  checked={filters.credentials.includes(option.key)}
                  onChange={(checked) => toggleCredential(option.key, checked)}
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
                value={filters.min_rating ?? ""}
                onChange={(event) =>
                  onChange({ min_rating: event.target.value || null })
                }
                className="h-9 w-full cursor-pointer appearance-none rounded-xl border border-black/8 bg-[#f8fafc] px-4.25 text-xs text-[#0a0a0a] outline-none focus:border-black/20"
              >
                {options.ratings.map((option) => (
                  <option key={option.label} value={option.value ?? ""}>
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
        </>
      )}
    </aside>
  );
}
