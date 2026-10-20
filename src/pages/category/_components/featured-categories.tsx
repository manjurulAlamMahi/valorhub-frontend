import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import BrowByCategoryGrid from "@/pages/home/_components/brows-by-category-grid";
import type { ComponentProps } from "react";
import { featuredCategories } from "../data/featured-categories";

export default function FeaturedCategories(
  props: ComponentProps<typeof BrowByCategoryGrid>,
) {
  return (
    <Section className="bg-white">
      <Container>
        <h2 className="text-card-foreground font-mono text-2xl leading-8 font-bold">
          {featuredCategories.title}
        </h2>
        <BrowByCategoryGrid {...props} />
      </Container>
    </Section>
  );
}
