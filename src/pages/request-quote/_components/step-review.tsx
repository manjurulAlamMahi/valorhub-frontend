import { requestQuote, type QuoteFormValues } from "../data/request-quote";

const { review, service, budgetTimeline } = requestQuote;

const labelFor = (options: { key: string; label: string }[], key: string) =>
  options.find((option) => option.key === key)?.label ?? "Not specified";

type StepReviewProps = {
  values: QuoteFormValues;
  recipient?: string;
};

export default function StepReview({ values, recipient }: StepReviewProps) {
  const location = [
    values.street_address.trim(),
    values.city.trim(),
    `${values.state.trim()} ${values.zip_code.trim()}`.trim(),
  ]
    .filter(Boolean)
    .join(", ");

  const rows = [
    {
      label: review.rows.service,
      value: labelFor(service.options, values.service),
    },
    { label: review.rows.description, value: values.description.trim() },
    {
      label: review.rows.budget,
      value: labelFor(budgetTimeline.budgets, values.budget),
    },
    {
      label: review.rows.timeline,
      value: labelFor(budgetTimeline.timelines, values.timeline),
    },
    { label: review.rows.location, value: location },
  ];

  return (
    <div className="space-y-5">
      <dl>
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-6 border-b border-[#f7f8fa] py-3 text-sm leading-5 last:border-none"
          >
            <dt className="w-40 shrink-0 text-[#64748b]">{row.label}</dt>
            <dd className="min-w-0 truncate text-right font-medium text-[#111827]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {values.photos.length > 0 && (
        <p className="text-xs text-[#64748b]">
          {values.photos.length} photo{values.photos.length > 1 ? "s" : ""}{" "}
          attached
        </p>
      )}

      <p className="rounded-xl bg-[#eef0f8] p-4 text-xs leading-4 text-[#64748b]">
        <strong className="text-secondary-foreground font-bold">
          Sending to {recipient ?? review.nearbyRecipient}.
        </strong>{" "}
        {review.recipientNote}
      </p>
    </div>
  );
}
