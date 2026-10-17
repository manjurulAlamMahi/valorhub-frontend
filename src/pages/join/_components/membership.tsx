import { onboarding, type Plan } from "../data/onboarding";
import PlanCards from "./plan-cards";

export default function Membership({
  onSelect,
}: {
  onSelect: (plan: Plan) => void;
}) {
  return (
    <>
      <section className="bg-secondary-foreground px-4 py-10 text-center">
        <h1 className="font-mono text-2xl font-bold text-[#f5f7f7] md:text-3xl">
          {onboarding.membership.title}
        </h1>
        <p className="pt-2 text-[15px] text-[#a6adb2]">
          {onboarding.membership.description}
        </p>
      </section>

      <div className="bg-input px-4 py-10 xl:px-25">
        <PlanCards onSelect={onSelect} className="mx-auto max-w-310" />
      </div>
    </>
  );
}
