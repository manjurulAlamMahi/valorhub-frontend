import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import Container from "./container";
import Section from "./section";

interface PageHeroProps {
  className?: string;
}

export default function PageHero({
  children,
  className,
}: PropsWithChildren<PageHeroProps>) {
  return (
    <Section className="relative isolate overflow-hidden bg-[#26225f]">
      <div aria-hidden className="absolute inset-x-0 -top-0.75 bottom-0.5">
        <img
          src="/images/shared/page-hero.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover object-[50%_52%] mix-blend-color-dodge"
        />
        <div className="absolute inset-0 bg-[#26225f] mix-blend-color" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#000_5.93%,rgba(0,0,0,0)_38.13%),linear-gradient(170.27deg,#000_6.85%,rgba(0,0,0,0)_107.86%)]" />
      </div>

      <Container
        className={cn("relative space-y-10 md:py-12 lg:py-12", className)}
      >
        {children}
      </Container>
    </Section>
  );
}
