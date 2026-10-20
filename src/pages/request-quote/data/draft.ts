import type { QuoteFormValues } from "./request-quote";

// Guests fill the wizard first and log in to submit; the draft survives that round trip.
// Photos are File objects and can't be serialised, so they are left out.
const DRAFT_KEY = "valorhub.quote-draft";

export type QuoteDraft = {
  contractorId: string | null;
  values: Omit<QuoteFormValues, "photos">;
};

export function saveDraft(
  contractorId: string | null,
  values: QuoteFormValues,
) {
  try {
    // `photos: undefined` is dropped by JSON.stringify
    const draft = { contractorId, values: { ...values, photos: undefined } };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage blocked: the user will just have to re-enter their answers
  }
}

export function readDraft(contractorId: string | null): QuoteDraft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    const draft = raw ? (JSON.parse(raw) as QuoteDraft) : null;
    // A draft for a different contractor doesn't belong to this wizard
    return draft && draft.contractorId === contractorId ? draft : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing to clear
  }
}
