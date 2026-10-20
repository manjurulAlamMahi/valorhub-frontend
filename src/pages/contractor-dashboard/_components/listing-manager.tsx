import QueryBoundary from "@/components/shared/query-boundary";
import ProductImage from "@/components/shared/product-image";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  catalogApi,
  type ContractorProductItem,
  type ContractorService,
  type ListingKind,
  type ListingsData,
  type PlanUsage,
} from "@/services/contractor";
import type { CategoriesData } from "@/services/public";
import { CircleAlert, CircleCheck, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router";
import ListingDialog from "./listing-dialog";

type Listing = ContractorService | ContractorProductItem;

const nouns: Record<ListingKind, string> = {
  service: "Service",
  product: "Product",
};

// "Elite Plan: Unlimited services. Currently using 6." / "3 of 10 used"
function usageText(usage: PlanUsage, kind: ListingKind) {
  const plural = `${kind}s`;
  const plan =
    usage.plan?.replace(" Verified Membership", " Plan") ?? "Your plan";
  if (usage.is_unlimited)
    return `${plan}: Unlimited ${plural}. Currently using ${usage.used}.`;
  if (usage.limit === 0) return `${plan} doesn't include ${kind} listings.`;
  return `${plan}: ${usage.used} of ${usage.limit} ${plural} used.`;
}

// Card grid with category tabs, active toggles and add/edit/delete, shared by Products and My Services
export default function ListingManager({ kind }: { kind: ListingKind }) {
  const noun = nouns[kind];
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const query = useApi<ListingsData<Listing>>(
    kind === "service" ? "/contractor/services" : "/contractor/products",
    { category_id: categoryId },
  );
  // The add/edit dialog offers every category of this kind, not just ones in use
  const categories = useApi<CategoriesData>("/categories", { type: kind });
  // null = closed, "new" = adding, otherwise the listing being edited
  const [editing, setEditing] = useState<Listing | "new" | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const closeDialog = useCallback(() => setEditing(null), []);

  const run = async (id: number, task: () => Promise<unknown>) => {
    setBusyId(id);
    setError("");
    try {
      await task();
      query.refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  const usage = query.data?.usage;
  const canAdd = usage?.can_add_more ?? false;

  return (
    <>
      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label={`Filter ${noun.toLowerCase()}s`}
            className="flex flex-wrap gap-1.5"
          >
            {[
              { id: null, name: "All", count: undefined },
              ...(query.data?.categories ?? []),
            ].map((tab) => (
              <button
                key={tab.id ?? "all"}
                type="button"
                role="tab"
                aria-selected={categoryId === tab.id}
                aria-controls="listing-grid"
                onClick={() => setCategoryId(tab.id)}
                className={cn(
                  "flex h-7 items-center gap-1 rounded-full px-3.5 text-xs leading-4 font-semibold transition-colors",
                  categoryId === tab.id
                    ? "bg-[#262262] text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]",
                )}
              >
                {tab.name}
                {tab.count !== undefined && (
                  <span className="opacity-60">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!canAdd || !categories.data}
            onClick={() => setEditing("new")}
            className="flex items-center gap-2 rounded-lg bg-[#262262] px-4 py-2 text-sm leading-5 font-semibold text-white hover:bg-[#211d53] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus aria-hidden className="size-4" />
            Add {noun}
          </button>
        </div>

        {usage && (
          <p className="flex flex-wrap items-center gap-3 rounded-xl bg-[linear-gradient(178deg,#f0f7ff_0%,#eef2ff_100%)] px-4 py-3 text-sm leading-5 text-[#262262]">
            {usage.can_add_more ? (
              <CircleCheck aria-hidden className="size-5 shrink-0" />
            ) : (
              <CircleAlert
                aria-hidden
                className="size-5 shrink-0 text-[#c41e3a]"
              />
            )}
            <strong className="flex-1">{usageText(usage, kind)}</strong>
            {!usage.can_add_more && (
              <Link
                to="/contractor/dashboard/subscription"
                className="text-xs font-semibold text-[#c41e3a] hover:underline"
              >
                Upgrade to add more
              </Link>
            )}
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-[#c41e3a]">
            {error}
          </p>
        )}

        <div id="listing-grid" role="tabpanel">
          <QueryBoundary query={query}>
            {({ items }) =>
              items.length > 0 ? (
                <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((listing) => (
                    <li
                      key={listing.id}
                      className="flex flex-col rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)]"
                    >
                      {"image" in listing && (
                        <ProductImage
                          src={listing.image}
                          alt={listing.name}
                          className="mb-3 h-32 w-full rounded-lg"
                        />
                      )}
                      <div className="flex items-start justify-between gap-3 pb-3">
                        <div className="min-w-0">
                          <h2 className="text-sm leading-5 font-bold text-[#0f172a]">
                            {listing.name}
                          </h2>
                          <p className="pt-0.5 text-xs leading-4 text-[#64748b]">
                            {listing.category?.name}
                            {"stock_quantity" in listing &&
                              ` · ${listing.in_stock ? `${listing.stock_quantity} in stock` : "Out of stock"}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={listing.is_active}
                          aria-label={`${listing.name} listing`}
                          disabled={busyId === listing.id}
                          onClick={() =>
                            void run(listing.id, () =>
                              catalogApi.toggleListing(kind, listing.id),
                            )
                          }
                          className="flex shrink-0 items-center gap-1.5 disabled:opacity-60"
                        >
                          <span
                            className={cn(
                              "relative h-5 w-9 rounded-full bg-[#e2e8f0] transition-colors",
                              { "bg-[#1b3a6b]": listing.is_active },
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-0.75 left-0.75 size-3.5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)] transition-transform",
                                { "translate-x-4": listing.is_active },
                              )}
                            />
                          </span>
                          <span
                            className={cn(
                              "w-10 text-left text-xs leading-4",
                              listing.is_active
                                ? "text-[#10b981]"
                                : "text-[#94a3b8]",
                            )}
                          >
                            {listing.is_active ? "Active" : "Off"}
                          </span>
                        </button>
                      </div>
                      <p className="max-w-68.25 flex-1 pb-3 text-xs leading-[19.5px] text-[#64748b]">
                        {listing.description}
                      </p>
                      <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-3">
                        <p className="text-sm leading-5 font-semibold text-[#1b3a6b]">
                          {listing.price_display}
                        </p>
                        <div className="flex gap-2 text-xs leading-4 font-medium">
                          <button
                            type="button"
                            disabled={!categories.data}
                            onClick={() => setEditing(listing)}
                            className="rounded-lg px-2.5 py-1.5 text-[#374151] hover:bg-[#f1f5f9]"
                          >
                            Edit<span className="sr-only"> {listing.name}</span>
                          </button>
                          <button
                            type="button"
                            disabled={busyId === listing.id}
                            onClick={() => {
                              if (window.confirm(`Delete ${listing.name}?`))
                                void run(listing.id, () =>
                                  catalogApi.deleteListing(kind, listing.id),
                                );
                            }}
                            className="rounded-lg px-2.5 py-1.5 text-[#c41e3a] hover:bg-[#fef2f2]"
                          >
                            Delete
                            <span className="sr-only"> {listing.name}</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl border border-[#e2e8f0] bg-white p-10 text-center text-sm text-[#64748b]">
                  {categoryId === null
                    ? `No ${noun.toLowerCase()}s yet.`
                    : `No ${noun.toLowerCase()}s in this category.`}
                </p>
              )
            }
          </QueryBoundary>
        </div>
      </div>

      {editing && categories.data && (
        <ListingDialog
          kind={kind}
          categories={categories.data.categories}
          listing={editing === "new" ? null : editing}
          onClose={closeDialog}
          onSaved={() => {
            setEditing(null);
            query.refetch();
          }}
        />
      )}
    </>
  );
}
