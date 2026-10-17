import Breadcrumb from "@/components/shared/breadcrumb";
import PageHero from "@/components/shared/page-hero";
import { marketplace } from "../data/marketplace";
import MarketplaceSearch from "./marketplace-search";

const { hero } = marketplace;

export default function MarketplaceHero() {
  return (
    <PageHero className="md:py-21 lg:py-21">
      <div className="space-y-4">
        <Breadcrumb items={hero.breadcrumbs} />

        <h1 className="font-mono text-3xl leading-[normal] font-extrabold text-white md:text-4xl lg:text-[42px]">
          {hero.headline} <span className="text-primary">{hero.highlight}</span>
        </h1>

        <p className="text-sm leading-6 font-medium text-white md:text-base">
          {hero.description}
        </p>
      </div>

      <MarketplaceSearch />
    </PageHero>
  );
}
