import Container from "@/components/shared/container";
import { EmptyState, ErrorState } from "@/components/shared/query-state";
import Section from "@/components/shared/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ApiQuery } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import type { FaqData } from "@/services/public";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { faq } from "../data/faq";

export default function FaqList({ query }: { query: ApiQuery<FaqData> }) {
  const { data, error, refetch } = query;
  const [tab, setTab] = useState("all");

  // All FAQs load once; tabs filter locally so switching is instant
  const items =
    tab === "all"
      ? (data?.items ?? [])
      : (data?.items.filter((item) => item.category === tab) ?? []);

  return (
    <Section className="bg-input">
      <Container className="space-y-6 pt-10! pb-10!">
        {data && (
          <div
            role="tablist"
            aria-label="FAQ categories"
            className="flex flex-wrap justify-center gap-2"
          >
            {data.filter_tabs.map((item) => {
              const isActive = item.key === tab;

              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setTab(item.key)}
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
        )}

        {!data && error ? (
          <ErrorState
            error={error}
            onRetry={refetch}
            className="mx-auto max-w-225"
          />
        ) : !data ? (
          <div className="mx-auto max-w-225 space-y-3">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                aria-hidden
                className="h-16 animate-pulse rounded-xl bg-white"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState className="mx-auto max-w-225">{faq.empty}</EmptyState>
        ) : (
          <Accordion
            key={tab}
            defaultValue={[items[0].id]}
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
        )}
      </Container>
    </Section>
  );
}
