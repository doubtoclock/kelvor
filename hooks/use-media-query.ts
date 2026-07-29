import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia(query);
    setValue(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setValue(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  // Return null on server-side to avoid hydration mismatch
  if (!mounted) return null;

  return value;
}
