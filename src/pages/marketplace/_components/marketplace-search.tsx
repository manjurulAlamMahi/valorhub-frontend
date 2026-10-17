import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router";
import { marketplace } from "../data/marketplace";

const { search } = marketplace.hero;

export default function MarketplaceSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = String(
      new FormData(event.currentTarget).get(search.name) ?? "",
    ).trim();

    setSearchParams((prev) => {
      if (value) prev.set(search.name, value);
      else prev.delete(search.name);
      return prev;
    });
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex max-w-180.5 flex-col gap-3 rounded-2xl bg-white p-4 drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)] sm:h-19 sm:flex-row"
    >
      <label className="bg-muted flex h-11 min-w-0 items-center gap-3 rounded-xl px-4 sm:flex-1">
        <Search aria-hidden className="text-muted-foreground size-4.5" />
        <input
          key={searchParams.get(search.name)}
          type="search"
          name={search.name}
          defaultValue={searchParams.get(search.name) ?? ""}
          aria-label={search.placeholder}
          placeholder={search.placeholder}
          className="placeholder:text-muted-foreground text-card-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
      </label>

      <Button
        type="submit"
        className="h-11 gap-2 rounded-xl bg-[#c92032] px-6 text-sm leading-5 font-semibold text-white hover:bg-[#c92032]/90 sm:w-50.25"
      >
        <Search />
        {search.cta}
      </Button>
    </form>
  );
}
