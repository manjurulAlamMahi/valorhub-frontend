import { NotFound } from "@/pages/NotFound";
import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { ActionButton } from "../_components/action-button";
import { formatMoney, invoiceTotal } from "../data/dashboard";
import { useDashboard } from "../data/dashboard-store";

export default function InvoiceDetails() {
  const { id } = useParams();
  const { state, dispatch } = useDashboard();
  const [paying, setPaying] = useState(false);
  const invoice = state.invoices.find((item) => item.id === id);

  if (!invoice) return <NotFound />;

  const isPaid = invoice.status === "paid";
  const lines = [
    { label: "Labor", value: invoice.labor },
    { label: "Materials", value: invoice.materials },
    { label: "Platform fee (10%, incl. Stripe)", value: invoice.fee },
  ];

  // Stand-in for the Stripe checkout until payments are wired to the backend
  const handlePay = () => {
    setPaying(true);
    window.setTimeout(() => {
      dispatch({ type: "payInvoice", id: invoice.id });
      setPaying(false);
    }, 800);
  };

  return (
    <section className="space-y-5 leading-[normal]">
      <Link
        to="/dashboard/invoices"
        className="text-[13px] font-medium text-[#64748b] hover:text-[#1e293b]"
      >
        ← Back to Invoices
      </Link>

      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-[#1e293b]">
          Invoice #{invoice.id}
        </h1>
        <p className="text-sm text-[#64748b]">
          From {invoice.contractor} ·{" "}
          {isPaid ? `Paid ${invoice.paidAt}` : `Due ${invoice.dueAt}`}
        </p>
      </div>

      <div className="space-y-6 rounded-2xl bg-white p-5 sm:p-7">
        <dl className="space-y-4 text-sm">
          {lines.map((line) => (
            <div key={line.label} className="flex justify-between gap-4">
              <dt className="text-[#64748b]">{line.label}</dt>
              <dd className="text-[#1e293b]">{formatMoney(line.value)}</dd>
            </div>
          ))}
          <div className="bg-ring h-px" />
          <div className="text-secondary-foreground flex justify-between gap-4 text-lg font-bold">
            <dt>{isPaid ? "Total paid" : "Total due"}</dt>
            <dd>{formatMoney(invoiceTotal(invoice))}</dd>
          </div>
        </dl>

        {isPaid ? (
          <p
            role="status"
            className="flex items-center gap-2 rounded-xl bg-[#16a34a]/10 px-4 py-3 text-sm font-medium text-[#16a34a]"
          >
            <CircleCheck aria-hidden className="size-5" />
            Paid on {invoice.paidAt}. A receipt has been emailed to you.
          </p>
        ) : (
          <ActionButton
            onClick={handlePay}
            disabled={paying}
            className="w-full sm:w-53.5"
          >
            {paying ? "Processing..." : "Pay now"}
          </ActionButton>
        )}

        <p className="text-[13px] text-[#64748b]">
          Secure payment powered by Stripe. A receipt will be emailed after
          payment.
        </p>
      </div>
    </section>
  );
}
