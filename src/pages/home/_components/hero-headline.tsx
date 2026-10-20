import type { HeroSpotlight } from "@/services/public";
import { hero } from "../data/hero";

export default function HeroHeadline({
  spotlight,
}: {
  spotlight?: HeroSpotlight | null;
}) {
  return (
    <>
      <img
        src={hero.badge}
        alt={spotlight?.badge_label ?? "Sponsored | Elite Partner"}
        className="h-8 w-auto object-contain md:h-9.5"
      />
      {/* Fixed height keeps the banner from jumping while the spotlight loads */}
      <div className="min-h-16 space-y-2 md:min-h-20">
        {spotlight && (
          <>
            <h2 className="text-2xl leading-[1.13] font-bold text-white md:text-4xl lg:text-[52px]">
              {spotlight.business_name}
            </h2>

            <p className="line-clamp-1 text-sm leading-normal font-normal text-white md:text-base">
              {spotlight.specialty} · {spotlight.location}
            </p>
          </>
        )}
      </div>
    </>
  );
}
