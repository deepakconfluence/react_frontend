import { useEffect, useState } from 'react';

/**
 * Persist a value to localStorage and keep it in sync with React state.
 * Replaces Angular's `local-storage.service.ts`.
 */
export function useLocalStorage<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded — ignore */
    }
  }, [key, value]);

  return [value, setValue];
}
