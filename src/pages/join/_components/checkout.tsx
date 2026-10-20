import { ApiError } from "@/lib/api";
import type { CheckoutPayload } from "@/services/onboarding";
import { ArrowLeft, Lock } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { onboarding, type Plan } from "../data/onboarding";
import StepForm from "./step-form";

type CheckoutProps = {
  plan: Plan;
  onBack: () => void;
  // Charges the card through the API, then advances the flow
  onSubmit: (payload: CheckoutPayload) => Promise<void>;
};

const formatCard = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
    : digits;
};

function Field({
  id,
  label,
  error,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="min-w-0 flex-1 space-y-1.5">
      <label
        htmlFor={id}
        className="block font-mono text-xs font-medium text-[#1e293b]"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="bg-input w-full rounded-lg border border-[#e6eaf2] px-3.5 py-2.5 font-mono text-[13px] text-[#1e293b] outline-none placeholder:text-[#64748b] focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c92032]"
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-[#c92032]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Checkout({ plan, onBack, onSubmit }: CheckoutProps) {
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    zip: "",
    coupon: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof card, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const price = `$${plan.monthlyPrice.toFixed(2)}`;
  const tier = plan.slug.toUpperCase();

  const update = (field: keyof typeof card, value: string) => {
    setCard((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const next: typeof errors = {};
    if (card.number.replace(/\D/g, "").length < 15)
      next.number = "Enter a valid card number.";
    const [month, year] = card.expiry.split(" / ").map(Number);
    if (!(month >= 1 && month <= 12 && year >= 0 && card.expiry.length === 7))
      next.expiry = "Enter a valid expiry date.";
    if (!/^\d{3,4}$/.test(card.cvc)) next.cvc = "Enter a valid CVC.";
    if (!/^\d{5}$/.test(card.zip)) next.zip = "Enter a valid ZIP code.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setFormError("");
    try {
      await onSubmit({
        card_number: card.number.replace(/\D/g, ""),
        exp_month: month,
        exp_year: 2000 + year,
        cvc: card.cvc,
      });
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "Payment failed. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-input px-4 py-10">
      <section className="mx-auto max-w-140 space-y-5 rounded-[20px] border border-[#e6eaf2] bg-white p-5 font-mono leading-[normal] sm:p-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-[13px] font-medium text-[#64748b] hover:text-[#1e293b]"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          {onboarding.checkout.back}
        </button>
        <h1 className="text-2xl font-bold text-[#1e293b]">
          {onboarding.checkout.title}
        </h1>
        <p className="rounded-lg bg-[#def5e3] px-4 py-2.5 text-sm font-semibold text-[#0f6633]">
          Your first month as a {tier} verified member is free — then {price}
          /month. Cancel anytime.
        </p>

        <dl className="bg-input space-y-2.5 rounded-xl p-4.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748b]">
              {plan.name.replace(" Verified Membership", "")} Plan
            </dt>
            <dd className="font-medium text-[#1e293b]">{price} / month</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748b]">Billing cycle</dt>
            <dd className="font-medium text-[#1e293b]">Monthly</dd>
          </div>
          <div className="h-px bg-[#e6eaf2]" />
          <div className="flex justify-between gap-4 font-bold">
            <dt className="text-[#1e293b]">Total due today</dt>
            <dd className="text-secondary-foreground">$0.00</dd>
          </div>
        </dl>

        <StepForm onSubmit={handleSubmit}>
          <Field
            id="card-number"
            label="Card number"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 1234 1234 1234"
            value={card.number}
            error={errors.number}
            onChange={(event) =>
              update("number", formatCard(event.target.value))
            }
          />
          <div className="flex gap-3">
            <Field
              id="card-expiry"
              label="Expiry date"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM / YY"
              value={card.expiry}
              error={errors.expiry}
              onChange={(event) =>
                update("expiry", formatExpiry(event.target.value))
              }
            />
            <Field
              id="card-cvc"
              label="CVC"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={card.cvc}
              error={errors.cvc}
              onChange={(event) =>
                update("cvc", event.target.value.replace(/\D/g, "").slice(0, 4))
              }
            />
          </div>
          <Field
            id="billing-zip"
            label="Billing ZIP code"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="75201"
            value={card.zip}
            error={errors.zip}
            onChange={(event) =>
              update("zip", event.target.value.replace(/\D/g, "").slice(0, 5))
            }
          />
          <Field
            id="coupon"
            label="Coupon code (optional)"
            placeholder="Enter code"
            value={card.coupon}
            onChange={(event) => update("coupon", event.target.value)}
          />
          {formError && (
            <p role="alert" className="text-sm text-[#c92032]">
              {formError}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-xl bg-[#c92032] text-base font-bold text-white hover:bg-[#a51a27] disabled:opacity-70"
          >
            {submitting ? "Processing…" : "Start for $0.00"}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-[#64748b]">
            <Lock aria-hidden className="size-3.5" />
            {onboarding.checkout.secure}
          </p>
        </StepForm>
      </section>
    </div>
  );
}
