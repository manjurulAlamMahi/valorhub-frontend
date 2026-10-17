import { useEffect } from "react";

/**
 * usePageMeta
 *
 * Lightweight hook for updating the page title and description
 * on dynamic pages (e.g. individual professional profiles, category pages)
 * WITHOUT importing react-helmet-async directly in every component.
 *
 * For full OG / Twitter / JSON-LD support, use the <SEO /> component instead.
 * This hook is for simple title/description-only updates.
 *
 * Usage:
 *   usePageMeta({
 *     title: professional.name,
 *     description: professional.bio,
 *   })
 */

interface PageMetaOptions {
  title: string;
  description?: string;
}

const SITE_NAME = "ValorHub";

export function usePageMeta({ title, description }: PageMetaOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | ${SITE_NAME}`;

    let metaDesc = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    if (description) {
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      const prevContent = metaDesc.content;
      metaDesc.content = description;

      return () => {
        document.title = prevTitle;
        if (metaDesc) metaDesc.content = prevContent;
      };
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description]);
}
