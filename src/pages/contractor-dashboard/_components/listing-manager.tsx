import { cn } from "@/lib/utils";
import { CircleCheck, Plus } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";
import type { Listing } from "../data/listings";
import ListingDialog from "./listing-dialog";

type ListingManagerProps = {
  // Singular label, e.g. "Product" or "Service"
  noun: string;
  categories: readonly string[];
  initialItems: Listing[];
  freeTextPrice?: boolean;
  banner: (count: number) => ReactNode;
};

// Card grid with category tabs, active toggles and add/edit/delete, shared by Products and My Services
export default function ListingManager({
  noun,
  categories,
  initialItems,
  freeTextPrice,
  banner,
}: ListingManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState("All");
  // null = closed, "new" = adding, otherwise the listing being edited
  const [editing, setEditing] = useState<Listing | "new" | null>(null);
  const closeDialog = useCallback(() => setEditing(null), []);

  const visible =
    filter === "All" ? items : items.filter((item) => item.category === filter);

  const update = (id: string, patch: Partial<Listing>) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );

  return (
    <>
      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label={`Filter ${noun.toLowerCase()}s`}
            className="flex flex-wrap gap-1.5"
          >
            {["All", ...categories].map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={filter === value}
                aria-controls="listing-grid"
                onClick={() => setFilter(value)}
                className={cn(
                  "h-7 rounded-full px-3.5 text-xs leading-4 font-semibold transition-colors",
                  filter === value
                    ? "bg-[#262262] text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]",
                )}
              >
                {value}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="flex items-center gap-2 rounded-lg bg-[#262262] px-4 py-2 text-sm leading-5 font-semibold text-white hover:bg-[#211d53]"
          >
            <Plus aria-hidden className="size-4" />
            Add {noun}
          </button>
        </div>

        <p className="flex items-center gap-3 rounded-xl bg-[linear-gradient(178deg,#f0f7ff_0%,#eef2ff_100%)] px-4 py-3 text-sm leading-5 text-[#262262]">
          <CircleCheck aria-hidden className="size-5 shrink-0" />
          <span>{banner(items.length)}</span>
        </p>

        <div id="listing-grid" role="tabpanel">
          {visible.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((listing) => (
                <li
                  key={listing.id}
                  className="flex flex-col rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)]"
                >
                  <div className="flex items-start justify-between gap-3 pb-3">
                    <div className="min-w-0">
                      <h2 className="text-sm leading-5 font-bold text-[#0f172a]">
                        {listing.name}
                      </h2>
                      <p className="pt-0.5 text-xs leading-4 text-[#64748b]">
                        {listing.category}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={listing.active}
                      aria-label={`${listing.name} listing`}
                      onClick={() =>
                        update(listing.id, { active: !listing.active })
                      }
                      className="flex shrink-0 items-center gap-1.5"
                    >
                      <span
                        className={cn(
                          "relative h-5 w-9 rounded-full bg-[#e2e8f0] transition-colors",
                          {
                            "bg-[#1b3a6b]": listing.active,
                          },
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.75 left-0.75 size-3.5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)] transition-transform",
                            { "translate-x-4": listing.active },
                          )}
                        />
                      </span>
                      <span
                        className={cn(
                          "w-10 text-left text-xs leading-4",
                          listing.active ? "text-[#10b981]" : "text-[#94a3b8]",
                        )}
                      >
                        {listing.active ? "Active" : "Off"}
                      </span>
                    </button>
                  </div>
                  <p className="max-w-68.25 flex-1 pb-3 text-xs leading-[19.5px] text-[#64748b]">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-3">
                    <p className="text-sm leading-5 font-semibold text-[#1b3a6b]">
                      {listing.price}
                    </p>
                    <div className="flex gap-2 text-xs leading-4 font-medium">
                      <button
                        type="button"
                        onClick={() => setEditing(listing)}
                        className="rounded-lg px-2.5 py-1.5 text-[#374151] hover:bg-[#f1f5f9]"
                      >
                        Edit<span className="sr-only"> {listing.name}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete ${listing.name}?`))
                            setItems((prev) =>
                              prev.filter((item) => item.id !== listing.id),
                            );
                        }}
                        className="rounded-lg px-2.5 py-1.5 text-[#c41e3a] hover:bg-[#fef2f2]"
                      >
                        Delete<span className="sr-only"> {listing.name}</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-[#e2e8f0] bg-white p-10 text-center text-sm text-[#64748b]">
              No {filter.toLowerCase()} {noun.toLowerCase()}s yet.
            </p>
          )}
        </div>
      </div>

      {editing && (
        <ListingDialog
          noun={noun}
          categories={categories}
          freeTextPrice={freeTextPrice}
          listing={editing === "new" ? null : editing}
          onClose={closeDialog}
          onSave={(values) => {
            if (editing === "new")
              setItems((prev) => [
                ...prev,
                { ...values, id: crypto.randomUUID(), active: true },
              ]);
            else update(editing.id, values);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}
