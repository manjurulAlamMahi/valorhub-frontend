import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import type { GivingBackData } from "@/services/public";

export default function ImpactStats({
  stats,
}: {
  stats: GivingBackData["impact_metrics"];
}) {
  return (
    <Section className="bg-white">
      <Container className="py-8! xl:max-w-312">
        <dl className="grid grid-cols-2 gap-6 text-center leading-[normal] lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.key} className="flex flex-col-reverse gap-1">
              <dt className="text-[13px] text-[#64748b]">{stat.label}</dt>
              <dd className="text-secondary-foreground text-[26px] font-bold">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
