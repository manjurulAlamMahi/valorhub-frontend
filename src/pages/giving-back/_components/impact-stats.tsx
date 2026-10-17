import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { givingBack } from "../data/giving-back";

export default function ImpactStats() {
  return (
    <Section className="bg-white">
      <Container className="py-8! xl:max-w-312">
        <dl className="grid grid-cols-2 gap-6 text-center leading-[normal] lg:grid-cols-4">
          {givingBack.stats.map((stat) => (
            <div key={stat.id} className="flex flex-col-reverse gap-1">
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
