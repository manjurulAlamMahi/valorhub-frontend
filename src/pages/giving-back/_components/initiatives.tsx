import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import type { GivingBackData } from "@/services/public";
import { Heart } from "lucide-react";
import { givingBack, initiativeIcons } from "../data/giving-back";

export default function Initiatives({
  initiatives,
}: {
  initiatives: GivingBackData["initiatives"];
}) {
  return (
    <Section className="bg-input">
      <Container className="space-y-6 py-12! xl:max-w-312">
        <h2 className="text-[22px] leading-[normal] font-bold text-[#1e293b]">
          {givingBack.initiativesTitle}
        </h2>

        <ul className="grid gap-5 md:grid-cols-3">
          {initiatives.map(({ id, icon, title, description }) => {
            const Icon = initiativeIcons[icon] ?? Heart;

            return (
              <li
                key={id}
                className="space-y-2.5 rounded-[14px] border border-[#e6eaf2] bg-white p-6 leading-[normal]"
              >
                <span className="grid size-10 place-content-center rounded-full bg-[#c92032]">
                  <Icon aria-hidden className="size-6 text-white" />
                </span>
                <h3 className="text-base font-bold text-[#1e293b]">{title}</h3>
                <p className="text-xs text-[#64748b]">{description}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
