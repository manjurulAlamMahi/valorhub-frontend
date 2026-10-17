import { X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Listing } from "../data/listings";

type ListingDialogProps = {
  // "Product" or "Service"
  noun: string;
  categories: readonly string[];
  // Services may be priced as free text such as "Custom Quote"
  freeTextPrice?: boolean;
  listing: Listing | null;
  onClose: () => void;
  onSave: (listing: Omit<Listing, "id" | "active">) => void;
};

const input =
  "w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10 aria-invalid:border-[#c41e3a]";
const label = "block pb-1.5 text-xs font-medium text-[#374151]";

export default function ListingDialog({
  noun,
  categories,
  freeTextPrice,
  listing,
  onClose,
  onSave,
}: ListingDialogProps) {
  const [values, setValues] = useState({
    name: listing?.name ?? "",
    category: listing?.category ?? categories[0],
    description: listing?.description ?? "",
    price: listing?.price ?? "",
  });
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
  const firstRef = useRef<HTMLInputElement>(null);
  const lower = noun.toLowerCase();

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!values.name.trim()) next.name = `${noun} name is required.`;
    if (freeTextPrice ? !values.price.trim() : !/\d/.test(values.price))
      next.price = freeTextPrice
        ? "Enter a price, e.g. $150/hr or Custom Quote."
        : "Enter a price, e.g. $45.00 or $68/board.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const price = values.price.trim();
    onSave({
      name: values.name.trim(),
      category: values.category,
      description: values.description.trim(),
      // Bare numbers get a currency sign; text like "Custom Quote" is kept as is
      price: /^\d/.test(price) ? `$${price}` : price,
    });
  };

  return (
    <div
      className="fixed inset-0 z-60 grid place-items-center bg-[#0f172a]/50 p-4"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-dialog-title"
        noValidate
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <h2
            id="listing-dialog-title"
            className="text-base font-semibold text-[#0f172a]"
          >
            {listing ? `Edit ${lower}` : `Add ${lower}`}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9]"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div>
          <label htmlFor="listing-name" className={label}>
            {noun} name
          </label>
          <input
            ref={firstRef}
            id="listing-name"
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            onChange={(event) =>
              setValues({ ...values, name: event.target.value })
            }
            className={input}
          />
          {errors.name && (
            <p className="pt-1 text-xs text-[#c41e3a]">{errors.name}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="listing-category" className={label}>
              Category
            </label>
            <select
              id="listing-category"
              value={values.category}
              onChange={(event) =>
                setValues({ ...values, category: event.target.value })
              }
              className={input}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="listing-price" className={label}>
              Price
            </label>
            <input
              id="listing-price"
              value={values.price}
              placeholder={freeTextPrice ? "$150/hr" : "$0.00"}
              aria-invalid={Boolean(errors.price)}
              onChange={(event) =>
                setValues({ ...values, price: event.target.value })
              }
              className={input}
            />
          </div>
          {errors.price && (
            <p className="col-span-2 -mt-2 text-xs text-[#c41e3a]">
              {errors.price}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="listing-description" className={label}>
            Description
          </label>
          <textarea
            id="listing-description"
            rows={3}
            value={values.description}
            onChange={(event) =>
              setValues({ ...values, description: event.target.value })
            }
            className={`${input} resize-y`}
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f1f5f9]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#262262] px-4 py-2 text-sm font-semibold text-white hover:bg-[#211d53]"
          >
            {listing ? "Save changes" : `Add ${lower}`}
          </button>
        </div>
      </form>
    </div>
  );
}
