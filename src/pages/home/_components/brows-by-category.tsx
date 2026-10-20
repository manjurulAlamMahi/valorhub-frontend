import Container from "@/components/shared/container";
import Headline from "@/components/shared/headline";
import Section from "@/components/shared/section";
import type { ComponentProps } from "react";
import { findByService } from "../data/find-by-service";
import BrowByCategoryGrid from "./brows-by-category-grid";

export default function BrowsByCategory(
  props: ComponentProps<typeof BrowByCategoryGrid>,
) {
  return (
    <Section className="bg-muted">
      <Container>
        <Headline
          badgeText={findByService.badge}
          headlines={findByService.headlines}
        />
        <BrowByCategoryGrid {...props} />
      </Container>
    </Section>
  );
}
