import PageHero from "@/components/shared/page-hero";
import CategoryHeroHeadline from "./category-hero-headline";
import CategorySearch from "./category-search";

export default function CategoryHero({ popular }: { popular?: string[] }) {
  return (
    <PageHero>
      <CategoryHeroHeadline />
      <CategorySearch popular={popular} />
    </PageHero>
  );
}
