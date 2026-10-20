import Container from "@/components/shared/container";
import Pagination from "@/components/shared/pagination";
import { EmptyState, ErrorState } from "@/components/shared/query-state";
import Section from "@/components/shared/section";
import type { ApiQuery } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import type { ProductsData } from "@/services/marketplace";
import { X } from "lucide-react";
import { useRef } from "react";
import { useSearchParams } from "react-router";
import {
  browseProducts,
  PAGE_SIZE,
  type ProductFilters,
} from "../data/browse-products";
import ProductCard from "./product-card";
import ProductFiltersPanel from "./product-filters";

type ProductListingProps = {
  filters: ProductFilters;
  query: ApiQuery<ProductsData>;
};

export default function ProductListing({
  filters,
  query,
}: ProductListingProps) {
  const [, setSearchParams] = useSearchParams();
  const listingRef = useRef<HTMLDivElement>(null);
  const { data, error, isLoading, refetch } = query;

  // Every filter change resets to page 1
  const updateParams = (changes: Record<string, string | null>) => {
    setSearchParams(
      (prev) => {
        for (const [key, value] of Object.entries(changes)) {
          if (value) prev.set(key, value);
          else prev.delete(key);
        }
        if (!("page" in changes)) prev.delete("page");
        return prev;
      },
      { preventScrollReset: true },
    );
  };

  const handlePageChange = (next: number) => {
    updateParams({ page: next === 1 ? null : String(next) });
    listingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const total = data?.pagination.total ?? 0;

  return (
    <Section className="bg-input">
      <Container className="pt-10! pb-11! xl:max-w-310">
        <div
          ref={listingRef}
          className="flex scroll-mt-40 flex-col gap-6 lg:flex-row"
        >
          <ProductFiltersPanel
            filters={filters}
            options={data?.filter_options}
            onChange={updateParams}
          />

          <div className="min-w-0 flex-1 space-y-5">
            <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
              {filters.search ? (
                <p className="bg-secondary text-secondary-foreground flex items-center gap-1.5 rounded-full py-1 pr-1.5 pl-3 text-xs font-medium">
                  Results for “{filters.search}”
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => updateParams({ search: null })}
                    className="grid size-5 place-content-center rounded-full hover:bg-[#26225f]/10"
                  >
                    <X aria-hidden className="size-3" />
                  </button>
                </p>
              ) : (
                <span />
              )}
              {data && (
                <p className="text-sm leading-[normal] text-[#64748b]">
                  {total} {total === 1 ? "product" : "products"}
                </p>
              )}
            </div>

            <div
              aria-busy={isLoading}
              className={cn("transition-opacity", {
                "opacity-60": isLoading && data,
              })}
            >
              {!data && error ? (
                <ErrorState error={error} onRetry={refetch} />
              ) : !data ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: PAGE_SIZE }, (_, index) => (
                    <div
                      key={index}
                      aria-hidden
                      className="h-80 animate-pulse rounded-xl bg-white"
                    />
                  ))}
                </div>
              ) : data.items.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {data.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyState className="rounded-xl border-[#e6eaf2]">
                  {browseProducts.empty}
                </EmptyState>
              )}
            </div>
          </div>
        </div>

        {data && (
          <Pagination
            page={data.pagination.current_page}
            totalPages={data.pagination.last_page}
            onPageChange={handlePageChange}
          />
        )}
      </Container>
    </Section>
  );
}
