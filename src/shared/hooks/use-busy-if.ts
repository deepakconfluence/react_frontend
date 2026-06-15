/**
 * Replaces Angular's `busy-if.directive.ts` / `button-busy.directive.ts`.
 * Returns props you can spread onto a button to disable + show a spinner.
 *
 * @example
 * const busy = useBusyIf(mutation.isPending);
 * <button {...busy}>Save</button>
 */
export function useBusyIf(isBusy: boolean) {
  return {
    disabled: isBusy,
    'aria-busy': isBusy,
    'data-busy': isBusy ? 'true' : undefined,
  };
}
