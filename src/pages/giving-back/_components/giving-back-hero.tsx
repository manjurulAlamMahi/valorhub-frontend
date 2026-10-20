import Breadcrumb from "@/components/shared/breadcrumb";
import PageHero from "@/components/shared/page-hero";
import type { GivingBackData } from "@/services/public";
import { givingBack } from "../data/giving-back";

export default function GivingBackHero({
  hero,
}: {
  hero: GivingBackData["hero"];
}) {
  // The API sends the full headline plus the phrase to highlight
  const rest = hero.headline.startsWith(hero.highlight)
    ? hero.headline.slice(hero.highlight.length).trim()
    : hero.headline;
  const highlight = rest === hero.headline ? "" : hero.highlight;

  return (
    <PageHero className="space-y-4 md:py-16.75 lg:py-16.75">
      <Breadcrumb items={givingBack.breadcrumbs} />

      <span className="inline-block rounded-full bg-white/15 px-3 py-1.25 text-[11px] leading-[normal] font-bold text-white uppercase">
        {hero.badge}
      </span>

      <h1 className="font-mono text-3xl leading-[normal] font-extrabold text-white md:text-4xl lg:text-[42px]">
        {highlight && <span className="text-primary">{highlight}</span>} {rest}
      </h1>

      <p className="text-sm leading-6 font-medium text-white md:text-base">
        {hero.subtitle}
      </p>
    </PageHero>
  );
}
