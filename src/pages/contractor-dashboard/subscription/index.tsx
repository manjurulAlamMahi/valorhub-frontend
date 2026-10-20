import { SEO } from "@/components/seo/SEO";
import QueryBoundary from "@/components/shared/query-boundary";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import PlanCards from "@/pages/join/_components/plan-cards";
import { annualPrice, toPlan, type Plan } from "@/pages/join/data/onboarding";
import {
  subscriptionApi,
  type BillingCycle,
  type SubscriptionData,
} from "@/services/contractor";
import { CircleCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";

const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const shortName = (name: string) => name.replace(" Verified Membership", "");

export default function Subscription() {
  const query = useApi<SubscriptionData>("/contractor/subscription");

  return (
    <>
      <SEO
        title="Subscription"
        description="Manage your ValorHub membership and billing."
        robots="noindex, nofollow"
      />
      <div className="space-y-6 p-4 sm:p-6">
        <QueryBoundary query={query}>
          {(data) => <SubscriptionView data={data} onChange={query.refetch} />}
        </QueryBoundary>
      </div>
    </>
  );
}

function SubscriptionView({
  data,
  onChange,
}: {
  data: SubscriptionData;
  onChange: () => void;
}) {
  const { refreshUser } = useAuth();
  const { current } = data;
  const [billing, setBilling] = useState<BillingCycle>(
    current?.billing_cycle ?? "monthly",
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const plans = data.plans.map(toPlan);
  const isPaid = (current?.price ?? 0) > 0;
  // Largest annual saving across paid plans, from the real prices
  const savings = Math.max(
    0,
    ...plans
      .filter((plan) => plan.monthlyPrice > 0)
      .map((plan) =>
        Math.round((1 - annualPrice(plan) / (plan.monthlyPrice * 12)) * 100),
      ),
  );

  const run = async (task: () => Promise<{ message: string }>) => {
    setBusy(true);
    setMessage(null);
    try {
      const response = await task();
      // The header's plan badge and feature gates read the signed-in user
      await refreshUser();
      onChange();
      setMessage({ type: "success", text: response.message });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof ApiError ? err.message : "Something went wrong.",
      });
    } finally {
      setBusy(false);
    }
  };

  const select = (plan: Plan) => {
    const price =
      plan.monthlyPrice === 0
        ? "free"
        : billing === "annual"
          ? `${money(annualPrice(plan))}/year`
          : `${money(plan.monthlyPrice)}/month`;
    const charge =
      plan.monthlyPrice > 0
        ? ` You'll be charged ${price}${current?.payment_method_last4 ? ` on the card ending ${current.payment_method_last4}` : ""}.`
        : "";
    if (
      !window.confirm(
        `Switch your membership to ${shortName(plan.name)} (${billing})?${charge}`,
      )
    )
      return;
    void run(() => subscriptionApi.change(plan.id, billing));
  };

  const cancel = () => {
    if (
      !window.confirm(
        "Cancel your paid membership? You'll move to the Free plan and lose premium features.",
      )
    )
      return;
    void run(() => subscriptionApi.cancel());
  };

  const [receiptBusy, setReceiptBusy] = useState<number | null>(null);
  const download = async (
    entry: SubscriptionData["billing_history"][number],
  ) => {
    setReceiptBusy(entry.id);
    try {
      await subscriptionApi.downloadReceipt(entry.id, entry.date);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof ApiError
            ? err.message
            : "Could not download the receipt.",
      });
    } finally {
      setReceiptBusy(null);
    }
  };

  return (
    <>
      <section className="flex flex-wrap items-center gap-4 rounded-2xl bg-[#262262] p-5">
        <span className="grid size-12 shrink-0 place-content-center rounded-xl bg-[#c41e3a]/20">
          <ShieldCheck aria-hidden className="size-6 text-[#f87171]" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-base leading-6 font-bold text-white">
            {current
              ? `${shortName(current.plan.name)} Plan — ${current.status === "active" ? "Active" : current.status.replace("_", " ")}`
              : "No active plan"}
          </h1>
          {current && (
            <p className="text-sm leading-5 text-white/60">
              {isPaid ? current.summary : "Free"}
            </p>
          )}
        </div>
        {isPaid && (
          <button
            type="button"
            disabled={busy}
            onClick={cancel}
            className="rounded-lg bg-white/8 px-4 py-2 text-sm leading-5 font-semibold text-white/70 hover:bg-white/15 hover:text-white disabled:opacity-50"
          >
            Cancel membership
          </button>
        )}
      </section>

      {message && (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium",
            message.type === "error"
              ? "bg-[#fef2f2] text-[#c41e3a]"
              : "bg-[#ecfdf5] text-[#065f46]",
          )}
        >
          {message.type === "success" && (
            <CircleCheck aria-hidden className="size-4" />
          )}
          {message.text}
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
              {cycle === "annual" && savings > 0 && (
                <span className="rounded-full bg-[#ecfdf5] px-1.5 py-0.5 text-xs leading-4 text-[#065f46]">
                  Save {savings}%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <PlanCards
        plans={plans}
        billing={billing}
        currentSlug={
          billing === current?.billing_cycle ? current.plan.slug : undefined
        }
        disabled={busy}
        onSelect={select}
      />

      <section
        aria-label="Billing History"
        className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white"
      >
        <h2 className="border-b border-[#f1f5f9] px-5 py-4 text-sm leading-5 font-semibold text-[#0f172a]">
          Billing History
        </h2>
        {data.billing_history.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#64748b]">
            No payments yet.
          </p>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm leading-5">
              <thead className="bg-[#f8fafc] text-xs leading-4 font-semibold text-[#64748b]">
                <tr>
                  {["Date", "Plan", "Amount", "Status"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-3 font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="px-5 py-3 text-right font-semibold"
                  >
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.billing_history.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[#e3e3e3] last:border-b-0"
                  >
                    <td className="px-5 py-4 text-[#374151]">{entry.date}</td>
                    <td className="px-5 py-4 text-[#374151]">
                      {shortName(entry.plan)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#0f172a]">
                      {entry.amount_display}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-xs leading-4 font-semibold text-[#065f46] capitalize">
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        disabled={receiptBusy === entry.id}
                        onClick={() => void download(entry)}
                        className="text-xs leading-4 font-medium text-[#1b3a6b] hover:underline disabled:opacity-50"
                      >
                        {receiptBusy === entry.id ? "Preparing…" : "Download"}
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
        )}
      </section>
    </>
  );
}
