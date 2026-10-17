import { Star, Users } from "lucide-react";
import { Link } from "react-router";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

const { reviews } = contractorProfile;

export default function CustomerReviews() {
  return (
    <ProfileSection
      title={reviews.title}
      action={
        <Link
          to="/dashboard/reviews"
          className="text-primary font-mono text-sm leading-[normal] font-medium hover:underline"
        >
          {reviews.add}
        </Link>
      }
    >
      <ul className="space-y-6">
        {reviews.items.map((review) => (
          <li
            key={review.id}
            className="space-y-2 border-b border-black/8 pb-6.25 last:border-none last:pb-0"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 grid size-10 place-content-center rounded-full">
                  <Users aria-hidden className="text-primary size-5" />
                </span>
                <div>
                  <p className="font-mono text-sm leading-[normal] font-bold text-[#0a0a0a]">
                    {review.author}
                  </p>
                  <p className="text-[13.1px] leading-5 text-[#64748b]">
                    {review.date}
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

            <p className="text-[14.9px] leading-6 text-[#64748b]">
              {review.text}
            </p>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}
