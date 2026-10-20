import { EmptyState, ErrorState } from "@/components/shared/query-state";
import type { ApiError } from "@/lib/api";
import type { Category } from "@/services/public";
import { Link } from "react-router";
import { findByService } from "../data/find-by-service";

type BrowByCategoryGridProps = {
  categories?: Category[];
  error?: ApiError;
  onRetry?: () => void;
};

export default function BrowByCategoryGrid({
  categories,
  error,
  onRetry,
}: BrowByCategoryGridProps) {
  if (!categories && error) {
    return <ErrorState error={error} onRetry={onRetry} className="mt-6" />;
  }

  if (categories?.length === 0) {
    return <EmptyState className="mt-6">{findByService.empty}</EmptyState>;
  }

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories
        ? categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="block overflow-hidden rounded-2xl bg-cover bg-center pt-28 transition-opacity hover:opacity-90"
              style={{
                backgroundImage: `url(${findByService.images[index % findByService.images.length]})`,
              }}
            >
              <div className="bg-gradient-fade p-4">
                <h2 className="text-lg font-bold text-white">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="line-clamp-1 text-xs leading-4 text-white">
                    {category.description}
                  </p>
                )}
                {category.services_count_label && (
                  <p className="text-xs leading-4 font-semibold text-white">
                    {category.services_count_label}
                  </p>
                )}
              </div>
            </Link>
          ))
        : Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              aria-hidden
              className="h-44 animate-pulse rounded-2xl bg-[#e2e4ee]"
            />
          ))}
    </div>
  );
}
