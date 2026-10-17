import { SEO } from "@/components/seo/SEO";
import { Link } from "react-router";

export function NotFound() {
  return (
    <>
      {/* noindex — 404 pages should never appear in search results */}
      <SEO
        title="Page Not Found"
        description="This page doesn't exist."
        robots="noindex, nofollow"
      />
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-bold">404 — Page Not Found</h1>
        <p className="text-muted-foreground">
          That page doesn't exist. Let's get you back on track.
        </p>
        <Link to="/" className="underline">
          Back to home
        </Link>
      </main>
    </>
  );
}
