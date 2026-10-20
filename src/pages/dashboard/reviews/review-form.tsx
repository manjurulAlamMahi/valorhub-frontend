import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ActionButton } from "../_components/action-button";

type ReviewFormProps = {
  initialRating?: number;
  initialText?: string;
  onCancel: () => void;
  // Posts the review; a rejection shows its message in the form
  onSave: (rating: number, text: string) => Promise<void>;
};

export default function ReviewForm({
  initialRating = 0,
  initialText = "",
  onCancel,
  onSave,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!rating) return setError("Please choose a rating.");
    if (text.trim().length < 10)
      return setError("Please write at least 10 characters.");
    setSaving(true);
    try {
      await onSave(rating, text.trim());
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not post review.",
      );
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="w-full space-y-3"
    >
      <fieldset>
        <legend className="sr-only">Rating</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <label
              key={value}
              onMouseEnter={() => setHover(value)}
              className="cursor-pointer"
            >
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => {
                  setRating(value);
                  setError("");
                }}
                className="peer sr-only"
              />
              <Star
                aria-hidden
                className={cn(
                  "size-6 text-[#e6eaf2] peer-focus-visible:text-[#c92032]/50",
                  {
                    "fill-[#c92032] text-[#c92032]": value <= (hover || rating),
                  },
                )}
              />
              <span className="sr-only">
                {value} star{value > 1 ? "s" : ""}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="sr-only" htmlFor="review-text">
        Your review
      </label>
      <textarea
        id="review-text"
        value={text}
        rows={3}
        maxLength={2000}
        onChange={(event) => {
          setText(event.target.value);
          setError("");
        }}
        placeholder="Share your experience with this contractor..."
        className="w-full resize-y rounded-xl border border-[#e6eaf2] p-3.5 text-sm text-[#1e293b] outline-none placeholder:text-[#94a3b8] focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10"
      />
      {error && <p className="text-sm text-[#c92032]">{error}</p>}

      <div className="flex gap-2.5">
        <ActionButton type="submit" disabled={saving}>
          {saving ? "Posting…" : "Post review"}
        </ActionButton>
        <ActionButton variant="outline" onClick={onCancel}>
          Cancel
        </ActionButton>
      </div>
    </form>
  );
}
