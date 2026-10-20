import { cn } from "@/lib/utils";
import type { ContractorProfile } from "@/services/public";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

export default function CompanyOverview({
  overview,
}: {
  overview: ContractorProfile["overview"];
}) {
  const facts = [
    {
      label: "Business License",
      value: overview.business_license,
      verified: overview.business_license.includes("✓"),
    },
    { label: "Hours", value: overview.business_hours },
    {
      label: "ID.me Verified",
      value: overview.id_me_verified,
      verified: overview.id_me_verified.includes("✓"),
    },
    { label: "Languages", value: overview.languages.join(", ") },
  ];

  return (
    <ProfileSection title={contractorProfile.overview.title} bordered>
      <p className="text-sm leading-[22.75px] text-[#4a5565]">{overview.bio}</p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
        {facts.map((fact) => (
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
