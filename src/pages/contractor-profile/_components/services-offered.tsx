import { MapPin } from "lucide-react";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

const { services } = contractorProfile;

export default function ServicesOffered() {
  return (
    <ProfileSection title={services.title}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {services.items.map((service) => (
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
              <p className="text-base leading-[normal] font-bold text-[#0a0a0a]">
                {service.price}
              </p>
            </div>
            <p className="text-[13.3px] leading-5 text-[#64748b]">
              {service.experience}
            </p>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}
