import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import { onboarding } from "../data/onboarding";
import type { OnboardingValues } from "../data/onboarding-state";
import { FieldError } from "./form-controls";
import StepCard from "./step-card";
import StepForm from "./step-form";

type StepReviewProps = {
  values: OnboardingValues;
  verified: boolean;
  onSubmit: () => void;
  onBack: () => void;
};

export default function StepReview({
  values,
  verified,
  onSubmit,
  onBack,
}: StepReviewProps) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const rows = [
    ["Business name", values.businessName],
    ["Owner", values.ownerName],
    ["Primary category", values.services[0] ?? values.category],
    ["Services offered", `${values.services.length} selected`],
    [
      "Documents",
      values.documents.length ? "License & Insurance uploaded" : "Not uploaded",
    ],
    [
      "Veteran verification",
      verified ? "Verified with ID.me" : "Pending ID.me review",
    ],
  ];

  return (
    <StepCard
      title={onboarding.review.title}
      description={onboarding.review.description}
      onBack={onBack}
    >
      <StepForm
        onSubmit={() =>
          agreed ? onSubmit() : setError("Please confirm the terms to submit.")
        }
      >
        <dl className="space-y-3.5 font-mono text-[13px] leading-[normal]">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="bg-input flex justify-between gap-4 rounded-lg p-3.5"
            >
              <dt className="text-[#64748b]">{label}</dt>
              <dd className="text-right font-semibold text-[#1e293b]">
                {value || "—"}
              </dd>
            </div>
          ))}
        </dl>
        <div className="h-px bg-[#e6eaf2]" />
        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-start gap-2 font-mono text-xs text-[#64748b]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => {
                setAgreed(event.target.checked);
                setError("");
              }}
              aria-describedby={error ? "review-terms-error" : undefined}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "grid size-4 shrink-0 place-content-center rounded border border-[#cbd2e1] text-white peer-focus-visible:ring-3 peer-focus-visible:ring-[#c92032]/30",
                { "border-[#c92032] bg-[#c92032]": agreed },
              )}
            >
              {agreed && <Check className="size-2.5" strokeWidth={3.5} />}
            </span>
            {onboarding.review.terms}
          </label>
          <FieldError id="review-terms" error={error} />
        </div>
        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-[#c92032] font-mono text-base font-bold text-white hover:bg-[#a51a27]"
        >
          {onboarding.review.submit}
        </button>
      </StepForm>
    </StepCard>
  );
}
