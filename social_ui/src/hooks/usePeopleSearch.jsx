// src/hooks/usePeopleSearch.js
import { useEffect, useMemo, useRef, useState } from "react";

export default function usePeopleSearch(query, minLen = 2, delay = 300) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const ctrlRef = useRef(null);

  // very small debounce
  const debouncedQuery = useMemo(() => {
    let t;
    return {
      value: query,
      set(handler) {
        clearTimeout(t);
        t = setTimeout(handler, delay);
      },
      cancel() {
        clearTimeout(t);
      },
    };
  }, [delay, query]);

  useEffect(() => {
    if (!query || query.trim().length < minLen) {
      setResults([]);
      setLoading(false);
      return;
    }

    debouncedQuery.set(async () => {
      // cancel previous request
      if (ctrlRef.current) ctrlRef.current.abort();
      const ctrl = new AbortController();
      ctrlRef.current = ctrl;

      setLoading(true);
      try {
        // 👉 Replace with your real endpoint
        // Expected shape: [{ id, name, username, avatar, title, location }]
        const res = await fetch(`/api/people/search?q=${encodeURIComponent(query)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // const data = await res.json();
        // setResults(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") {
          // optional: show a toast
           setResults([]);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => {
      debouncedQuery.cancel();
      if (ctrlRef.current) ctrlRef.current.abort();
    };
  }, [query, minLen, debouncedQuery]);

  return { results, loading };
}
