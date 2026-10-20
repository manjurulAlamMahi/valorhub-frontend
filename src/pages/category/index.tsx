import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { breadcrumbSchema, marketplaceSchema } from "@/lib/schemas";
import Achievement from "@/pages/home/_components/achievements";
import Career from "@/pages/home/_components/career";
import CategoryHero from "./_components/category-hero";
import FeaturedCategories from "./_components/featured-categories";
import type { CategoriesData } from "@/services/public";

export default function Category() {
  const { data, error, refetch } = useApi<CategoriesData>("/categories", {
    type: "service",
  });

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
        <CategoryHero popular={data?.popular_tags} />
        <Achievement metrics={data?.metrics} className="py-6" />
        <FeaturedCategories
          categories={data?.categories}
          error={error}
          onRetry={refetch}
        />
        <Career />
      </main>
    </>
  );
}
