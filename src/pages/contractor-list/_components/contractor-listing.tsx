import Container from "@/components/shared/container";
import { EmptyState, ErrorState } from "@/components/shared/query-state";
import Section from "@/components/shared/section";
import type { ApiQuery } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import type { ContractorsData } from "@/services/public";
import { useRef } from "react";
import { useSearchParams } from "react-router";
import {
  contractorList,
  PAGE_SIZE,
  type ContractorFilters,
} from "../data/contractor-list";
import ContractorCard from "./contractor-card";
import ContractorFiltersPanel from "./contractor-filters";
import Pagination from "@/components/shared/pagination";

type ContractorListingProps = {
  categoryId?: number;
  filters: ContractorFilters;
  query: ApiQuery<ContractorsData>;
};

export default function ContractorListing({
  categoryId,
  filters,
  query,
}: ContractorListingProps) {
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

  return (
    <Section className="bg-[#f8f8fa]">
      <Container>
        <div
          ref={listingRef}
          className="flex scroll-mt-40 flex-col gap-6 lg:flex-row"
        >
          <ContractorFiltersPanel
            categoryId={categoryId}
            filters={filters}
            options={data?.filter_options}
            onChange={updateParams}
          />

          <div
            aria-busy={isLoading}
            className={cn("min-w-0 flex-1 transition-opacity", {
              "opacity-60": isLoading && data,
            })}
          >
            {!data && error ? (
              <ErrorState error={error} onRetry={refetch} />
            ) : !data ? (
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: PAGE_SIZE }, (_, index) => (
                  <div
                    key={index}
                    aria-hidden
                    className="h-64 animate-pulse rounded-2xl bg-white"
                  />
                ))}
              </div>
            ) : data.items.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {data.items.map((contractor) => (
                  <ContractorCard key={contractor.id} contractor={contractor} />
                ))}
              </div>
            ) : (
              <EmptyState>{contractorList.empty}</EmptyState>
            )}
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
