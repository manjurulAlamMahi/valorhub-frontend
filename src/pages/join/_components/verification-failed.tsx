import { BadgeCheck, Lock, TriangleAlert, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { onboarding } from "../data/onboarding";

const copy = onboarding.verificationFailed;
const reasons = [
  { icon: BadgeCheck, text: copy.reasons[0] },
  { icon: Users, text: copy.reasons[1] },
  { icon: Lock, text: copy.reasons[2] },
];

export default function VerificationFailed({
  onRetry,
}: {
  onRetry: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="px-4 py-12 md:py-29">
      <section
        role="alert"
        className="mx-auto max-w-155.5 rounded-xl border border-[#26225f]/22 bg-white px-5 py-8 text-center text-black sm:p-10"
      >
        <span className="mx-auto grid size-26.5 place-content-center rounded-full border border-[#be1e2d]/15">
          <span className="grid size-22 place-content-center rounded-full bg-[#be1e2d]/25">
            <TriangleAlert
              aria-hidden
              className="size-11 text-[#be1e2d]"
              strokeWidth={1.75}
            />
          </span>
        </span>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="pt-2 font-mono text-[28px] leading-[1.5] font-bold outline-none sm:text-[32px]"
        >
          {copy.title}
        </h1>
        <p className="pt-2.5 text-lg leading-[1.5] sm:text-xl">
          {copy.description}
        </p>

        <div className="my-4 h-px bg-[#d9d9d9]" />

        <p className="mx-auto max-w-110 font-mono text-xl leading-[1.5] font-medium sm:text-2xl">
          {copy.headline}{" "}
          <strong className="block font-bold text-[#be1e2d]">
            {copy.highlight}
          </strong>
        </p>
        <p className="mx-auto max-w-110 pt-2.5 text-lg leading-[1.5] sm:text-xl">
          {copy.body}
        </p>

        <div className="mt-6 rounded-2xl bg-[#be1e2d]/8 p-5 text-left sm:p-6">
          <h2 className="pb-4 text-lg leading-[1.5] font-bold sm:text-xl">
            {copy.whyTitle}
          </h2>
          <ul className="space-y-1">
            {reasons.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2.5 text-base leading-[1.5]"
              >
                <span className="grid size-12 shrink-0 place-content-center sm:size-15">
                  <Icon
                    aria-hidden
                    className="size-8 text-[#be1e2d]"
                    strokeWidth={1.5}
                  />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-1.75 pt-6">
          <Link
            to="/"
            className="flex h-12 items-center justify-center rounded-xl bg-[#be1e2d] text-base text-white transition-colors hover:bg-[#a51a27]"
          >
            {copy.home}
          </Link>
          <button
            type="button"
            onClick={onRetry}
            className="h-12 w-full rounded-xl text-base hover:bg-[#f7f8fa]"
          >
            {copy.retry}
          </button>
        </div>
      </section>
    </div>
  );
}
