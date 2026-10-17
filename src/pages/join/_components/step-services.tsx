import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useState } from "react";
import {
  onboarding,
  popularServices,
  serviceCatalog,
  type Plan,
} from "../data/onboarding";
import { isFreePlan, type StepProps } from "../data/onboarding-state";
import { ContinueButton, FieldError } from "./form-controls";
import StepCard from "./step-card";
import StepForm from "./step-form";

const chipClass =
  "flex items-center gap-1 rounded-full border px-3.5 py-1.75 text-sm font-semibold leading-[normal]";

export default function StepServices({
  values,
  errors,
  onChange,
  onSubmit,
  onBack,
  plan,
}: StepProps & { plan: Plan }) {
  const [query, setQuery] = useState("");
  const limit = plan.serviceLimit;
  const selected = values.services;
  const full = limit !== null && selected.length >= limit;
  const tier = plan.slug.toUpperCase();
  const free = isFreePlan(plan);

  const search = query.trim().toLowerCase();
  const options = (
    search
      ? serviceCatalog.filter((service) =>
          service.toLowerCase().includes(search),
        )
      : popularServices.slice(0, free ? 6 : undefined)
  ).filter((service) => !selected.includes(service));

  const add = (service: string) => {
    if (full) return;
    onChange("services", [...selected, service]);
    setQuery("");
  };

  return (
    <StepCard
      title={onboarding.services.title}
      description={
        limit === null
          ? "Choose services you offer — unlimited selection"
          : `Choose up to ${limit} services you offer`
      }
      onBack={onBack}
    >
      <StepForm onSubmit={onSubmit}>
        <div className="relative">
          <Search
            aria-hidden
            className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1a1830]/50"
          />
          <label htmlFor="service-search" className="sr-only">
            Search services
          </label>
          <input
            id="service-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && options[0]) {
                event.preventDefault();
                add(options[0]);
              }
            }}
            placeholder="Search services... e.g. Plumbing, Electrical"
            className="h-11.5 w-full rounded-[22px] border border-[#e5e7eb] bg-white pr-4 pl-10.5 text-sm text-[#1a1830] outline-none placeholder:text-[#1a1830]/50 focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10"
          />
        </div>

        <div className="space-y-4 pt-1">
          <p className="text-sm leading-5 font-semibold tracking-[0.35px] text-[#6b6e8a] uppercase">
            {limit === null
              ? `Services selected — Unlimited${selected.length ? ` (${selected.length})` : ""}`
              : free
                ? `${selected.length} of ${limit} selected`
                : `Selected Services (${selected.length}/${limit})`}
          </p>
          {selected.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {selected.map((service) => (
                <li key={service}>
                  <button
                    type="button"
                    aria-label={`Remove ${service}`}
                    onClick={() =>
                      onChange(
                        "services",
                        selected.filter((item) => item !== service),
                      )
                    }
                    className={cn(
                      chipClass,
                      "border-secondary-foreground bg-secondary-foreground text-white",
                    )}
                  >
                    {service}
                    <X aria-hidden className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <FieldError id="services" error={errors.services} />

          <div className="space-y-2.5">
            <p className="text-secondary-foreground text-xs font-bold uppercase">
              {search ? "Matching services" : "Popular services"}
            </p>
            {options.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {options.map((service) => (
                  <li key={service}>
                    <button
                      type="button"
                      onClick={() => add(service)}
                      disabled={full}
                      className={cn(
                        chipClass,
                        "text-secondary-foreground border-[#26225f]/25 bg-white hover:bg-[#26225f]/5 disabled:cursor-not-allowed disabled:opacity-40",
                      )}
                    >
                      <span aria-hidden>+</span>
                      {service}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#6b6e8a]">
                No services match “{query}”.
              </p>
            )}
          </div>
        </div>

        <p className="pt-1 text-sm leading-5 font-semibold tracking-[0.35px] text-[#6b6e8a] uppercase">
          {limit === null
            ? `${tier} membership includes unlimited service selection.`
            : free
              ? `Maximum ${limit} services on the free plan.`
              : `You can select ${limit} services in ${plan.slug} subscription plan`}
        </p>
        <ContinueButton />
      </StepForm>
    </StepCard>
  );
}
