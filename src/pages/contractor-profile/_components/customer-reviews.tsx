import UserAvatar from "@/components/shared/user-avatar";
import { mediaUrl } from "@/lib/media";
import type { ContractorProfile } from "@/services/public";
import { Star } from "lucide-react";
import { Link } from "react-router";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

const { reviews: copy } = contractorProfile;

export default function CustomerReviews({
  reviews,
}: {
  reviews: ContractorProfile["reviews"];
}) {
  return (
    <ProfileSection
      title={copy.title}
      action={
        <Link
          to="/dashboard/reviews"
          className="text-primary font-mono text-sm leading-[normal] font-medium hover:underline"
        >
          {copy.add}
        </Link>
      }
    >
      {reviews.length === 0 ? (
        <p className="text-sm text-[#64748b]">{copy.empty}</p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="space-y-2 border-b border-black/8 pb-6.25 last:border-none last:pb-0"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={review.author_name}
                    src={mediaUrl(review.author_avatar)}
                    className="size-10"
                  />
                  <div>
                    <p className="font-mono text-sm leading-[normal] font-bold text-[#0a0a0a]">
                      {review.author_name}
                    </p>
                    <p className="text-[13.1px] leading-5 text-[#64748b]">
                      {review.created_at}
                    </p>
                  </div>
                </div>

                <div
                  className="flex"
                  role="img"
                  aria-label={`Rated ${review.rating} out of 5`}
                >
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star
                      key={index}
                      aria-hidden
                      className="size-4 fill-[#fdc700] text-[#fdc700]"
                    />
                  ))}
                </div>
              </div>

              {review.comment && (
                <p className="text-[14.9px] leading-6 text-[#64748b]">
                  {review.comment}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </ProfileSection>
  );
}
