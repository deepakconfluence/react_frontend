import { useEffect, useRef } from 'react';

/**
 * Replaces Angular's `auto-focus.directive.ts`.
 *
 * @example
 * const ref = useAutoFocus<HTMLInputElement>();
 * return <input ref={ref} />
 */
export function useAutoFocus<T extends HTMLElement = HTMLInputElement>(active = true) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (active && ref.current) {
      ref.current.focus();
    }
  }, [active]);

  return ref;
}
