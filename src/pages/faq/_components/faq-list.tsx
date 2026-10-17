import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { faq } from "../data/faq";

export default function FaqList() {
  const [tab, setTab] = useState("all");
  const items =
    tab === "all"
      ? faq.items
      : faq.items.filter((item) => item.category === tab);

  return (
    <Section className="bg-input">
      <Container className="space-y-6 pt-10! pb-10!">
        <div
          role="tablist"
          aria-label="FAQ categories"
          className="flex flex-wrap justify-center gap-2"
        >
          {faq.tabs.map((item) => {
            const isActive = item.value === tab;

            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(item.value)}
                className={cn(
                  "rounded-full border px-4.5 py-2.25 text-[13px] leading-[normal] font-medium transition-colors",
                  isActive
                    ? "bg-secondary-foreground border-transparent text-white"
                    : "border-[#e6eaf2] bg-white text-[#64748b] hover:text-[#1e293b]",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <Accordion
          key={tab}
          defaultValue={[items[0]?.id]}
          className="mx-auto max-w-225 space-y-3"
        >
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="group rounded-xl border border-[#e6eaf2] bg-white"
            >
              <AccordionTrigger className="p-5 text-base leading-[normal] font-bold text-[#1e293b] group-data-open:pb-2.5">
                {item.question}
                <Plus
                  aria-hidden
                  strokeWidth={2.5}
                  className="size-4 shrink-0 text-[#64748b] group-data-open:hidden"
                />
                <Minus
                  aria-hidden
                  strokeWidth={2.5}
                  className="hidden size-4 shrink-0 text-[#64748b] group-data-open:block"
                />
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 text-sm leading-5 text-[#64748b]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}
