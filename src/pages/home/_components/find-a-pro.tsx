import Section from "@/components/shared/section";
import { findAPro } from "../data/find-a-pro";
import FindAProSearch from "./find-a-pro-search";

export default function FindAPro() {
  return (
    <Section className="relative flex min-h-100 items-center justify-center overflow-hidden px-4 py-10 md:h-125.5">
      <div
        aria-hidden
        className="absolute -top-[33.5%] -left-[5.3%] h-[157.2%] w-[110.6%]"
      >
        <img
          src={findAPro.background}
          alt=""
          className="absolute -top-[5.25%] left-0 h-[105.19%] w-[133.33%] max-w-none object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_0%,rgba(147,145,177,0.5)_45%,rgba(92,89,137,0.75)_67.5%,rgba(65,62,118,0.875)_78.75%,#262262_90%)] opacity-20" />
      </div>

      <div className="relative flex w-full max-w-232 flex-col items-center gap-6 bg-[rgba(38,34,98,0.4)] px-4 py-8 md:gap-8 md:px-6 md:py-10">
        <h1 className="text-center text-2xl leading-[normal] font-bold text-white md:text-[40px]">
          {findAPro.headlines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <FindAProSearch />
      </div>
    </Section>
  );
}
