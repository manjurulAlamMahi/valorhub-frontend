import { requestQuote } from "../data/request-quote";
import OptionTile from "./option-tile";

const { budgetTimeline: copy } = requestQuote;

type StepBudgetTimelineProps = {
  budgets: { key: string; label: string }[];
  timelines: { key: string; label: string }[];
  budget: string;
  timeline: string;
  errors: { budget?: string; timeline?: string };
  onBudgetChange: (value: string) => void;
  onTimelineChange: (value: string) => void;
};

function OptionGroup({
  name,
  label,
  options,
  value,
  error,
  onChange,
}: {
  name: string;
  label: string;
  options: { key: string; label: string }[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="pb-2 text-sm leading-5 font-semibold text-[#111827]">
        {label}
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option) => (
          <OptionTile
            key={option.key}
            name={name}
            value={option.key}
            checked={value === option.key}
            onSelect={onChange}
            className="h-11.5 items-center justify-center p-3.5 text-center"
          >
            {option.label}
          </OptionTile>
        ))}
      </div>
      {error && <p className="text-sm text-[#c92032]">{error}</p>}
    </fieldset>
  );
}

export default function StepBudgetTimeline({
  budgets,
  timelines,
  budget,
  timeline,
  errors,
  onBudgetChange,
  onTimelineChange,
}: StepBudgetTimelineProps) {
  return (
    <div className="space-y-5">
      <OptionGroup
        name="budget"
        label={copy.budgetLabel}
        options={budgets}
        value={budget}
        error={errors.budget}
        onChange={onBudgetChange}
      />
      <OptionGroup
        name="timeline"
        label={copy.timelineLabel}
        options={timelines}
        value={timeline}
        error={errors.timeline}
        onChange={onTimelineChange}
      />
    </div>
  );
}
