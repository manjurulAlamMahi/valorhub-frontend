import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import type { GivingBackData } from "@/services/public";

export default function VeteranStory({
  story,
}: {
  story: GivingBackData["testimonial"];
}) {
  return (
    <Section className="bg-white">
      <Container className="py-10!">
        <figure className="mx-auto max-w-190 space-y-4 text-center leading-[normal]">
          <blockquote className="text-lg font-bold text-[#1e293b] md:text-xl">
            "{story.quote}"
          </blockquote>
          <figcaption className="text-sm text-[#64748b]">
            — {story.author}, {story.author_title}
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
}
