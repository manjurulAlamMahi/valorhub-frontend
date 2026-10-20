import UserAvatar from "@/components/shared/user-avatar";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import ContractorBadges from "@/pages/contractor-list/_components/contractor-badges";
import { badgeList, type ContractorProfile } from "@/services/public";
import { Calendar, CircleCheck, Globe, Heart, Share, Star } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { contractorProfile } from "../data/contractor-profile";
import { useSavedContractor } from "../data/use-saved-contractor";

const { actions } = contractorProfile;

const actionClassName =
  "grid size-10 place-content-center rounded-full border border-[#f3f3f3] bg-white text-[#0a0a0a] transition-colors hover:bg-muted [&_svg]:size-5";

export default function ProfileHeader({
  contractor,
}: {
  contractor: ContractorProfile;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const saved = useSavedContractor(contractor.id);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!saved.isCustomer) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    setSaving(true);
    try {
      await saved.toggle();
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator
        .share({ title: contractor.business_name, url })
        .catch(() => {});
    } else {
      await navigator.clipboard?.writeText(url);
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-[20px] bg-white p-6 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="size-48 shrink-0 overflow-hidden rounded-2xl bg-[#f1f5f9]">
          <UserAvatar
            name={contractor.business_name}
            src={mediaUrl(contractor.avatar)}
            className="size-full rounded-none object-top text-5xl"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-1.5">
            <h1 className="font-mono text-2xl leading-[normal] font-bold text-[#0a0a0a] md:text-[28px]">
              {contractor.business_name}
            </h1>
            {contractor.badges.is_id_verified && (
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
                {contractor.rating}
              </span>
              <span className="text-base text-[#64748b]">
                ({contractor.review_count} reviews)
              </span>
            </p>

            <p className="flex h-8 items-center gap-2 text-base text-[#64748b]">
              <Calendar aria-hidden className="size-5" />
              {contractor.years_experience_display}
            </p>
          </div>

          <ContractorBadges
            badges={badgeList(contractor.badges)}
            availableToday={contractor.badges.is_available_today}
          />

          {contractor.location.zip_code && (
            <p className="w-fit rounded-[20px] border border-[#d2d2d2] px-4 py-1.5 text-base leading-[normal] text-[#64748b]">
              ZIP Code: {contractor.location.zip_code}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {saved.visible && (
          <button
            type="button"
            aria-label={actions.save}
            aria-pressed={saved.saved}
            disabled={saving || !saved.ready}
            onClick={() => void handleSave()}
            className={cn(actionClassName, "disabled:opacity-60")}
          >
            <Heart
              className={cn({ "fill-primary text-primary": saved.saved })}
            />
          </button>
        )}
        <button
          type="button"
          aria-label={actions.share}
          onClick={handleShare}
          className={actionClassName}
        >
          <Share />
        </button>
        {contractor.website_url && (
          <a
            href={contractor.website_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={actions.website}
            className={actionClassName}
          >
            <Globe />
          </a>
        )}
      </div>
    </div>
  );
}
