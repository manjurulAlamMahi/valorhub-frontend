import { requestQuote, type QuoteFormValues } from "../data/request-quote";

export type LocationField = keyof typeof requestQuote.location.fields;

type StepLocationProps = {
  values: Pick<QuoteFormValues, LocationField>;
  errors: Partial<Record<LocationField, string>>;
  onChange: (field: LocationField, value: string) => void;
};

const autoComplete: Record<LocationField, string> = {
  street_address: "street-address",
  zip_code: "postal-code",
  city: "address-level2",
  state: "address-level1",
};

export default function StepLocation({
  values,
  errors,
  onChange,
}: StepLocationProps) {
  const fields = Object.entries(requestQuote.location.fields) as [
    LocationField,
    (typeof requestQuote.location.fields)[LocationField],
  ][];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([field, config]) => {
        const id = `quote-${field}`;
        const error = errors[field];

        return (
          <div key={field} className="space-y-1.5">
            <label
              htmlFor={id}
              className="block text-sm leading-5 font-semibold text-[#111827]"
            >
              {config.label}
              {!config.required && (
                <span className="font-normal text-[#94a3b8]"> (optional)</span>
              )}
            </label>
            <input
              id={id}
              type="text"
              value={values[field]}
              maxLength={config.max}
              placeholder={config.placeholder}
              autoComplete={autoComplete[field]}
              inputMode={field === "zip_code" ? "numeric" : undefined}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(event) => onChange(field, event.target.value)}
              className="h-10.5 w-full rounded-[10px] border border-[#e8ecf4] bg-white px-4.25 text-sm text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c92032]"
            />
            {error && (
              <p id={`${id}-error`} className="text-sm text-[#c92032]">
                {error}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
