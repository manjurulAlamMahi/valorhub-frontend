import { requestQuote } from "../data/request-quote";
import OptionTile from "./option-tile";

type StepServiceProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function StepService({
  value,
  error,
  onChange,
}: StepServiceProps) {
  return (
    <fieldset>
      <legend className="sr-only">{requestQuote.service.title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {requestQuote.service.options.map(({ key, label, icon: Icon }) => (
          <OptionTile
            key={key}
            name="service"
            value={key}
            checked={value === key}
            onSelect={onChange}
            className="h-22 flex-col justify-center gap-2.5 p-4.5 text-[#111827]"
          >
            <Icon
              aria-hidden
              className="size-6 shrink-0 text-[#64748b]"
              strokeWidth={1.75}
            />
            {label}
          </OptionTile>
        ))}
      </div>
      {error && <p className="pt-3 text-sm text-[#c92032]">{error}</p>}
    </fieldset>
  );
}
