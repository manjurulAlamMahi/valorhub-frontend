import Breadcrumb from "@/components/shared/breadcrumb";
import PageHero from "@/components/shared/page-hero";
import CategorySearch from "@/pages/category/_components/category-search";
import { contractorList } from "../data/contractor-list";
import ContractorListStats from "./contractor-list-stats";

type ContractorListHeroProps = {
  slug: string;
  title: string;
  description: string;
};

export default function ContractorListHero({
  slug,
  title,
  description,
}: ContractorListHeroProps) {
  const lastSpace = title.lastIndexOf(" ");
  const headline = title.slice(0, lastSpace);
  const highlight = title.slice(lastSpace + 1);

  return (
    <PageHero>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Category", href: "/category" },
              { label: contractorList.title, href: `/category/${slug}` },
            ]}
          />

          <h1 className="space-x-3 font-mono text-3xl leading-[normal] font-extrabold text-white md:text-4xl lg:text-[52px]">
            <span>{headline}</span>
            <span className="text-[#c92032]">{highlight}</span>
          </h1>

          <p className="text-sm leading-6 font-medium text-white md:text-base">
            {description}
          </p>
        </div>

        <ContractorListStats />
      </div>

      <CategorySearch />
    </PageHero>
  );
}
