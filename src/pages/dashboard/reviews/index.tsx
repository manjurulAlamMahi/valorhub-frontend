import { cn } from "@/lib/utils";
import { useState } from "react";
import { ActionButton } from "../_components/action-button";
import DashboardPage from "../_components/dashboard-page";
import { useDashboard } from "../data/dashboard-store";
import ReviewForm from "./review-form";

export default function Reviews() {
  const { state, dispatch } = useDashboard();
  const [editing, setEditing] = useState<string | null>(null);

  const pending = state.reviews.filter((review) => !review.rating);
  const written = state.reviews.filter((review) => review.rating);
  const save = (id: string) => (rating: number, text: string) => {
    dispatch({ type: "saveReview", id, rating, text });
    setEditing(null);
  };

  return (
    <DashboardPage
      title="Reviews"
      description="Leave feedback for completed jobs, or view your past reviews."
    >
      <ul className="space-y-3.5 leading-[normal]">
        {pending.map((review) => (
          <li
            key={review.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-[#c92032] bg-white p-4.5"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[15px] font-medium text-[#1e293b]">
                {review.contractor}
              </p>
              <p className="text-[13px] text-[#64748b]">
                {review.job} · Completed {review.completedAt}
              </p>
            </div>
            {editing === review.id ? (
              <ReviewForm
                onCancel={() => setEditing(null)}
                onSave={save(review.id)}
              />
            ) : (
              <ActionButton onClick={() => setEditing(review.id)}>
                Write a review
              </ActionButton>
            )}
          </li>
        ))}

        {written.map((review) => (
          <li
            key={review.id}
            className="space-y-2 rounded-xl border border-[#e6eaf2] bg-white p-4.5"
          >
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-[15px] font-medium text-[#1e293b]">
                  {review.contractor}
                </p>
                <div
                  className="flex gap-1"
                  role="img"
                  aria-label={`Rated ${review.rating} out of 5`}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <img
                      key={index}
                      src="/svgs/star-fill.svg"
                      alt=""
                      className={cn("size-[14.333px] object-contain", {
                        "opacity-20 grayscale": index >= (review.rating ?? 0),
                      })}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#64748b]">{review.reviewedAt}</p>
            </div>

            {editing === review.id ? (
              <ReviewForm
                initialRating={review.rating}
                initialText={review.text}
                onCancel={() => setEditing(null)}
                onSave={save(review.id)}
              />
            ) : (
              <>
                <p className="text-[13px] text-[#64748b]">{review.text}</p>
                <ActionButton
                  variant="outline"
                  onClick={() => setEditing(review.id)}
                >
                  Edit review
                </ActionButton>
              </>
            )}
          </li>
        ))}
      </ul>
    </DashboardPage>
  );
}
