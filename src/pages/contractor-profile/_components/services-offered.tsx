import { formatPrice } from "@/lib/media";
import type { ContractorProfile } from "@/services/public";
import { MapPin } from "lucide-react";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

export default function ServicesOffered({
  services,
}: {
  services: ContractorProfile["services"];
}) {
  if (services.length === 0) return null;

  return (
    <ProfileSection title={contractorProfile.services.title}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <li
            key={service.id}
            className="space-y-3 rounded-2xl border border-[#ededed] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 pb-1">
                <h3 className="text-secondary-foreground text-base leading-7 font-semibold">
                  {service.name}
                </h3>
                <p className="flex items-center gap-1 text-[13.3px] leading-5 text-[#64748b]">
                  <MapPin aria-hidden className="size-4" />
                  {service.location}
                </p>
              </div>
              <p className="shrink-0 text-right text-base leading-[normal] font-bold text-[#0a0a0a]">
                {/* Services added at signup have no price until the contractor sets one */}
                {service.pricing_type === "custom_quote"
                  ? "Get a quote"
                  : formatPrice(service.price, service.unit)}
              </p>
            </div>
            <p className="text-[13.3px] leading-5 text-[#64748b]">
              {service.experience_display}
            </p>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}
