import { hero } from "../data/hero";

export default function HeroHeadline() {
  return (
    <>
      <img
        src={hero.badge}
        alt="Sponsored | Elite Partner"
        className="h-8 w-auto object-contain md:h-9.5"
      />
      <div className="space-y-2">
        <h2 className="text-2xl leading-[1.13] font-bold text-white md:text-4xl lg:text-[52px]">
          {hero.heading}
        </h2>

        <p className="text-sm leading-normal font-normal text-white md:text-base">
          {hero.subheading}
        </p>
      </div>
    </>
  );
}
