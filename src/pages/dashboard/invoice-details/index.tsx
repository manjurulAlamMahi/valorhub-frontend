import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import { NotFound } from "@/pages/NotFound";
import { customerApi, type CustomerInvoice } from "@/services/customer";
import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { ActionButton } from "../_components/action-button";
import QueryBoundary from "@/components/shared/query-boundary";

export default function InvoiceDetails() {
  const { id } = useParams();
  const valid = /^\d+$/.test(id ?? "");
  const query = useApi<CustomerInvoice>(
    valid ? `/customer/invoices/${id}` : null,
  );
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  if (!valid || query.error?.status === 404) return <NotFound />;

  // Backend stub: marks the invoice paid and records a payment; Stripe comes later
  const handlePay = async () => {
    setPaying(true);
    setError("");
    try {
      await customerApi.payInvoice(Number(id));
      query.refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Payment failed.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <section className="space-y-5 leading-[normal]">
      <Link
        to="/dashboard/invoices"
        className="text-[13px] font-medium text-[#64748b] hover:text-[#1e293b]"
      >
        ← Back to Invoices
      </Link>

      <QueryBoundary query={query}>
        {(invoice) => {
          const isPaid = invoice.status === "paid";
          const lines = [
            { label: "Labor", value: invoice.breakdown.labor_amount_display },
            {
              label: "Materials",
              value: invoice.breakdown.materials_amount_display,
            },
            {
              label: "Platform fee (10%, incl. Stripe)",
              value: invoice.breakdown.platform_fee_display,
            },
          ];

          return (
            <>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold text-[#1e293b]">
                  Invoice #{invoice.invoice_number}
                </h1>
                <p className="text-sm text-[#64748b]">
                  From {invoice.contractor.business_name}
                  {invoice.project && ` · ${invoice.project.title}`} ·{" "}
                  {isPaid
                    ? `Paid ${invoice.paid_at ?? ""}`
                    : `Due ${invoice.due_at ?? "on receipt"}`}
                </p>
              </div>

              <div className="space-y-6 rounded-2xl bg-white p-5 sm:p-7">
                <dl className="space-y-4 text-sm">
                  {lines.map((line) => (
                    <div
                      key={line.label}
                      className="flex justify-between gap-4"
                    >
                      <dt className="text-[#64748b]">{line.label}</dt>
                      <dd className="text-[#1e293b]">{line.value}</dd>
                    </div>
                  ))}
                  <div className="bg-ring h-px" />
                  <div className="text-secondary-foreground flex justify-between gap-4 text-lg font-bold">
                    <dt>{isPaid ? "Total paid" : "Total due"}</dt>
                    <dd>{invoice.breakdown.total_due_display}</dd>
                  </div>
                </dl>

                {invoice.notes && (
                  <p className="text-[13px] text-[#64748b]">{invoice.notes}</p>
                )}

                {error && (
                  <p role="alert" className="text-sm text-[#c92032]">
                    {error}
                  </p>
                )}

                {isPaid ? (
                  <p
                    role="status"
                    className="flex items-center gap-2 rounded-xl bg-[#16a34a]/10 px-4 py-3 text-sm font-medium text-[#16a34a]"
                  >
                    <CircleCheck aria-hidden className="size-5" />
                    Paid on {invoice.paid_at}. See it under Payments.
                  </p>
                ) : (
                  <ActionButton
                    onClick={() => void handlePay()}
                    disabled={paying}
                    className="w-full sm:w-53.5"
                  >
                    {paying ? "Processing..." : "Pay now"}
                  </ActionButton>
                )}

                <p className="text-[13px] text-[#64748b]">
                  Secure payment powered by Stripe. A receipt will be emailed
                  after payment.
                </p>
              </div>
            </>
          );
        }}
      </QueryBoundary>
    </section>
  );
}
