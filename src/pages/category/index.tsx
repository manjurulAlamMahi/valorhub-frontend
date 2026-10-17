import { SEO } from "@/components/seo/SEO";
import { breadcrumbSchema, marketplaceSchema } from "@/lib/schemas";
import Achievement from "@/pages/home/_components/achievements";
import Career from "@/pages/home/_components/career";
import CategoryHero from "./_components/category-hero";
import FeaturedCategories from "./_components/featured-categories";

export default function Category() {
  return (
    <>
      <SEO
        title="Explore Professional Services"
        description="Browse hundreds of verified services provided by trusted veteran-owned professionals across the United States — from skilled trades to healthcare, business and creative services."
        canonical="https://valorhub.com/category"
        ogImage="https://valorhub.com/og/categories.png"
        jsonLd={[
          marketplaceSchema,
          breadcrumbSchema([{ name: "Category", url: "/category" }]),
        ]}
      />

      <main>
        <CategoryHero />
        <Achievement className="py-6" />
        <FeaturedCategories />
        <Career />
      </main>
    </>
  );
}
