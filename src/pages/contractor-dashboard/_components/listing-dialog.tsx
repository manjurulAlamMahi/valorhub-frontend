import { ApiError, firstFieldErrors } from "@/lib/api";
import { productImage } from "@/services/marketplace";
import {
  catalogApi,
  type ContractorProductItem,
  type ContractorService,
  type ListingKind,
  type PricingType,
} from "@/services/contractor";
import type { Category } from "@/services/public";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

type ListingDialogProps = {
  kind: ListingKind;
  categories: Category[];
  listing: ContractorService | ContractorProductItem | null;
  onClose: () => void;
  onSaved: () => void;
};

const pricingTypes: { value: PricingType; label: string }[] = [
  { value: "fixed", label: "Fixed price" },
  { value: "hourly", label: "Per hour" },
  { value: "sqft", label: "Per sq ft" },
  { value: "custom_quote", label: "Custom quote" },
];

const input =
  "w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10 aria-invalid:border-[#c41e3a]";
const label = "block pb-1.5 text-xs font-medium text-[#374151]";

export default function ListingDialog({
  kind,
  categories,
  listing,
  onClose,
  onSaved,
}: ListingDialogProps) {
  const noun = kind === "service" ? "Service" : "Product";
  const lower = noun.toLowerCase();
  const service =
    kind === "service" ? (listing as ContractorService | null) : null;
  const product =
    kind === "product" ? (listing as ContractorProductItem | null) : null;

  const [values, setValues] = useState({
    name: listing?.name ?? "",
    category_id: String(listing?.category?.id ?? categories[0]?.id ?? ""),
    description: listing?.description ?? "",
    pricing_type: service?.pricing_type ?? ("fixed" as PricingType),
    price: listing?.price != null ? String(listing.price) : "",
    unit: listing?.unit ?? "",
    stock_quantity: product ? String(product.stock_quantity) : "10",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  const needsPrice =
    kind === "product" || values.pricing_type !== "custom_quote";
  // Fixed-price services and products can name a unit ("per visit", "board")
  const showUnit = kind === "product" || values.pricing_type === "fixed";

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const update = (field: keyof typeof values, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = `${noun} name is required.`;
    if (needsPrice && !(Number(values.price) >= 0 && values.price.trim()))
      next.price = "Enter a price, e.g. 150 or 45.50.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length) return;

    const fields: Record<string, string | number | null> = {
      name: values.name.trim(),
      category_id: Number(values.category_id),
      description: values.description.trim() || null,
      price: needsPrice ? Number(values.price) : null,
      unit: showUnit ? values.unit.trim() || null : null,
    };
    if (kind === "service") fields.pricing_type = values.pricing_type;
    else
      fields.stock_quantity = Math.max(
        0,
        Math.round(Number(values.stock_quantity) || 0),
      );

    // A new product image goes as multipart; everything else is JSON
    let body: object | FormData = fields;
    if (image) {
      const form = new FormData();
      for (const [key, value] of Object.entries(fields))
        if (value !== null) form.append(key, String(value));
      form.append("image", image);
      body = form;
    }

    setSaving(true);
    try {
      await catalogApi.saveListing(kind, listing?.id ?? null, body);
      onSaved();
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
        const fieldErrors = firstFieldErrors(err);
        setErrors(fieldErrors);
        if (fieldErrors.image || fieldErrors.category_id)
          setFormError(fieldErrors.image ?? fieldErrors.category_id);
      } else {
        setFormError(
          err instanceof ApiError
            ? err.message
            : `Could not save the ${lower}.`,
        );
      }
      setSaving(false);
    }
  };

  const currentImage = preview ?? productImage(product?.image);

  return (
    <div
      className="fixed inset-0 z-60 grid place-items-center overflow-y-auto bg-[#0f172a]/50 p-4"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-dialog-title"
        noValidate
        onSubmit={(event) => void handleSubmit(event)}
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
            maxLength={255}
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            onChange={(event) => update("name", event.target.value)}
            className={input}
          />
          {errors.name && (
            <p className="pt-1 text-xs text-[#c41e3a]">{errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={kind === "product" ? "col-span-2" : undefined}>
            <label htmlFor="listing-category" className={label}>
              Category
            </label>
            <select
              id="listing-category"
              value={values.category_id}
              onChange={(event) => update("category_id", event.target.value)}
              className={input}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {kind === "service" && (
            <div>
              <label htmlFor="listing-pricing" className={label}>
                Pricing
              </label>
              <select
                id="listing-pricing"
                value={values.pricing_type}
                onChange={(event) => update("pricing_type", event.target.value)}
                className={input}
              >
                {pricingTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {needsPrice && (
            <div>
              <label htmlFor="listing-price" className={label}>
                Price ($)
              </label>
              <input
                id="listing-price"
                inputMode="decimal"
                value={values.price}
                placeholder="0.00"
                aria-invalid={Boolean(errors.price)}
                onChange={(event) =>
                  update("price", event.target.value.replace(/[^\d.]/g, ""))
                }
                className={input}
              />
            </div>
          )}
          {showUnit && (
            <div>
              <label htmlFor="listing-unit" className={label}>
                Unit (optional)
              </label>
              <input
                id="listing-unit"
                maxLength={50}
                value={values.unit}
                placeholder={kind === "product" ? "each, board…" : "per visit"}
                onChange={(event) => update("unit", event.target.value)}
                className={input}
              />
            </div>
          )}
          {kind === "product" && (
            <div>
              <label htmlFor="listing-stock" className={label}>
                In stock
              </label>
              <input
                id="listing-stock"
                type="number"
                min={0}
                value={values.stock_quantity}
                onChange={(event) =>
                  update("stock_quantity", event.target.value)
                }
                className={input}
              />
            </div>
          )}
          {errors.price && (
            <p className="col-span-2 -mt-2 text-xs text-[#c41e3a]">
              {errors.price}
            </p>
          )}
        </div>

        {kind === "product" && (
          <div className="flex items-center gap-3">
            {currentImage && (
              <img
                src={currentImage}
                alt=""
                className="size-14 shrink-0 rounded-lg object-cover"
              />
            )}
            <label className="cursor-pointer rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs font-medium text-[#374151] focus-within:ring-3 focus-within:ring-[#262262]/20 hover:bg-[#f8fafc]">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    setFormError("Images can be up to 5MB.");
                    return;
                  }
                  setFormError("");
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
                className="sr-only"
              />
              {currentImage ? "Replace image" : "Add image"}
            </label>
            <span className="text-[11px] text-[#94a3b8]">
              JPG, PNG or WebP up to 5MB
            </span>
          </div>
        )}

        <div>
          <label htmlFor="listing-description" className={label}>
            Description
          </label>
          <textarea
            id="listing-description"
            rows={3}
            maxLength={2000}
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            className={`${input} resize-y`}
          />
        </div>

        {formError && (
          <p role="alert" className="text-sm text-[#c41e3a]">
            {formError}
          </p>
        )}

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
            disabled={saving}
            className="rounded-lg bg-[#262262] px-4 py-2 text-sm font-semibold text-white hover:bg-[#211d53] disabled:opacity-60"
          >
            {saving ? "Saving…" : listing ? "Save changes" : `Add ${lower}`}
          </button>
        </div>
      </form>
    </div>
  );
}
