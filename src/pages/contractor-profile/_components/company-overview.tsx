import { cn } from "@/lib/utils";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

const { overview } = contractorProfile;

export default function CompanyOverview() {
  return (
    <ProfileSection title={overview.title} bordered>
      <p className="text-sm leading-[22.75px] text-[#4a5565]">
        {overview.description}
      </p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
        {overview.facts.map((fact) => (
          <div key={fact.label} className="space-y-0.5">
            <dt className="text-muted-foreground text-xs leading-4">
              {fact.label}
            </dt>
            <dd
              className={cn("text-sm leading-5 font-semibold text-[#1e2939]", {
                "text-[#009966]": fact.verified,
              })}
            >
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </ProfileSection>
  );
}
