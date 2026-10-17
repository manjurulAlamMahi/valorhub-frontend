import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import { CircleCheck, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  galleryCategories,
  galleryPhotos,
  type GalleryCategory,
  type GalleryPhoto,
} from "../data/gallery";

type Filter = "All" | GalleryCategory;

export default function Gallery() {
  const [photos, setPhotos] = useState(galleryPhotos);
  const [filter, setFilter] = useState<Filter>("All");
  const [viewing, setViewing] = useState<GalleryPhoto | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const visible =
    filter === "All"
      ? photos
      : photos.filter((photo) => photo.category === filter);

  useEffect(() => {
    if (!viewing) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setViewing(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [viewing]);

  const addFiles = (files: FileList | null) => {
    const images = Array.from(files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (!images.length) return;
    setPhotos((prev) => [
      ...prev,
      ...images.map((file) => ({
        id: crypto.randomUUID(),
        // Local preview only until uploads are wired to the API
        src: URL.createObjectURL(file),
        caption: file.name.replace(/\.[^.]+$/, ""),
        category: filter === "All" ? "Project Photos" : filter,
      })),
    ]);
  };

  const remove = (photo: GalleryPhoto) => {
    if (photo.src.startsWith("blob:")) URL.revokeObjectURL(photo.src);
    setPhotos((prev) => prev.filter((item) => item.id !== photo.id));
    setViewing(null);
  };

  const fileInput = (
    <input
      type="file"
      accept="image/*"
      multiple
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
            {(["All", ...galleryCategories] as Filter[]).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={filter === value}
                aria-controls="photo-grid"
                onClick={() => setFilter(value)}
                className={cn(
                  "h-7 rounded-full px-3.5 text-xs leading-4 font-semibold transition-colors",
                  filter === value
                    ? "bg-[#262262] text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]",
                )}
              >
                {value}
              </button>
            ))}
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#262262] px-4 py-2 text-sm leading-5 font-semibold text-white focus-within:ring-3 focus-within:ring-[#262262]/30 hover:bg-[#211d53]">
            {fileInput}
            <Plus aria-hidden className="size-4" />
            Add Photos
          </label>
        </div>

        <p className="flex items-center gap-3 rounded-xl bg-[linear-gradient(178deg,#f0f7ff_0%,#eef2ff_100%)] px-4 py-3 text-sm leading-5 font-bold text-[#262262]">
          <CircleCheck aria-hidden className="size-5 shrink-0" />
          Elite Plan: Unlimited gallery images. Currently using {photos.length}.
        </p>

        <ul
          id="photo-grid"
          role="tabpanel"
          className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4 bg-white pt-6 pb-5 sm:grid-cols-[repeat(auto-fill,9.1875rem)]"
        >
          {visible.map((photo) => (
            <li key={photo.id} className="space-y-1.5">
              <button
                type="button"
                onClick={() => setViewing(photo)}
                className="block aspect-147/110 w-full overflow-hidden rounded-[10px] bg-white focus-visible:ring-3 focus-visible:ring-[#262262]/40 focus-visible:outline-none"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="size-full object-cover transition-transform hover:scale-105"
                />
              </button>
              <p className="truncate text-[11px] text-[#26225f]/70">
                {photo.caption}
              </p>
            </li>
          ))}
          <li>
            <label className="flex aspect-147/110 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed border-[#26225f]/25 text-[#26225f] focus-within:ring-3 focus-within:ring-[#262262]/30 hover:bg-[#f8fafc]">
              {fileInput}
              <Plus aria-hidden className="size-4" strokeWidth={2.5} />
              <span className="text-[11px] text-[#26225f]/70">Add Photo</span>
            </label>
          </li>
        </ul>
      </div>

      {viewing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={viewing.caption}
          onClick={() => setViewing(null)}
          className="fixed inset-0 z-60 grid place-items-center bg-[#0f172a]/80 p-4"
        >
          <figure
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-3xl overflow-hidden rounded-xl bg-white"
          >
            <img
              src={viewing.src}
              alt={viewing.caption}
              className="max-h-[70svh] w-full bg-[#0f172a] object-contain"
            />
            <figcaption className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#0f172a]">
                  {viewing.caption}
                </p>
                <p className="text-xs text-[#64748b]">{viewing.category}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => remove(viewing)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#c41e3a] hover:bg-[#fef2f2]"
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
