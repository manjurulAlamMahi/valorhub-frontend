import Breadcrumb from "@/components/shared/breadcrumb";
import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { breadcrumbSchema } from "@/lib/schemas";
import type { ProductsData } from "@/services/marketplace";
import { useSearchParams } from "react-router";
import ProductListing from "./_components/product-listing";
import { browseProducts, PAGE_SIZE, readFilters } from "./data/browse-products";

export default function BrowseProducts() {
  const [searchParams] = useSearchParams();
  const filters = readFilters(searchParams);

  const query = useApi<ProductsData>("/marketplace/products", {
    search: filters.search,
    category_ids: filters.categories,
    min_price: filters.min_price,
    max_price: filters.max_price,
    in_stock_only: filters.in_stock_only || null,
    page: filters.page,
    per_page: PAGE_SIZE,
    ...Object.fromEntries(filters.credentials.map((key) => [key, true])),
  });

  return (
    <>
      <SEO
        title={browseProducts.title}
        description="Browse parts, equipment, and service bundles from verified veteran-owned ValorHub sellers. Filter by price, category, credentials, and availability."
        canonical="https://valorhub.com/marketplace/products"
        jsonLd={breadcrumbSchema([
          { name: "Marketplace", url: "/marketplace" },
          { name: browseProducts.title, url: "/marketplace/products" },
        ])}
      />

      <main>
        <Section className="bg-input">
          <Container className="space-y-1.5 py-7! xl:max-w-310">
            <Breadcrumb items={browseProducts.breadcrumbs} tone="light" />
            <h1 className="text-[26px] leading-[normal] font-bold text-[#1e293b]">
              {browseProducts.title}
            </h1>
            <p className="text-sm leading-[normal] text-[#64748b]">
              {browseProducts.description}
            </p>
          </Container>
        </Section>

        <ProductListing filters={filters} query={query} />
      </main>
    </>
  );
}
