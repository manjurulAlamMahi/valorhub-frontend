import Container from "@/components/shared/container";
import Headline from "@/components/shared/headline";
import Section from "@/components/shared/section";
import { customerStories } from "../data/customer-stories";
import CustomerStoriesGrid from "./customer-stories-grid";

export default function CustomerStories() {
  return (
    <Section>
      <Container>
        <Headline
          badgeText={customerStories.badge}
          headlines={customerStories.headlines}
        />
        <CustomerStoriesGrid />
      </Container>
    </Section>
  );
}
