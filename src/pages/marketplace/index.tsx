import CtaBanner from "@/components/shared/cta-banner";
import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { breadcrumbSchema, marketplaceSchema } from "@/lib/schemas";
import type { MarketplaceLanding } from "@/services/marketplace";
import MarketplaceHero from "./_components/marketplace-hero";
import ShopByCategory from "./_components/shop-by-category";
import TrendingProducts from "./_components/trending-products";
import { marketplace } from "./data/marketplace";

export default function Marketplace() {
  const { user } = useAuth();
  const { data, error, refetch } = useApi<MarketplaceLanding>("/marketplace");

  // Contractors list products from their dashboard; everyone else signs up first
  const listProductLink =
    user?.role === "business" ? "/contractor/dashboard/products" : "/join";

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
        <ShopByCategory categories={data?.categories} />
        <TrendingProducts
          products={data?.trending_products}
          error={error}
          onRetry={refetch}
        />
        <CtaBanner
          title={marketplace.cta.title}
          description={marketplace.cta.description}
          actions={[{ label: marketplace.cta.label, link: listProductLink }]}
          className="bg-[#f4f4f4]"
          containerClassName="py-10! xl:max-w-310"
          cardClassName="py-10"
        />
      </main>
    </>
  );
}
