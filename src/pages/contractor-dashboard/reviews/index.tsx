import { SEO } from "@/components/seo/SEO";
import Pagination from "@/components/shared/pagination";
import QueryBoundary from "@/components/shared/query-boundary";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { contractorApi, type ReviewsData } from "@/services/contractor";
import { Award } from "lucide-react";
import { useState, type FormEvent } from "react";
import { starIcon } from "../data/contractor-dashboard";

function Stars({ rating, size }: { rating: number; size: "sm" | "md" }) {
  return (
    <div
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className="flex gap-0.75"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <img
          key={index}
          src={starIcon}
          alt=""
          className={cn(
            "object-cover",
            size === "md" ? "size-4.5" : "size-3.75",
            {
              "opacity-20 grayscale": index >= Math.round(rating),
            },
          )}
        />
      ))}
    </div>
  );
}

const outlineButton =
  "rounded-lg border border-[#26225f] px-3.5 py-1.5 text-xs leading-[normal] font-semibold text-[#26225f] hover:bg-[#eeedf8] disabled:opacity-60";

export default function Reviews() {
  const [page, setPage] = useState(1);
  const query = useApi<ReviewsData>("/contractor/reviews", { page });
  const [replying, setReplying] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const open = (id: number, current = "") => {
    setReplying(id);
    setDraft(current);
    setError("");
  };

  const submit = async (event: FormEvent, id: number) => {
    event.preventDefault();
    const reply = draft.trim();
    if (reply.length < 2) return setError("Write a reply before posting.");
    setBusyId(id);
    try {
      // Posting again replaces the existing reply
      await contractorApi.replyToReview(id, reply);
      setReplying(null);
      query.refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not post reply.");
    } finally {
      setBusyId(null);
    }
  };

  const toggleFeatured = async (id: number) => {
    setBusyId(id);
    setError("");
    try {
      await contractorApi.toggleFeatured(id);
      query.refetch();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not update review.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <SEO
        title="Reviews"
        description="Read and reply to your ValorHub customer reviews."
        robots="noindex, nofollow"
      />

      <div className="space-y-5 px-4 py-6 sm:px-6">
        <QueryBoundary query={query}>
          {({ rating_summary, items, pagination }) => (
            <>
              <section
                aria-label="Rating summary"
                className="flex items-center gap-6 rounded-xl border border-[#26225f]/10 bg-white px-5 py-6 sm:gap-10 sm:px-7"
              >
                <p className="text-[40px] leading-[normal] font-bold text-[#26225f]">
                  {rating_summary.total_reviews
                    ? rating_summary.average_rating.toFixed(1)
                    : "—"}
                </p>
                <div className="space-y-1">
                  <Stars rating={rating_summary.average_rating} size="md" />
                  <p className="text-[13px] text-[#73738c]">
                    Based on {rating_summary.total_reviews} review
                    {rating_summary.total_reviews === 1 ? "" : "s"}
                  </p>
                </div>
              </section>

              {items.length === 0 ? (
                <p className="rounded-xl border border-[#26225f]/10 bg-white p-10 text-center text-sm text-[#73738c]">
                  No reviews yet. Customers can review you once a job is
                  completed.
                </p>
              ) : (
                <ul className="divide-y divide-[#26225f]/8 rounded-xl border border-[#26225f]/10 bg-white">
                  {items.map((review) => (
                    <li
                      key={review.id}
                      className="space-y-2 px-4 py-4.5 leading-[normal] sm:px-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-[#26225f]">
                            {review.customer.name}
                          </p>
                          {review.project && (
                            <p className="text-xs text-[#73738c]">
                              {review.project.title}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <button
                            type="button"
                            aria-pressed={review.is_featured}
                            disabled={busyId === review.id}
                            onClick={() => void toggleFeatured(review.id)}
                            title="Featured reviews are highlighted on your profile"
                            className={cn(
                              "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold disabled:opacity-60",
                              review.is_featured
                                ? "border-[#fee685] bg-[#fef3c6] text-[#bb4d00]"
                                : "border-[#26225f]/15 text-[#73738c] hover:bg-[#f5f5fa]",
                            )}
                          >
                            <Award aria-hidden className="size-3" />
                            {review.is_featured ? "Featured" : "Feature"}
                          </button>
                          <p className="text-xs text-[#73738c]">
                            {review.date_formatted}
                          </p>
                        </div>
                      </div>
                      <Stars rating={review.rating} size="sm" />
                      {review.comment && (
                        <p className="text-[13px] text-[#26225f]/85">
                          {review.comment}
                        </p>
                      )}

                      {replying === review.id ? (
                        <form
                          noValidate
                          onSubmit={(event) => void submit(event, review.id)}
                          className="space-y-2"
                        >
                          <label
                            htmlFor={`reply-${review.id}`}
                            className="sr-only"
                          >
                            Reply to {review.customer.name}
                          </label>
                          <textarea
                            id={`reply-${review.id}`}
                            rows={3}
                            autoFocus
                            maxLength={2000}
                            value={draft}
                            onChange={(event) => {
                              setDraft(event.target.value);
                              setError("");
                            }}
                            placeholder={`Write a public reply to ${review.customer.name.split(" ")[0]}...`}
                            aria-invalid={Boolean(error)}
                            className="w-full resize-y rounded-lg border border-[#26225f]/15 bg-[#f7f7fa] px-3.5 py-2.5 text-[13px] text-[#26225f] outline-none placeholder:text-[#26225f]/40 focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c41e3a]"
                          />
                          {error && (
                            <p className="text-xs text-[#c41e3a]">{error}</p>
                          )}
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={busyId === review.id}
                              className="rounded-lg bg-[#c41e3a] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#a51a31] disabled:opacity-60"
                            >
                              {busyId === review.id ? "Posting…" : "Post reply"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setReplying(null)}
                              className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-[#26225f] hover:bg-[#f1f5f9]"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : review.contractor_reply ? (
                        <div className="space-y-1 rounded-lg bg-[#f5f5fa] px-3.5 py-2.5">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-semibold text-[#73738c]">
                              Your reply
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                open(review.id, review.contractor_reply ?? "")
                              }
                              className="text-[11px] font-semibold text-[#26225f] hover:underline"
                            >
                              Edit
                              <span className="sr-only">
                                {" "}
                                reply to {review.customer.name}
                              </span>
                            </button>
                          </div>
                          <p className="text-xs text-[#26225f]">
                            {review.contractor_reply}
                          </p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => open(review.id)}
                          className={outlineButton}
                        >
                          Reply
                          <span className="sr-only">
                            {" "}
                            to {review.customer.name}
                          </span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {error && replying === null && (
                <p role="alert" className="text-sm text-[#c41e3a]">
                  {error}
                </p>
              )}

              <Pagination
                page={pagination.current_page}
                totalPages={pagination.last_page}
                onPageChange={setPage}
              />
            </>
          )}
        </QueryBoundary>
      </div>
    </>
  );
}
