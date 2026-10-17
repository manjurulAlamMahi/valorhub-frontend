import Breadcrumb from "@/components/shared/breadcrumb";
import PageHero from "@/components/shared/page-hero";
import { givingBack } from "../data/giving-back";

const { hero } = givingBack;

export default function GivingBackHero() {
  return (
    <PageHero className="space-y-4 md:py-16.75 lg:py-16.75">
      <Breadcrumb items={hero.breadcrumbs} />

      <span className="inline-block rounded-full bg-white/15 px-3 py-1.25 text-[11px] leading-[normal] font-bold text-white uppercase">
        {hero.tag}
      </span>

      <h1 className="font-mono text-3xl leading-[normal] font-extrabold text-white md:text-4xl lg:text-[42px]">
        <span className="text-primary">{hero.highlight}</span> {hero.headline}
      </h1>

      <p className="text-sm leading-6 font-medium text-white md:text-base">
        {hero.description}
      </p>
    </PageHero>
  );
}
