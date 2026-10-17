import Breadcrumb from "@/components/shared/breadcrumb";
import { cn } from "@/lib/utils";
import { categoryHero } from "../data/category-hero";

export default function CategoryHeroHeadline() {
  return (
    <div className="space-y-4">
      <Breadcrumb items={categoryHero.breadcrumbs} />

      <h1 className="space-x-3 font-mono text-3xl leading-[normal] font-extrabold text-white md:text-4xl lg:text-[52px]">
        {categoryHero.headlines.map(({ headline, type }) => (
          <span
            key={headline}
            className={cn({ "text-[#c92032]": type === "primary" })}
          >
            {headline}
          </span>
        ))}
      </h1>

      <p className="text-sm leading-6 font-medium text-white md:text-base">
        {categoryHero.description}
      </p>
    </div>
  );
}
