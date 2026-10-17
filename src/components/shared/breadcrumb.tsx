import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

type BreadcrumbProps = {
  items: {
    label: string;
    href: string;
  }[];
  tone?: "dark" | "light";
};

export default function Breadcrumb({ items, tone = "dark" }: BreadcrumbProps) {
  const isLight = tone === "light";

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight
                aria-hidden
                className={cn(
                  "size-3",
                  isLight ? "text-[#64748b]" : "text-white",
                )}
              />
            )}
            <Link
              to={item.href}
              aria-current={index === items.length - 1 ? "page" : undefined}
              className={cn(
                "text-base leading-6",
                isLight
                  ? "text-[#64748b] hover:text-[#1e293b]"
                  : "font-medium text-white hover:text-white/80",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
