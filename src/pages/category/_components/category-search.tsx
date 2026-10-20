import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import type { FormEvent } from "react";
import { createSearchParams, Link, useNavigate } from "react-router";
import { categoryHero } from "../data/category-hero";

const { search } = categoryHero;

// `popular` comes from the API's popular_tags
export default function CategorySearch({
  popular = [],
}: {
  popular?: string[];
}) {
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params: Record<string, string> = {};

    for (const name of [search.service.name, search.zip.name]) {
      const value = String(formData.get(name) ?? "").trim();
      if (value) params[name] = value;
    }

    navigate({
      pathname: search.action,
      search: createSearchParams(params).toString(),
    });
  };

  return (
    <div className="rounded-2xl bg-white p-4 drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)]">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 md:h-11 md:flex-row"
      >
        <label className="bg-muted flex h-11 min-w-0 items-center gap-3 rounded-xl px-4 md:flex-1">
          <Search aria-hidden className="text-muted-foreground size-4.5" />
          <input
            type="text"
            name={search.service.name}
            aria-label={search.service.placeholder}
            placeholder={search.service.placeholder}
            className="placeholder:text-muted-foreground text-card-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>

        <label className="bg-muted flex h-11 items-center gap-3 rounded-xl px-4 md:w-44">
          <MapPin aria-hidden className="text-muted-foreground size-4.5" />
          <input
            type="text"
            name={search.zip.name}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={10}
            aria-label={search.zip.placeholder}
            placeholder={search.zip.placeholder}
            className="placeholder:text-muted-foreground text-card-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>

        <Button
          type="submit"
          className="h-11 gap-2 rounded-xl bg-[#c92032] px-6 text-sm leading-5 font-semibold text-white hover:bg-[#c92032]/90 md:w-50.25"
        >
          <Search />
          {search.cta}
        </Button>
      </form>

      {popular.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 border-t border-[#f3f4f6]">
          <p className="text-muted-foreground text-sm leading-4">
            {search.popularLabel}
          </p>

          <ul className="flex flex-wrap items-center gap-2.5 pt-4 pb-2">
            {popular.map((service) => (
              <li key={service}>
                <Badge
                  variant="secondary"
                  className="h-6 rounded-[18px] px-2.5 py-1 text-xs leading-4 font-medium"
                  render={
                    <Link
                      to={{
                        pathname: search.action,
                        search: createSearchParams({
                          [search.service.name]: service,
                        }).toString(),
                      }}
                    />
                  }
                >
                  {service}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
