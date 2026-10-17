import Container from "@/components/shared/container";
import Headline from "@/components/shared/headline";
import Section from "@/components/shared/section";
import { simpleAndFast } from "../data/simple-and-fast";
import SimpleAndFastGrid from "./simple-and-fast-grid";

export default function SimpleAndFast() {
  return (
    <Section className="bg-muted">
      <Container>
        <Headline
          badgeText={simpleAndFast.badge}
          headlines={simpleAndFast.headlines}
        />
        <SimpleAndFastGrid />
      </Container>
    </Section>
  );
}
