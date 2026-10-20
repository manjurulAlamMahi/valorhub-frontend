import type { WizardConfig } from "@/services/quotes";
import { Box } from "lucide-react";
import { requestQuote, serviceIcons } from "../data/request-quote";
import OptionTile from "./option-tile";

type StepServiceProps = {
  options: WizardConfig["service_options"];
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function StepService({
  options,
  value,
  error,
  onChange,
}: StepServiceProps) {
  return (
    <fieldset>
      <legend className="sr-only">{requestQuote.service.title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map(({ key, name }) => {
          const Icon = serviceIcons[key] ?? Box;

          return (
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
              {name}
            </OptionTile>
          );
        })}
      </div>
      {error && <p className="pt-3 text-sm text-[#c92032]">{error}</p>}
    </fieldset>
  );
}
