import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { FormEvent } from "react";
import { createSearchParams, useNavigate } from "react-router";
import { findAPro } from "../data/find-a-pro";

const { search } = findAPro;

export default function FindAProSearch() {
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
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 rounded-2xl bg-[#e8e8e8] p-2 sm:flex-row sm:gap-4"
    >
      <div className="flex min-w-0 flex-1">
        <input
          type="text"
          name={search.service.name}
          aria-label={search.service.placeholder}
          placeholder={search.service.placeholder}
          className="h-12 min-w-0 flex-1 rounded-l-xl bg-white px-4 text-base text-[#0a0a0a] outline-none placeholder:text-[#0a0a0a]/50 sm:h-16 sm:px-6 sm:text-[17px]"
        />
        <input
          type="text"
          name={search.zip.name}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={10}
          aria-label={search.zip.placeholder}
          placeholder={search.zip.placeholder}
          className="h-12 w-28 shrink-0 rounded-r-xl border-l border-[#e5e7eb] bg-white px-4 text-center text-base text-[#0a0a0a] outline-none placeholder:text-[#0a0a0a]/40 sm:h-16 sm:w-37.5 sm:pr-6 sm:pl-6.25 sm:text-[16.9px]"
        />
      </div>

      <Button
        type="submit"
        className="h-12 gap-2 rounded-xl bg-[#dc2626] px-10 text-[17.6px] leading-7 font-bold text-white hover:bg-[#dc2626]/90 sm:h-16 [&_svg:not([class*='size-'])]:size-6"
      >
        <Search strokeWidth={2} />
        {search.cta}
      </Button>
    </form>
  );
}
