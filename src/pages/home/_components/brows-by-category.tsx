import Container from "@/components/shared/container";
import Headline from "@/components/shared/headline";
import Section from "@/components/shared/section";
import { findByService } from "../data/find-by-service";
import BrowByCategoryGrid from "./brows-by-category-grid";

export default function BrowsByCategory() {
  return (
    <Section className="bg-muted">
      <Container>
        <Headline
          badgeText={findByService.badge}
          headlines={findByService.headlines}
        />
        <BrowByCategoryGrid />
      </Container>
    </Section>
  );
}
