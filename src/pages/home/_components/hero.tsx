import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import type { HeroSpotlight } from "@/services/public";
import { Link } from "react-router";
import { hero } from "../data/hero";
import HeroHeadline from "./hero-headline";

export default function Hero({
  spotlight,
}: {
  spotlight?: HeroSpotlight | null;
}) {
  return (
    <Section className="relative overflow-hidden bg-[url('/images/home/hero.png')]">
      <Container className="py-0! md:py-0! lg:py-0!">
        <div className="flex items-start justify-between gap-4 md:h-47.75">
          <div className="space-y-4 pt-4.5 pb-7">
            <HeroHeadline spotlight={spotlight} />
          </div>

          <img
            src={hero.image}
            alt=""
            className="mt-4.5 h-53.5 w-49 shrink-0 object-cover object-[58%_0] max-md:hidden lg:mr-7.5"
          />
        </div>
      </Container>
      {spotlight && (
        <Link
          to={`/contractors/${spotlight.id}`}
          aria-label={`View ${spotlight.business_name}`}
          className="absolute inset-0"
        />
      )}
    </Section>
  );
}
