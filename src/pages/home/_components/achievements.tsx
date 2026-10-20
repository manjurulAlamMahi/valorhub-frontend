import Section from "@/components/shared/section";
import { cn } from "@/lib/utils";
import type { PlatformMetrics } from "@/services/public";
import { achievements } from "../data/achievements";

export default function Achievement({
  metrics,
  className,
}: {
  metrics?: PlatformMetrics;
  className?: string;
}) {
  return (
    <Section>
      <div className={cn("container mx-auto py-10 xl:max-w-300", className)}>
        <div className="grid gap-5 max-lg:px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.key}
              className="flex flex-1 gap-4 border-[#E2E8F0] pr-4 sm:not-last:border-r"
            >
              <div className="grid size-10 place-content-center rounded-[10px] bg-[#EEF0F8]">
                <img
                  src={achievement.icon}
                  alt={achievement.label}
                  className="size-5 object-contain"
                />
              </div>

              <div>
                {metrics ? (
                  <p className="text-secondary-foreground text-xl leading-6 font-extrabold">
                    {metrics[achievement.key]}
                  </p>
                ) : (
                  <span className="my-0.5 block h-5 w-16 animate-pulse rounded bg-[#EEF0F8]" />
                )}
                <h3 className="text-xs leading-4 font-normal text-[#64748B]">
                  {achievement.label}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
