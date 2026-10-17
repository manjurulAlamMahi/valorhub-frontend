import Container from "@/components/shared/container";
import Headline from "@/components/shared/headline";
import Section from "@/components/shared/section";
import { whyChooseUs } from "../data/why-choose-us";
import WhyChooseUsGrid from "./why-choose-us-grid";

export default function WhyChooseUs() {
  return (
    <Section>
      <Container>
        <Headline
          badgeText={whyChooseUs.badge}
          headlines={whyChooseUs.headlines}
        />
        <WhyChooseUsGrid />
      </Container>
    </Section>
  );
}
