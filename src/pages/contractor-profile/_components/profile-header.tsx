import { cn } from "@/lib/utils";
import ContractorBadges from "@/pages/contractor-list/_components/contractor-badges";
import type { Contractor } from "@/pages/contractor-list/data/contractors";
import { Calendar, CircleCheck, Globe, Heart, Share, Star } from "lucide-react";
import { useState } from "react";
import { contractorProfile } from "../data/contractor-profile";

const { actions } = contractorProfile;

const actionClassName =
  "grid size-10 place-content-center rounded-full border border-[#f3f3f3] bg-white text-[#0a0a0a] transition-colors hover:bg-muted [&_svg]:size-5";

export default function ProfileHeader({
  contractor,
}: {
  contractor: Contractor;
}) {
  const [saved, setSaved] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: contractor.name, url }).catch(() => {});
    } else {
      await navigator.clipboard?.writeText(url);
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-[20px] bg-white p-6 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="size-48 shrink-0 overflow-hidden rounded-2xl bg-[#f1f5f9]">
          <img
            src={contractorProfile.photo}
            alt={contractor.name}
            className="size-full object-cover object-top"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-1.5">
            <h1 className="font-mono text-2xl leading-[normal] font-bold text-[#0a0a0a] md:text-[28px]">
              {contractor.name}
            </h1>
            {contractor.badges.includes("verified") && (
              <CircleCheck
                aria-label="Verified"
                className="text-primary size-5 shrink-0"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="flex h-8 items-center gap-1.5">
              <Star
                aria-hidden
                className="size-5 fill-[#fdc700] text-[#fdc700]"
              />
              <span className="text-[20.8px] leading-8 font-bold text-[#0a0a0a]">
                {contractorProfile.rating}
              </span>
              <span className="text-base text-[#64748b]">
                ({contractorProfile.reviewCount} reviews)
              </span>
            </p>

            <p className="flex h-8 items-center gap-2 text-base text-[#64748b]">
              <Calendar aria-hidden className="size-5" />
              {contractorProfile.experience}
            </p>
          </div>

          <ContractorBadges
            badges={contractor.badges}
            availableToday={contractor.availableToday}
          />

          <p className="w-fit rounded-[20px] border border-[#d2d2d2] px-4 py-1.5 text-base leading-[normal] text-[#64748b]">
            ZIP Code: {contractor.zip}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          aria-label={actions.save}
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
          className={actionClassName}
        >
          <Heart className={cn({ "fill-primary text-primary": saved })} />
        </button>
        <button
          type="button"
          aria-label={actions.share}
          onClick={handleShare}
          className={actionClassName}
        >
          <Share />
        </button>
        <a
          href={contractorProfile.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={actions.website}
          className={actionClassName}
        >
          <Globe />
        </a>
      </div>
    </div>
  );
}
