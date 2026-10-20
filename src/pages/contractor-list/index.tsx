import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { breadcrumbSchema } from "@/lib/schemas";
import Career from "@/pages/home/_components/career";
import { NotFound } from "@/pages/NotFound";
import type { ContractorsData } from "@/services/public";
import { useParams, useSearchParams } from "react-router";
import ContractorListHero from "./_components/contractor-list-hero";
import ContractorListing from "./_components/contractor-listing";
import { contractorList, PAGE_SIZE, readFilters } from "./data/contractor-list";

// Serves both /category/:id (one category) and /contractors (search across all)
export default function ContractorList() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const filters = readFilters(searchParams);
  const categoryId = id === undefined ? undefined : Number(id);

  const query = useApi<ContractorsData>(
    categoryId === undefined || Number.isInteger(categoryId)
      ? "/contractors"
      : null,
    {
      category_id: categoryId,
      service: filters.service,
      zip_code: filters.zip_code,
      min_rating: filters.min_rating,
      page: filters.page,
      per_page: PAGE_SIZE,
      ...Object.fromEntries(filters.credentials.map((key) => [key, true])),
    },
  );

  // Unknown ids fail the backend's `exists` rule
  const missingCategory =
    categoryId !== undefined &&
    (!Number.isInteger(categoryId) || query.error?.fieldErrors.category_id);
  if (missingCategory) return <NotFound />;

  const category = categoryId ? query.data?.hero.active_category : undefined;
  const title = categoryId
    ? (category?.name ?? "")
    : filters.service
      ? `Results for “${filters.service}”`
      : contractorList.allTitle;
  const description = categoryId
    ? (category?.subtitle ?? "")
    : contractorList.allDescription;
  const path = categoryId ? `/category/${categoryId}` : "/contractors";

  return (
    <>
      <SEO
        title={title || contractorList.title}
        description={`Find verified veteran-owned professionals${category ? ` for ${category.name.toLowerCase()}` : ""}. Compare ratings, credentials and prices, then request a quote.`}
        canonical={`https://valorhub.com${path}`}
        jsonLd={breadcrumbSchema([
          { name: "Category", url: "/category" },
          { name: title || contractorList.title, url: path },
        ])}
      />

      <main>
        <ContractorListHero
          path={path}
          title={title}
          description={description}
          metrics={query.data?.hero.metrics}
          popular={query.data?.popular_tags}
        />
        <ContractorListing
          key={path}
          categoryId={categoryId}
          filters={filters}
          query={query}
        />
        <Career />
      </main>
    </>
  );
}
