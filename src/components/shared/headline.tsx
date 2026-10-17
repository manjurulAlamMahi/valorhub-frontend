import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

type HeadlineProps = {
  badgeText: string;
  headlines: {
    headline: string;
    type?: string;
  }[];
};

export default function Headline({ badgeText, headlines }: HeadlineProps) {
  return (
    <>
      <Badge
        variant="secondary"
        className="text-secondary-foreground px-3 py-1.75 text-xs leading-4 font-semibold"
      >
        {badgeText}
      </Badge>

      <h2 className="space-x-1 font-mono text-2xl leading-9 font-bold text-black">
        {headlines.map(({ headline, type }, index) => (
          <span
            key={index}
            className={cn({
              "text-primary": type === "primary",
            })}
          >
            {headline}
          </span>
        ))}
      </h2>
    </>
  );
}
