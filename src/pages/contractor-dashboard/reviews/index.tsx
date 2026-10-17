import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import { useState, type FormEvent } from "react";
import { starIcon } from "../data/contractor-dashboard";
import { contractorReviews, reviewSummary } from "../data/reviews";

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
  "rounded-lg border border-[#26225f] px-3.5 py-1.5 text-xs leading-[normal] font-semibold text-[#26225f] hover:bg-[#eeedf8]";

export default function Reviews() {
  const [reviews, setReviews] = useState(contractorReviews);
  const [replying, setReplying] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const open = (id: string, current = "") => {
    setReplying(id);
    setDraft(current);
    setError("");
  };

  const submit = (event: FormEvent, id: string) => {
    event.preventDefault();
    const reply = draft.trim();
    if (reply.length < 2) return setError("Write a reply before posting.");
    setReviews((prev) =>
      prev.map((review) => (review.id === id ? { ...review, reply } : review)),
    );
    setReplying(null);
  };

  return (
    <>
      <SEO
        title="Reviews"
        description="Read and reply to your ValorHub customer reviews."
        robots="noindex, nofollow"
      />

      <div className="space-y-5 px-4 py-6 sm:px-6">
        <section
          aria-label="Rating summary"
          className="flex items-center gap-6 rounded-xl border border-[#26225f]/10 bg-white px-5 py-6 sm:gap-10 sm:px-7"
        >
          <p className="text-[40px] leading-[normal] font-bold text-[#26225f]">
            {reviewSummary.average}
          </p>
          <div className="space-y-1">
            <Stars rating={reviewSummary.average} size="md" />
            <p className="text-[13px] text-[#73738c]">
              Based on {reviewSummary.total} reviews
            </p>
          </div>
        </section>

        <ul className="divide-y divide-[#26225f]/8 rounded-xl border border-[#26225f]/10 bg-white">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="space-y-2 px-4 py-4.5 leading-[normal] sm:px-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-[#26225f]">
                    {review.name}
                  </p>
                  <p className="text-xs text-[#73738c]">{review.project}</p>
                </div>
                <p className="shrink-0 text-xs text-[#73738c]">{review.date}</p>
              </div>
              <Stars rating={review.rating} size="sm" />
              <p className="text-[13px] text-[#26225f]/85">{review.text}</p>

              {replying === review.id ? (
                <form
                  noValidate
                  onSubmit={(event) => submit(event, review.id)}
                  className="space-y-2"
                >
                  <label htmlFor={`reply-${review.id}`} className="sr-only">
                    Reply to {review.name}
                  </label>
                  <textarea
                    id={`reply-${review.id}`}
                    rows={3}
                    autoFocus
                    maxLength={1000}
                    value={draft}
                    onChange={(event) => {
                      setDraft(event.target.value);
                      setError("");
                    }}
                    placeholder={`Write a public reply to ${review.name.split(" ")[0]}...`}
                    aria-invalid={Boolean(error)}
                    className="w-full resize-y rounded-lg border border-[#26225f]/15 bg-[#f7f7fa] px-3.5 py-2.5 text-[13px] text-[#26225f] outline-none placeholder:text-[#26225f]/40 focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c41e3a]"
                  />
                  {error && <p className="text-xs text-[#c41e3a]">{error}</p>}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-[#c41e3a] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#a51a31]"
                    >
                      Post reply
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
              ) : review.reply ? (
                <div className="space-y-1 rounded-lg bg-[#f5f5fa] px-3.5 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold text-[#73738c]">
                      Your reply
                    </p>
                    <button
                      type="button"
                      onClick={() => open(review.id, review.reply)}
                      className="text-[11px] font-semibold text-[#26225f] hover:underline"
                    >
                      Edit
                      <span className="sr-only"> reply to {review.name}</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#26225f]">{review.reply}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => open(review.id)}
                  className={outlineButton}
                >
                  Reply<span className="sr-only"> to {review.name}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
