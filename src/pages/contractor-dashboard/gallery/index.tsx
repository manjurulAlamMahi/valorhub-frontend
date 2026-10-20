import { SEO } from "@/components/seo/SEO";
import QueryBoundary from "@/components/shared/query-boundary";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  catalogApi,
  type GalleryData,
  type GalleryPhoto,
} from "@/services/contractor";
import { CircleAlert, CircleCheck, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

const MAX_SIZE = 5 * 1024 * 1024;

export default function Gallery() {
  const [category, setCategory] = useState<string | null>(null);
  const query = useApi<GalleryData>("/contractor/gallery", { category });
  const [viewing, setViewing] = useState<GalleryPhoto | null>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const usage = query.data?.usage;
  const canAdd = usage?.can_add_more ?? false;

  useEffect(() => {
    if (!viewing) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setViewing(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [viewing]);

  const run = async (task: () => Promise<unknown>, success?: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await task();
      query.refetch();
      if (success) setMessage({ type: "success", text: success });
      return true;
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof ApiError
            ? (Object.values(err.fieldErrors)[0]?.[0] ?? err.message)
            : "Upload failed.",
      });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const addFiles = (files: FileList | null) => {
    const images = Array.from(files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (!images.length) return;
    const tooBig = images.find((file) => file.size > MAX_SIZE);
    if (tooBig) {
      setMessage({ type: "error", text: `${tooBig.name} is larger than 5MB.` });
      return;
    }
    // Photos land in the open tab's category (Project Photos from "All")
    void run(
      () => catalogApi.uploadPhotos(images, category ?? "project_photos"),
      `${images.length} photo${images.length > 1 ? "s" : ""} added.`,
    );
  };

  const open = (photo: GalleryPhoto) => {
    setViewing(photo);
    setCaption(photo.caption ?? "");
  };

  const fileInput = (
    <input
      type="file"
      accept="image/png,image/jpeg,image/webp"
      multiple
      disabled={!canAdd || busy}
      onChange={(event) => {
        addFiles(event.target.files);
        event.target.value = "";
      }}
      className="sr-only"
    />
  );

  return (
    <>
      <SEO
        title="Gallery"
        description="Showcase your work with photos on ValorHub."
        robots="noindex, nofollow"
      />

      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Filter photos"
            className="flex flex-wrap gap-1.5"
          >
            {[
              { key: null, label: "All", count: undefined },
              ...(query.data?.categories ?? []),
            ].map((tab) => (
              <button
                key={tab.key ?? "all"}
                type="button"
                role="tab"
                aria-selected={category === tab.key}
                aria-controls="photo-grid"
                onClick={() => setCategory(tab.key)}
                className={cn(
                  "flex h-7 items-center gap-1 rounded-full px-3.5 text-xs leading-4 font-semibold transition-colors",
                  category === tab.key
                    ? "bg-[#262262] text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]",
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="opacity-60">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
          <label
            className={cn(
              "flex items-center gap-2 rounded-lg bg-[#262262] px-4 py-2 text-sm leading-5 font-semibold text-white focus-within:ring-3 focus-within:ring-[#262262]/30",
              canAdd && !busy
                ? "cursor-pointer hover:bg-[#211d53]"
                : "cursor-not-allowed opacity-50",
            )}
          >
            {fileInput}
            <Plus aria-hidden className="size-4" />
            {busy ? "Uploading…" : "Add Photos"}
          </label>
        </div>

        {usage && (
          <p className="flex flex-wrap items-center gap-3 rounded-xl bg-[linear-gradient(178deg,#f0f7ff_0%,#eef2ff_100%)] px-4 py-3 text-sm leading-5 font-bold text-[#262262]">
            {canAdd ? (
              <CircleCheck aria-hidden className="size-5 shrink-0" />
            ) : (
              <CircleAlert
                aria-hidden
                className="size-5 shrink-0 text-[#c41e3a]"
              />
            )}
            <span className="flex-1">
              {usage.is_unlimited
                ? `${usage.plan ?? "Your plan"}: Unlimited gallery images. Currently using ${usage.used}.`
                : usage.limit === 0
                  ? `${usage.plan ?? "Your plan"} doesn't include gallery uploads.`
                  : `${usage.plan ?? "Your plan"}: ${usage.used} of ${usage.limit} gallery images used.`}
            </span>
            {!canAdd && (
              <Link
                to="/contractor/dashboard/subscription"
                className="text-xs text-[#c41e3a] hover:underline"
              >
                Upgrade
              </Link>
            )}
          </p>
        )}

        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={cn(
              "text-sm",
              message.type === "error" ? "text-[#c41e3a]" : "text-[#16a34a]",
            )}
          >
            {message.text}
          </p>
        )}

        <QueryBoundary query={query}>
          {({ items }) => (
            <ul
              id="photo-grid"
              role="tabpanel"
              className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4 bg-white pt-6 pb-5 sm:grid-cols-[repeat(auto-fill,9.1875rem)]"
            >
              {items.map((photo) => (
                <li key={photo.id} className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => open(photo)}
                    className="block aspect-147/110 w-full overflow-hidden rounded-[10px] bg-[#f1f5f9] focus-visible:ring-3 focus-visible:ring-[#262262]/40 focus-visible:outline-none"
                  >
                    {photo.image && (
                      <img
                        src={photo.image}
                        alt={photo.caption ?? photo.category_label}
                        loading="lazy"
                        className="size-full object-cover transition-transform hover:scale-105"
                      />
                    )}
                  </button>
                  <p className="truncate text-[11px] text-[#26225f]/70">
                    {photo.caption || photo.category_label}
                  </p>
                </li>
              ))}
              {canAdd && (
                <li>
                  <label className="flex aspect-147/110 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed border-[#26225f]/25 text-[#26225f] focus-within:ring-3 focus-within:ring-[#262262]/30 hover:bg-[#f8fafc]">
                    {fileInput}
                    <Plus aria-hidden className="size-4" strokeWidth={2.5} />
                    <span className="text-[11px] text-[#26225f]/70">
                      Add Photo
                    </span>
                  </label>
                </li>
              )}
            </ul>
          )}
        </QueryBoundary>
      </div>

      {viewing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={viewing.caption ?? "Photo"}
          onClick={() => setViewing(null)}
          className="fixed inset-0 z-60 grid place-items-center bg-[#0f172a]/80 p-4"
        >
          <figure
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-3xl overflow-hidden rounded-xl bg-white"
          >
            {viewing.image && (
              <img
                src={viewing.image}
                alt={viewing.caption ?? ""}
                className="max-h-[70svh] w-full bg-[#0f172a] object-contain"
              />
            )}
            <figcaption className="flex flex-wrap items-center justify-between gap-3 p-4">
              <form
                className="flex min-w-0 flex-1 items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void run(
                    () =>
                      catalogApi.updatePhoto(viewing.id, {
                        caption: caption.trim() || null,
                      }),
                    "Caption saved.",
                  ).then((saved) => saved && setViewing(null));
                }}
              >
                <label htmlFor="photo-caption" className="sr-only">
                  Caption
                </label>
                <input
                  id="photo-caption"
                  value={caption}
                  maxLength={255}
                  placeholder="Add a caption"
                  onChange={(event) => setCaption(event.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm text-[#0f172a] outline-none focus:border-[#262262]/40"
                />
                <button
                  type="submit"
                  disabled={busy || caption === (viewing.caption ?? "")}
                  className="rounded-lg bg-[#262262] px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
                >
                  Save
                </button>
              </form>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void run(
                      () => catalogApi.deletePhoto(viewing.id),
                      "Photo deleted.",
                    ).then((deleted) => deleted && setViewing(null))
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#c41e3a] hover:bg-[#fef2f2] disabled:opacity-50"
                >
                  <Trash2 aria-hidden className="size-4" />
                  Delete
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close"
                  onClick={() => setViewing(null)}
                  className="rounded-lg p-2 text-[#64748b] hover:bg-[#f1f5f9]"
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
