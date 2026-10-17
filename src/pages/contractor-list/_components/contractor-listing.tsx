import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import {
  contractorList,
  initialFilters,
  type ContractorFiltersState,
} from "../data/contractor-list";
import { contractors } from "../data/contractors";
import ContractorCard from "./contractor-card";
import ContractorFilters from "./contractor-filters";
import ContractorPagination from "./contractor-pagination";

export default function ContractorListing({ slug }: { slug: string }) {
  const [filters, setFilters] = useState(initialFilters);
  const [searchParams, setSearchParams] = useSearchParams();
  const listingRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      contractors.filter((contractor) => {
        const zip = filters.zip.trim();
        if (zip && !contractor.zip.startsWith(zip)) return false;
        if (contractor.rating < filters.minRating) return false;

        return filters.credentials.every((credential) =>
          credential === "available"
            ? contractor.availableToday
            : contractor.badges.includes(
                credential as (typeof contractor.badges)[number],
              ),
        );
      }),
    [filters],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / contractorList.pageSize),
  );
  const requestedPage = Number(searchParams.get("page")) || 1;
  const page = Math.min(Math.max(requestedPage, 1), totalPages);
  const visible = filtered.slice(
    (page - 1) * contractorList.pageSize,
    page * contractorList.pageSize,
  );

  const setPage = (next: number) => {
    setSearchParams(
      (prev) => {
        if (next === 1) prev.delete("page");
        else prev.set("page", String(next));
        return prev;
      },
      { preventScrollReset: true },
    );
  };

  const handlePageChange = (next: number) => {
    setPage(next);
    listingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFiltersChange = (next: ContractorFiltersState) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <Section className="bg-[#f8f8fa]">
      <Container>
        <div
          ref={listingRef}
          className="flex scroll-mt-40 flex-col gap-6 lg:flex-row"
        >
          <ContractorFilters
            slug={slug}
            filters={filters}
            onChange={handleFiltersChange}
          />

          <div className="min-w-0 flex-1">
            {visible.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {visible.map((contractor) => (
                  <ContractorCard key={contractor.id} contractor={contractor} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground rounded-2xl border border-[#ebebeb] bg-white p-10 text-center text-sm">
                {contractorList.empty}
              </p>
            )}
          </div>
        </div>

        <ContractorPagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Container>
    </Section>
  );
}
