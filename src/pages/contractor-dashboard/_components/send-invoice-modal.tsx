import { ApiError } from "@/lib/api";
import { invoiceApi, type ContractorInvoice } from "@/services/contractor";
import { Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import Modal, { cancelButton, modalField, modalLabel } from "./modal";

type SendInvoiceModalProps = {
  invoice: Pick<ContractorInvoice, "id" | "invoice_number">;
  onClose: () => void;
  onSent: (invoice: ContractorInvoice) => void;
};

// Emails the invoice (PDF attached); To/Subject/Message come pre-filled from the API
export default function SendInvoiceModal({
  invoice,
  onClose,
  onSent,
}: SendInvoiceModalProps) {
  const [values, setValues] = useState<{
    to: string;
    subject: string;
    message: string;
  } | null>(null);
  const [attachment, setAttachment] = useState(`${invoice.invoice_number}.pdf`);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    invoiceApi.sendPreview(invoice.id).then(
      ({ data }) => {
        if (cancelled) return;
        setValues({
          to: data.to,
          subject: data.subject,
          message: data.message,
        });
        setAttachment(data.attachment);
      },
      (err: unknown) => {
        if (cancelled) return;
        setValues({ to: "", subject: "", message: "" });
        setError(
          err instanceof ApiError ? err.message : "Could not load the invoice.",
        );
      },
    );
    return () => {
      cancelled = true;
    };
  }, [invoice.id]);

  const update = (field: "to" | "subject" | "message", value: string) => {
    setValues((prev) => (prev ? { ...prev, [field]: value } : prev));
    setError("");
  };

  const submit = async () => {
    if (!values) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.to.trim()))
      return setError("Enter a valid email address.");
    setSending(true);
    try {
      const { data } = await invoiceApi.send(invoice.id, {
        to: values.to.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      onSent(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not send the invoice.",
      );
      setSending(false);
    }
  };

  return (
    <Modal
      label="Send invoice to customer"
      onClose={onClose}
      onSubmit={() => void submit()}
      className="max-w-110 space-y-4"
    >
      <h2 className="text-[17px] font-bold text-[#212633]">
        Send invoice to customer
      </h2>
      {!values ? (
        <p className="py-6 text-center text-sm text-[#8c949e]">Loading…</p>
      ) : (
        <>
          <div>
            <label htmlFor="send-to" className={modalLabel}>
              To
            </label>
            <input
              id="send-to"
              type="email"
              value={values.to}
              aria-invalid={Boolean(error)}
              onChange={(event) => update("to", event.target.value)}
              className={modalField}
            />
          </div>
          <div>
            <label htmlFor="send-subject" className={modalLabel}>
              Subject
            </label>
            <textarea
              id="send-subject"
              rows={2}
              maxLength={255}
              value={values.subject}
              onChange={(event) => update("subject", event.target.value)}
              className={`${modalField} resize-none`}
            />
          </div>
          <div>
            <label htmlFor="send-message" className={modalLabel}>
              Message
            </label>
            <textarea
              id="send-message"
              rows={3}
              maxLength={5000}
              value={values.message}
              onChange={(event) => update("message", event.target.value)}
              className={`${modalField} min-h-19 resize-y text-[12.5px] font-normal`}
            />
          </div>
          <p className="flex items-center gap-1.5 text-xs text-[#8c949e]">
            <Paperclip aria-hidden className="size-3.5" />
            {attachment} attached
          </p>
        </>
      )}
      {error && (
        <p role="alert" className="text-xs text-[#c41e3a]">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2.5">
        <button type="button" onClick={onClose} className={cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={!values || sending}
          className="rounded-full bg-[#c41e3a] px-4.5 py-2.25 text-[13px] font-semibold text-white hover:bg-[#a51a31] disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send Invoice"}
        </button>
      </div>
    </Modal>
  );
}
