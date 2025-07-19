import { useState, useCallback } from "react";

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (val: T) => void] => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setLocal = useCallback(
    (val: T) => {
      setState(val);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(key, JSON.stringify(val));
        } catch {
          // ignore write errors
        }
      }
    },
    [key]
  );

  return [state, setLocal];
};
