import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { givingBack } from "../data/giving-back";

const { initiatives } = givingBack;

export default function Initiatives() {
  return (
    <Section className="bg-input">
      <Container className="space-y-6 py-12! xl:max-w-312">
        <h2 className="text-[22px] leading-[normal] font-bold text-[#1e293b]">
          {initiatives.title}
        </h2>

        <ul className="grid gap-5 md:grid-cols-3">
          {initiatives.items.map(({ id, icon: Icon, title, description }) => (
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
          ))}
        </ul>
      </Container>
    </Section>
  );
}
