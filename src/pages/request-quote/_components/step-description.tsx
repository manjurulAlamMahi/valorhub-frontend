import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { requestQuote } from "../data/request-quote";

const { description: copy } = requestQuote;
const { upload } = copy;

type StepDescriptionProps = {
  description: string;
  photos: File[];
  error?: string;
  onDescriptionChange: (value: string) => void;
  onPhotosChange: (photos: File[]) => void;
};

export default function StepDescription({
  description,
  photos,
  error,
  onDescriptionChange,
  onPhotosChange,
}: StepDescriptionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const previews = useMemo(
    () => photos.map((file) => URL.createObjectURL(file)),
    [photos],
  );
  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews],
  );

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const accepted: File[] = [];
    let rejected = false;

    for (const file of Array.from(files)) {
      if (!upload.accept.includes(file.type) || file.size > upload.maxSize) {
        rejected = true;
        continue;
      }
      accepted.push(file);
    }

    const next = [...photos, ...accepted].slice(0, upload.maxFiles);
    setUploadError(
      rejected
        ? `Only ${upload.hint.replace(" up to", " files up to")} are allowed.`
        : photos.length + accepted.length > upload.maxFiles
          ? `You can upload up to ${upload.maxFiles} photos.`
          : "",
    );
    onPhotosChange(next);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  return (
    <div>
      <label htmlFor="quote-description" className="sr-only">
        {copy.title}
      </label>
      <textarea
        id="quote-description"
        value={description}
        maxLength={copy.max}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder={copy.placeholder}
        aria-invalid={Boolean(error)}
        className="min-h-37.5 w-full resize-y rounded-[14px] border border-[#e8ecf4] p-4.25 text-sm leading-5 text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c92032]"
      />
      {error && <p className="pt-2 text-sm text-[#c92032]">{error}</p>}

      {requestQuote.photoUploads && (
        <div className="space-y-2 pt-4">
          <p className="text-sm leading-5 font-medium text-[#364153]">
            {upload.label}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={upload.accept.join(",")}
            multiple
            hidden
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "mt-1.5 flex w-full flex-col items-center justify-center gap-1.5 rounded-[22px] border-2 border-dashed border-[#e5e7eb] p-6.5 text-center transition-colors hover:border-[#cbd2e1]",
              { "border-secondary-foreground bg-secondary/50": dragging },
            )}
          >
            <Upload aria-hidden className="size-6 text-[#6a7282]" />
            <span className="text-sm leading-5 text-[#6a7282]">
              {upload.prompt}
            </span>
            <span className="text-xs leading-4 text-[#99a1af]">
              {upload.hint}
            </span>
          </button>
          {uploadError && (
            <p className="text-sm text-[#c92032]">{uploadError}</p>
          )}

          {photos.length > 0 && (
            <ul className="flex flex-wrap gap-3 pt-2">
              {photos.map((file, index) => (
                <li key={`${file.name}-${index}`} className="relative">
                  <img
                    src={previews[index]}
                    alt={file.name}
                    className="size-20 rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      onPhotosChange(photos.filter((_, i) => i !== index))
                    }
                    className="absolute -top-2 -right-2 grid size-6 place-content-center rounded-full bg-[#111827] text-white"
                  >
                    <X aria-hidden className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
