import UserAvatar from "@/components/shared/user-avatar";
import { ApiError, firstFieldErrors } from "@/lib/api";
import { mediaUrl } from "@/lib/media";
import { contractorApi, type Lead } from "@/services/contractor";
import { useState } from "react";
import { useNavigate } from "react-router";
import { leadStatuses } from "../data/contractor-dashboard";
import Modal, { cancelButton, modalField, modalLabel } from "./modal";
import StatusPill from "./status-pill";

type LeadDialogProps = {
  lead: Lead;
  onClose: () => void;
  // Called after a quote is sent or the lead declined, to refresh the list
  onChanged: () => void;
};

const money = (value: string) => {
  const amount = Number(value);
  return value.trim() === "" || Number.isNaN(amount) ? null : amount;
};

const primaryButton =
  "rounded-full bg-[#c41e3a] px-4.5 py-2.25 text-[13px] font-semibold text-white hover:bg-[#a51a31] disabled:opacity-60";

// Lead details plus the Send Quote form (Decline / Message customer as secondary actions)
export default function LeadDialog({
  lead,
  onClose,
  onChanged,
}: LeadDialogProps) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    quote_amount: "",
    labor_cost: "",
    materials_cost: "",
    tax_cost: "",
    estimated_duration: "",
    contractor_notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState<"send" | "decline" | "message" | null>(null);

  const canQuote = !lead.has_responded;
  const status = leadStatuses[lead.status] ?? {
    label: lead.status_label,
    tone: "blue" as const,
  };

  const update = (field: keyof typeof values, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const run = async (
    action: "send" | "decline" | "message",
    task: () => Promise<void>,
  ) => {
    setBusy(action);
    setFormError("");
    try {
      await task();
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
        setErrors(firstFieldErrors(err));
      } else {
        setFormError(
          err instanceof ApiError ? err.message : "Something went wrong.",
        );
      }
    } finally {
      setBusy(null);
    }
  };

  const sendQuote = () => {
    const amount = money(values.quote_amount);
    if (!amount || amount < 1) {
      setErrors({ quote_amount: "Enter the total quote amount." });
      return;
    }
    void run("send", async () => {
      await contractorApi.sendQuote(lead.id, {
        quote_amount: amount,
        labor_cost: money(values.labor_cost),
        materials_cost: money(values.materials_cost),
        tax_cost: money(values.tax_cost),
        estimated_duration: values.estimated_duration.trim() || null,
        contractor_notes: values.contractor_notes.trim() || null,
      });
      onChanged();
      onClose();
    });
  };

  const decline = () =>
    run("decline", async () => {
      await contractorApi.declineLead(lead.id);
      onChanged();
      onClose();
    });

  const message = () =>
    run("message", async () => {
      if (!lead.customer.id) return;
      const { data } = await contractorApi.startConversation(
        lead.customer.id,
        lead.id,
      );
      navigate(`/contractor/dashboard/messages?c=${data.id}`);
    });

  const details = [
    ["Service", lead.category_name],
    ["Budget", lead.budget.display],
    ["Timeline", lead.timeline.replace(/_/g, " ")],
    ["Location", lead.location.display],
    ["Requested", lead.requested_human],
    ["Reference", lead.reference_number],
  ];

  const amountField = (
    field: "quote_amount" | "labor_cost" | "materials_cost" | "tax_cost",
    label: string,
  ) => (
    <div>
      <label htmlFor={`lead-${field}`} className={modalLabel}>
        {label}
      </label>
      <input
        id={`lead-${field}`}
        inputMode="decimal"
        placeholder="0.00"
        value={values[field]}
        aria-invalid={Boolean(errors[field])}
        onChange={(event) =>
          update(field, event.target.value.replace(/[^\d.]/g, ""))
        }
        className={modalField}
      />
      {errors[field] && (
        <p className="pt-1 text-xs text-[#c41e3a]">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <Modal
      label={`Quote request from ${lead.customer.name}`}
      onClose={onClose}
      onSubmit={canQuote ? sendQuote : onClose}
      className="max-w-140"
    >
      <div className="flex items-start gap-3">
        <UserAvatar
          name={lead.customer.name}
          src={mediaUrl(lead.customer.avatar)}
          className="size-10"
        />
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-[#212633]">
            {lead.project_title}
          </p>
          <p className="text-[13px] text-[#8c949e]">
            {lead.customer.name}
            {lead.customer.phone && ` · ${lead.customer.phone}`}
          </p>
        </div>
        <StatusPill {...status} />
      </div>

      <p className="text-[13px] whitespace-pre-line text-[#212633]">
        {lead.description}
      </p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-[#f8fafc] p-3.5 text-[13px]">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-[#8c949e]">{label}</dt>
            <dd className="font-medium text-[#212633] capitalize">{value}</dd>
          </div>
        ))}
      </dl>

      {canQuote ? (
        <fieldset className="space-y-3">
          <legend className="pb-2 text-sm font-bold text-[#212633]">
            Send a quote
          </legend>
          {amountField("quote_amount", "Total quote ($)")}
          <div className="grid grid-cols-3 gap-2.5">
            {amountField("labor_cost", "Labor")}
            {amountField("materials_cost", "Materials")}
            {amountField("tax_cost", "Tax")}
          </div>
          <div>
            <label htmlFor="lead-duration" className={modalLabel}>
              Estimated duration
            </label>
            <input
              id="lead-duration"
              placeholder="e.g. 2–3 days"
              maxLength={100}
              value={values.estimated_duration}
              onChange={(event) =>
                update("estimated_duration", event.target.value)
              }
              className={modalField}
            />
          </div>
          <div>
            <label htmlFor="lead-notes" className={modalLabel}>
              Notes for the customer
            </label>
            <textarea
              id="lead-notes"
              rows={3}
              maxLength={2000}
              placeholder="What's included, warranty, scheduling…"
              value={values.contractor_notes}
              onChange={(event) =>
                update("contractor_notes", event.target.value)
              }
              className={`${modalField} resize-y`}
            />
          </div>
        </fieldset>
      ) : (
        lead.quote_response && (
          <div className="space-y-1 rounded-xl border border-[#e5e8ed] p-3.5 text-[13px]">
            <p className="font-bold text-[#212633]">
              Your quote: {lead.quote_response.display_amount}
            </p>
            {lead.quote_response.estimated_duration && (
              <p className="text-[#8c949e]">
                Duration: {lead.quote_response.estimated_duration}
              </p>
            )}
            {lead.quote_response.contractor_notes && (
              <p className="text-[#8c949e]">
                {lead.quote_response.contractor_notes}
              </p>
            )}
          </div>
        )
      )}

      {formError && (
        <p role="alert" className="text-sm text-[#c41e3a]">
          {formError}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2.5">
        {lead.customer.id && (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void message()}
            className={`${cancelButton} mr-auto`}
          >
            {busy === "message" ? "Opening…" : "Message customer"}
          </button>
        )}
        {canQuote ? (
          <>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => void decline()}
              className={cancelButton}
            >
              {busy === "decline" ? "Declining…" : "Decline"}
            </button>
            <button
              type="submit"
              disabled={busy !== null}
              className={primaryButton}
            >
              {busy === "send" ? "Sending…" : "Send Quote"}
            </button>
          </>
        ) : (
          <button type="submit" className={cancelButton}>
            Close
          </button>
        )}
      </div>
    </Modal>
  );
}
