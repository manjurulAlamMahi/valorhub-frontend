import CtaBanner from "@/components/shared/cta-banner";
import { SEO } from "@/components/seo/SEO";
import { breadcrumbSchema, marketplaceSchema } from "@/lib/schemas";
import MarketplaceHero from "./_components/marketplace-hero";
import ShopByCategory from "./_components/shop-by-category";
import TrendingProducts from "./_components/trending-products";
import { marketplace } from "./data/marketplace";

export default function Marketplace() {
  return (
    <>
      <SEO
        title="Marketplace"
        description="Shop parts, equipment, and service bundles directly from verified veteran-owned contractors on the ValorHub Marketplace."
        canonical="https://valorhub.com/marketplace"
        jsonLd={[
          marketplaceSchema,
          breadcrumbSchema([{ name: "Marketplace", url: "/marketplace" }]),
        ]}
      />

      <main>
        <MarketplaceHero />
        <ShopByCategory />
        <TrendingProducts />
        <CtaBanner
          title={marketplace.cta.title}
          description={marketplace.cta.description}
          actions={[marketplace.cta.action]}
          className="bg-[#f4f4f4]"
          containerClassName="py-10! xl:max-w-310"
          cardClassName="py-10"
        />
      </main>
    </>
  );
}
