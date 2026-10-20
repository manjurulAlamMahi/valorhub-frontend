import { MapPin } from "lucide-react";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

const { location: copy } = contractorProfile;

export default function ServiceLocation({
  location,
  areas,
}: {
  location: string;
  areas: string[];
}) {
  return (
    <ProfileSection title={copy.title} bordered>
      <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-[#bedbff] bg-[linear-gradient(165.86deg,#eff6ff_0%,#dbeafe_100%)] text-center">
        <MapPin aria-hidden className="size-8 text-[#2b7fff]" />
        <p className="pt-2 text-sm leading-5 font-medium text-[#155dfc]">
          {location}
        </p>
        <p className="pt-1 text-xs leading-4 text-[#51a2ff]">{copy.note}</p>
      </div>

      {areas.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-sm leading-5 font-semibold text-[#1e2939]">
            {copy.areasTitle}
          </h3>
          <ul className="flex flex-wrap gap-4">
            {areas.map((area) => (
              <li
                key={area}
                className="bg-muted rounded-[18px] border border-[#e5e7eb] px-3.25 py-1.25 text-xs leading-4 text-[#4a5565]"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}
    </ProfileSection>
  );
}
