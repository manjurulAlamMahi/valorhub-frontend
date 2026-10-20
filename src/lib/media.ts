import { API_URL } from "./api";

// Mirrors Backend HandlesUploads::uploadUrl — seeded demo media lives in public/assets, uploads on the public disk
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.replace(/^\/+/, "");
  return clean.startsWith("assets/") || clean.startsWith("storage/")
    ? `${API_URL}/${clean}`
    : `${API_URL}/storage/${clean}`;
}

// "$149" + "per inspection" → "$149 per inspection"; "/hr" units stay attached
export function formatPrice(price: number | null, unit?: string | null) {
  if (price === null) return null;
  const amount = `$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (!unit) return amount;
  return unit.startsWith("/") ? `${amount}${unit}` : `${amount} ${unit}`;
}
