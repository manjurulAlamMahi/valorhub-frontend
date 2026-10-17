import { Helmet } from "react-helmet-async";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SEOProps {
  /** Page-level title. Will be formatted as: "{title} | ValorHub" */
  title: string;
  /** 150–160 char description for search snippets */
  description: string;
  /** Canonical URL for this page. Always use the full absolute URL. */
  canonical?: string;
  /**
   * Absolute URL to a 1200×630 image for OG / Twitter previews.
   * Falls back to the default OG image if omitted.
   */
  ogImage?: string;
  /** Set to 'noindex, nofollow' for private/admin pages */
  robots?: string;
  /** Extra <script type="application/ld+json"> blocks (JSON-LD schema) */
  jsonLd?: object | object[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SITE_NAME = "ValorHub";
const BASE_URL = "https://valorhub.com";
const DEFAULT_OG = `${BASE_URL}/og/default.png`;

// ─── Component ────────────────────────────────────────────────────────────────

export function SEO({
  title,
  description,
  canonical,
  ogImage,
  robots = "index, follow",
  jsonLd,
}: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const pageUrl =
    canonical ??
    (typeof window !== "undefined" ? window.location.href : BASE_URL);
  const image = ogImage ?? DEFAULT_OG;

  // Normalise jsonLd → always an array so we can map over it
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      {/* ── Primary ──────────────────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={pageUrl} />

      {/* ── Open Graph ───────────────────────────────────────────── */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* ── Twitter / X ──────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ── JSON-LD structured data ───────────────────────────────── */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
