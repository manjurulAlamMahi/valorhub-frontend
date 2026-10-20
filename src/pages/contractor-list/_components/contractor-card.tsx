import UserAvatar from "@/components/shared/user-avatar";
import { mediaUrl } from "@/lib/media";
import {
  badgeList,
  type ContractorCard as ContractorCardData,
} from "@/services/public";
import { Eye, FileText, MapPin } from "lucide-react";
import { Link } from "react-router";
import { contractorList } from "../data/contractor-list";
import ContractorBadges from "./contractor-badges";

export default function ContractorCard({
  contractor,
}: {
  contractor: ContractorCardData;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-[#ebebeb] bg-white px-6.25 py-5.25">
      <div className="flex items-start gap-3">
        <UserAvatar
          name={contractor.business_name}
          src={mediaUrl(contractor.avatar)}
          className="mr-1 size-13 text-base"
        />

        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-card-foreground font-mono text-base leading-[normal] font-bold">
              {contractor.business_name}
            </h3>
            <p className="pt-0.5 text-xs leading-4 text-[#6a7282]">
              {contractor.category_title}
            </p>
          </div>

          {contractor.hourly_rate_display && (
            <p className="text-secondary-foreground shrink-0 text-2xl leading-5 font-bold">
              {contractor.hourly_rate_display}
            </p>
          )}
        </div>
      </div>

      <ContractorBadges
        badges={badgeList(contractor.badges)}
        availableToday={contractor.badges.is_available_today}
        className="pt-3"
      />

      <div className="flex flex-wrap items-center gap-3 pt-3">
        <p className="flex items-center gap-1 text-xs leading-4 text-[#6a7282]">
          <MapPin aria-hidden className="size-2.75" />
          {contractor.location}
        </p>

        <div className="flex items-center gap-1">
          <div
            className="flex items-center gap-1"
            role="img"
            aria-label={`Rated ${contractor.rating} out of 5`}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <img
                key={index}
                src="/svgs/star-fill.svg"
                alt=""
                className="size-[14.333px] object-contain"
              />
            ))}
          </div>
          <span className="text-xs leading-4 font-semibold text-[#1e2939]">
            {contractor.rating}
          </span>
          <span className="text-muted-foreground text-xs leading-4">
            ({contractor.review_count})
          </span>
        </div>
      </div>

      {contractor.specialties.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 pt-3">
          {contractor.specialties.map((service) => (
            <li
              key={service}
              className="bg-muted rounded-[18px] border border-[#f3f4f6] px-2.25 py-0.75 text-xs leading-4 text-[#4a5565]"
            >
              {service}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex gap-2 pt-4">
        <Link
          to={`/request-quote?contractor=${contractor.id}`}
          className="flex h-8.5 flex-1 items-center justify-center gap-1 rounded-lg bg-[#c92032] text-xs font-semibold text-white transition-colors hover:bg-[#c92032]/90"
        >
          <FileText aria-hidden className="size-3.25" />
          {contractorList.cta.quote}
        </Link>
        <Link
          to={`/contractors/${contractor.id}`}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/70 flex h-8.5 flex-1 items-center justify-center gap-1 rounded-lg text-xs font-semibold transition-colors"
        >
          <Eye aria-hidden className="size-3.25" />
          {contractorList.cta.profile}
        </Link>
      </div>
    </article>
  );
}
