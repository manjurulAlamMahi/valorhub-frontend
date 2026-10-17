import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import PlanCards from "@/pages/join/_components/plan-cards";
import { annualPrice, plans, type Plan } from "@/pages/join/data/onboarding";
import { CircleCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { contractor } from "../data/contractor-dashboard";

const billingHistory = [
  { id: "1", date: "Aug 1, 2026", plan: "Elite", amount: 79 },
  { id: "2", date: "Jul 1, 2026", plan: "Elite", amount: 79 },
  { id: "3", date: "Jun 1, 2026", plan: "Elite", amount: 79 },
  { id: "4", date: "May 1, 2026", plan: "Pro", amount: 29 },
];

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const shortName = (plan: Plan) => plan.name.replace(" Verified Membership", "");

// Plain-text receipt until the billing API provides PDFs
const downloadReceipt = (entry: (typeof billingHistory)[number]) => {
  const text = [
    "ValorHub — Payment Receipt",
    "",
    `Business: ${contractor.business}`,
    `Date: ${entry.date}`,
    `Plan: ${entry.plan} Verified Membership`,
    `Amount: ${money(entry.amount)}`,
    "Status: Paid",
  ].join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: `valorhub-receipt-${entry.date.replace(/[ ,]+/g, "-").toLowerCase()}.txt`,
  });
  link.click();
  URL.revokeObjectURL(url);
};

export default function Subscription() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [current, setCurrent] = useState(
    plans.find((plan) => plan.slug === "elite")!,
  );
  const [currentBilling, setCurrentBilling] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [notice, setNotice] = useState("");

  const price =
    currentBilling === "annual"
      ? `${money(annualPrice(current)).replace(".00", "")}/year`
      : `${money(current.monthlyPrice).replace(".00", "")}/month`;

  const select = (plan: Plan) => {
    const label = `${shortName(plan)} (${billing})`;
    if (!window.confirm(`Switch your membership to ${label}?`)) return;
    setCurrent(plan);
    setCurrentBilling(billing);
    setNotice(`Your plan has been changed to ${label}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Subscription"
        description="Manage your ValorHub membership and billing."
        robots="noindex, nofollow"
      />

      <div className="space-y-6 p-4 sm:p-6">
        <section className="flex flex-wrap items-center gap-4 rounded-2xl bg-[#262262] p-5">
          <span className="grid size-12 shrink-0 place-content-center rounded-xl bg-[#c41e3a]/20">
            <ShieldCheck aria-hidden className="size-6 text-[#f87171]" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-base leading-6 font-bold text-white">
              {shortName(current)} Plan — Active
            </h1>
            <p className="text-sm leading-5 text-white/60">
              {current.monthlyPrice === 0 ? "Free" : price} · Renews Sep 1, 2026
              · Visa ending 4821
            </p>
          </div>
          <Link
            to="/contractor/dashboard/subscription/billing"
            className="rounded-lg bg-white/8 px-4 py-2 text-sm leading-5 font-semibold text-white/70 hover:bg-white/15 hover:text-white"
          >
            Manage Billing
          </Link>
        </section>

        {notice && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-lg bg-[#ecfdf5] px-4 py-2.5 text-[13px] font-medium text-[#065f46]"
          >
            <CircleCheck aria-hidden className="size-4" />
            {notice}
          </p>
        )}

        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl leading-7 font-bold text-[#0f172a]">
            Choose Your Plan
          </h2>
          <div
            role="radiogroup"
            aria-label="Billing cycle"
            className="flex items-center gap-3 rounded-full bg-[#f1f5f9] px-4 py-2"
          >
            {(["monthly", "annual"] as const).map((cycle) => (
              <button
                key={cycle}
                type="button"
                role="radio"
                aria-checked={billing === cycle}
                onClick={() => setBilling(cycle)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1 text-sm leading-5 font-semibold transition-colors",
                  billing === cycle
                    ? "bg-white text-[#0f172a] shadow-[0_1px_1.5px_rgba(0,0,0,0.1)]"
                    : "text-[#64748b] hover:text-[#0f172a]",
                )}
              >
                {cycle === "monthly" ? "Monthly" : "Annual"}
                {cycle === "annual" && (
                  <span className="rounded-full bg-[#ecfdf5] px-1.5 py-0.5 text-xs leading-4 text-[#065f46]">
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <PlanCards
          billing={billing}
          currentSlug={billing === currentBilling ? current.slug : undefined}
          onSelect={select}
        />

        <section
          aria-label="Billing History"
          className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white"
        >
          <h2 className="border-b border-[#f1f5f9] px-5 py-4 text-sm leading-5 font-semibold text-[#0f172a]">
            Billing History
          </h2>
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm leading-5">
              <thead className="bg-[#f8fafc] text-xs leading-4 font-semibold text-[#64748b]">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Date
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Plan
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Amount
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-right font-semibold"
                  >
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[#e3e3e3] last:border-b-0"
                  >
                    <td className="px-5 py-4 text-[#374151]">{entry.date}</td>
                    <td className="px-5 py-4 text-[#374151]">{entry.plan}</td>
                    <td className="px-5 py-4 font-semibold text-[#0f172a]">
                      {money(entry.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-xs leading-4 font-semibold text-[#065f46]">
                        Paid
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => downloadReceipt(entry)}
                        className="text-xs leading-4 font-medium text-[#1b3a6b] hover:underline"
                      >
                        Download
                        <span className="sr-only">
                          {" "}
                          receipt for {entry.date}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
