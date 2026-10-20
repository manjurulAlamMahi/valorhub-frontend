import UserAvatar from "@/components/shared/user-avatar";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { customerApi, type CustomerReviews } from "@/services/customer";
import { useState } from "react";
import { ActionButton } from "../_components/action-button";
import DashboardPage from "../_components/dashboard-page";
import QueryBoundary from "@/components/shared/query-boundary";
import ReviewForm from "./review-form";

export default function Reviews() {
  const query = useApi<CustomerReviews>("/customer/reviews");
  const [writing, setWriting] = useState<number | null>(null);

  // Reviews can't be edited after posting (the API has no update endpoint)
  const save = (projectId: number) => async (rating: number, text: string) => {
    await customerApi.createReview({
      project_id: projectId,
      rating,
      comment: text,
    });
    setWriting(null);
    query.refetch();
  };

  return (
    <DashboardPage
      title="Reviews"
      description="Leave feedback for completed jobs, or view your past reviews."
    >
      <QueryBoundary query={query}>
        {({ awaiting_feedback, past_reviews }) =>
          awaiting_feedback.length + past_reviews.length === 0 ? (
            <p className="rounded-xl border border-[#e6eaf2] bg-white p-10 text-center text-sm text-[#64748b]">
              Once a job is completed you can review the contractor here.
            </p>
          ) : (
            <ul className="space-y-3.5 leading-[normal]">
              {awaiting_feedback.map((job) => (
                <li
                  key={job.project_id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-[#c92032] bg-white p-4.5"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-[15px] font-medium text-[#1e293b]">
                      {job.business?.name ?? "Contractor"}
                    </p>
                    <p className="text-[13px] text-[#64748b]">
                      {job.project_title} · Completed {job.completed_at}
                    </p>
                  </div>
                  {writing === job.project_id ? (
                    <ReviewForm
                      onCancel={() => setWriting(null)}
                      onSave={save(job.project_id)}
                    />
                  ) : (
                    <ActionButton onClick={() => setWriting(job.project_id)}>
                      Write a review
                    </ActionButton>
                  )}
                </li>
              ))}

              {past_reviews.map((review) => (
                <li
                  key={review.id}
                  className="space-y-2 rounded-xl border border-[#e6eaf2] bg-white p-4.5"
                >
                  <div className="flex items-center gap-4">
                    <UserAvatar
                      name={review.business?.name ?? "Contractor"}
                      src={review.business?.avatar}
                      className="size-10"
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-[15px] font-medium text-[#1e293b]">
                        {review.business?.name}
                        {review.project && (
                          <span className="font-normal text-[#64748b]">
                            {" "}
                            · {review.project.title}
                          </span>
                        )}
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
                              "opacity-20 grayscale": index >= review.rating,
                            })}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#64748b]">{review.date}</p>
                  </div>

                  {review.comment && (
                    <p className="text-[13px] text-[#64748b]">
                      {review.comment}
                    </p>
                  )}
                  {review.contractor_reply && (
                    <div className="bg-input space-y-1 rounded-lg p-3">
                      <p className="text-xs font-bold text-[#1e293b]">
                        Reply from {review.business?.name}
                        {review.replied_at && (
                          <span className="font-normal text-[#64748b]">
                            {" "}
                            · {review.replied_at}
                          </span>
                        )}
                      </p>
                      <p className="text-[13px] text-[#64748b]">
                        {review.contractor_reply}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )
        }
      </QueryBoundary>
    </DashboardPage>
  );
}
