import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { annualPrice, onboarding, plans, type Plan } from "../data/onboarding";

type PlanCardsProps = {
  onSelect: (plan: Plan) => void;
  billing?: "monthly" | "annual";
  // Slug of the plan the business is already on
  currentSlug?: string;
  className?: string;
};

// Free / Pro / Elite cards shared by signup and the dashboard Subscription page
export default function PlanCards({
  onSelect,
  billing = "monthly",
  currentSlug,
  className,
}: PlanCardsProps) {
  return (
    <ul className={cn("grid gap-6 md:grid-cols-3", className)}>
      {plans.map((plan) => {
        const isPro = plan.slug === "pro";
        const isCurrent = plan.slug === currentSlug;
        return (
          <li
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-[18px] border border-[#e6eaf2] bg-white p-7",
              {
                "border-2 border-[#c92032]": plan.isPopular,
                "shadow-[0_8px_24px_rgba(0,0,0,0.1)]": isPro,
              },
            )}
          >
            {plan.isPopular && (
              <span className="absolute -top-px -right-px rounded-tr-[16px] rounded-bl-lg bg-[#c92032] px-2.5 py-1 font-mono text-[10px] font-bold text-white uppercase">
                {onboarding.membership.popular}
              </span>
            )}
            <h2 className="font-mono text-xl font-bold text-[#1e293b] uppercase">
              {plan.name}
            </h2>
            <p className="pt-4 font-mono text-[#1e293b]">
              <span className="text-[32px] font-bold">
                ${billing === "annual" ? annualPrice(plan) : plan.monthlyPrice}
              </span>
              <span className="pl-1 text-[13px] text-[#64748b]">
                {billing === "annual" ? "/year" : "/month"}
              </span>
            </p>
            <div className="my-4 h-px bg-[#e6eaf2]" />
            <ul className="flex-1 space-y-2.5 pb-6">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-[13px] text-[#64748b]"
                >
                  <Check
                    aria-hidden
                    className={cn("size-3.5 shrink-0", {
                      "text-[#c92032]": isPro,
                      "text-secondary-foreground": !isPro,
                    })}
                    strokeWidth={2.5}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onSelect(plan)}
              disabled={isCurrent}
              aria-label={
                isCurrent
                  ? `${plan.name} is your current plan`
                  : `Continue with ${plan.name}`
              }
              className={cn(
                "h-12 rounded-xl font-mono text-base font-bold transition-colors disabled:cursor-default disabled:opacity-60",
                plan.isPopular
                  ? "bg-[#c92032] text-white hover:bg-[#a51a27] disabled:hover:bg-[#c92032]"
                  : "border-secondary-foreground text-secondary-foreground hover:bg-secondary border disabled:hover:bg-transparent",
              )}
            >
              {isCurrent ? "Current Plan" : "Continue"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
