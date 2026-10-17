import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ContractorPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function ContractorPagination({
  page,
  totalPages,
  onPageChange,
}: ContractorPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex justify-center">
      <ul className="flex items-center gap-2">
        <li>
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="text-accent grid h-10.5 w-12.5 place-content-center rounded-xl border border-[rgba(38,34,98,0.08)] disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (number) => (
            <li key={number}>
              <button
                type="button"
                aria-label={`Page ${number}`}
                aria-current={number === page ? "page" : undefined}
                onClick={() => onPageChange(number)}
                className={cn(
                  "text-accent grid h-10.5 min-w-11 place-content-center rounded-xl border border-[rgba(38,34,98,0.08)] bg-white px-4 text-base leading-6",
                  {
                    "bg-primary h-10 min-w-10 border-transparent text-white":
                      number === page,
                  },
                )}
              >
                {number}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            aria-label="Next page"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="text-accent grid h-10.5 w-12.5 place-content-center rounded-xl border border-[rgba(38,34,98,0.08)] disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
