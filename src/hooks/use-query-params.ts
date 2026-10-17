import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";

const SCROLL_KEY = "scroll";

export default function useQueryParams(restoreScroll = false) {
  const [searchParams, setSearchParams] = useSearchParams();
  const restoreScrollRef = useRef(restoreScroll);

  useEffect(() => {
    if (!restoreScrollRef.current) return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const saved = sessionStorage.getItem(SCROLL_KEY);

    if (saved) {
      const timer = setTimeout(() => {
        window.scrollTo({ top: parseInt(saved), behavior: "instant" });
        sessionStorage.removeItem(SCROLL_KEY);
      }, 100);
      return () => clearTimeout(timer);
    }

    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);

  useEffect(() => {
    if (!restoreScrollRef.current) return;
    return () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    };
  }, []);

  const removeQuery = useCallback(
    (queryIds: string[]) => {
      setSearchParams(
        (prev) => {
          queryIds.forEach((id) => prev.delete(id));
          return prev;
        },
        // only prevent scroll reset if restoreScroll is true
        { preventScrollReset: restoreScrollRef.current },
      );
    },
    [setSearchParams],
  );

  const setQuery = useCallback(
    (query: { queryId: string; queryValue: string }[]) => {
      setSearchParams(
        (prev) => {
          query.forEach(({ queryId, queryValue }) =>
            prev.set(queryId, queryValue),
          );
          return prev;
        },
        // only prevent scroll reset if restoreScroll is true
        { preventScrollReset: restoreScrollRef.current },
      );
    },
    [setSearchParams],
  );

  const getQuery = useCallback(
    (queryId: string) => searchParams.get(queryId),
    [searchParams],
  );

  return { removeQuery, setQuery, getQuery };
}
