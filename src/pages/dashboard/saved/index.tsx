import Pagination from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/query-state";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import ContractorCard from "@/pages/contractor-list/_components/contractor-card";
import {
  customerApi,
  type Paged,
  type SavedContractor,
} from "@/services/customer";
import type { ContractorCard as ContractorCardData } from "@/services/public";
import { useState } from "react";
import DashboardPage from "../_components/dashboard-page";
import QueryBoundary from "@/components/shared/query-boundary";

function toCard(saved: SavedContractor): ContractorCardData {
  return {
    id: saved.contractor_id,
    business_name: saved.business_name,
    avatar: saved.avatar,
    category_title: saved.category,
    hourly_rate: saved.hourly_rate,
    hourly_rate_display: `${saved.rate_display}/hr`,
    location: saved.location,
    rating: saved.rating,
    review_count: saved.review_count,
    badges: saved.badges,
    specialties: saved.services,
    member_since: null,
  };
}

export default function SavedContractors() {
  const [page, setPage] = useState(1);
  const query = useApi<Paged<SavedContractor>>("/customer/saved-contractors", {
    page,
  });
  const [removing, setRemoving] = useState<number | null>(null);
  const [error, setError] = useState("");

  const remove = async (contractorId: number) => {
    setRemoving(contractorId);
    setError("");
    try {
      await customerApi.removeSaved(contractorId);
      query.refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove.");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <DashboardPage
      title="Saved Contractors"
      description="Contractors you have bookmarked for quick access."
    >
      {error && (
        <p role="alert" className="text-sm text-[#c92032]">
          {error}
        </p>
      )}
      <QueryBoundary query={query}>
        {({ items, pagination }) =>
          items.length === 0 ? (
            <EmptyState>
              You haven't saved any contractors yet. Tap the heart on a
              contractor's profile to save them here.
            </EmptyState>
          ) : (
            <>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((saved) => (
                  <li key={saved.id} className="flex flex-col gap-2">
                    <ContractorCard contractor={toCard(saved)} />
                    <button
                      type="button"
                      disabled={removing === saved.contractor_id}
                      onClick={() => void remove(saved.contractor_id)}
                      className="self-end text-[13px] font-medium text-[#c92032] hover:underline disabled:opacity-60"
                    >
                      {removing === saved.contractor_id
                        ? "Removing…"
                        : "Remove from saved"}
                    </button>
                  </li>
                ))}
              </ul>
              <Pagination
                page={pagination.current_page}
                totalPages={pagination.last_page}
                onPageChange={setPage}
              />
            </>
          )
        }
      </QueryBoundary>
    </DashboardPage>
  );
}
