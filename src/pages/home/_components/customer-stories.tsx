import Container from "@/components/shared/container";
import Headline from "@/components/shared/headline";
import Section from "@/components/shared/section";
import type { Testimonial } from "@/services/public";
import { customerStories } from "../data/customer-stories";
import CustomerStoriesGrid from "./customer-stories-grid";

export default function CustomerStories({
  testimonials,
}: {
  testimonials?: Testimonial[];
}) {
  // Nothing to show until customers leave 4★+ reviews
  if (testimonials?.length === 0) return null;

  return (
    <Section>
      <Container>
        <Headline
          badgeText={customerStories.badge}
          headlines={customerStories.headlines}
        />
        <CustomerStoriesGrid testimonials={testimonials} />
      </Container>
    </Section>
  );
}
