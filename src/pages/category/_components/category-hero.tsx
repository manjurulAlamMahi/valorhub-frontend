import PageHero from "@/components/shared/page-hero";
import CategoryHeroHeadline from "./category-hero-headline";
import CategorySearch from "./category-search";

export default function CategoryHero() {
  return (
    <PageHero>
      <CategoryHeroHeadline />
      <CategorySearch />
    </PageHero>
  );
}
