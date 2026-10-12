import { useEffect } from "react";

// Keeps the tab title and meta description in step with the current page during client-side navigation.
// (The static HTML for each route already carries the right values for first load and search engines.)
export function usePageMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [title, description]);
}
