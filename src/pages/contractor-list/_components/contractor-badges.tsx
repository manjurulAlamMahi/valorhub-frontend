import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Award, CircleCheck, Shield } from "lucide-react";
import { contractorList } from "../data/contractor-list";
import type { ContractorBadge } from "@/services/public";

const badgeIcons: Record<ContractorBadge, typeof Award> = {
  elite: Award,
  verified: CircleCheck,
  veteran: Shield,
};

const badgeClassName =
  "h-5.5 gap-1 rounded-full px-2.25 py-0.75 text-xs leading-4 font-semibold [&>svg]:size-2.5!";

type ContractorBadgesProps = {
  badges: ContractorBadge[];
  availableToday?: boolean;
  className?: string;
};

export default function ContractorBadges({
  badges,
  availableToday = false,
  className,
}: ContractorBadgesProps) {
  if (badges.length === 0 && !availableToday) return null;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((type) => {
        const badge = contractorList.badges[type];
        const BadgeIcon = badgeIcons[type];

        return (
          <li key={type}>
            <Badge
              variant="outline"
              className={cn(badgeClassName, badge.className)}
            >
              <BadgeIcon aria-hidden />
              {badge.label}
            </Badge>
          </li>
        );
      })}

      {availableToday && (
        <li>
          <Badge
            variant="outline"
            className={cn(
              badgeClassName,
              "border-[#a4f4cf] bg-[#ecfdf5] text-[#007a55]",
            )}
          >
            <span aria-hidden className="size-1.5 rounded-full bg-[#00bc7d]" />
            {contractorList.availableToday}
          </Badge>
        </li>
      )}
    </ul>
  );
}
