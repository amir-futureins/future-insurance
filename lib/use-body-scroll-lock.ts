'use client';

import { useEffect } from 'react';

/**
 * Ref-counted body scroll lock shared by every modal. Multiple modals can be
 * open at once (e.g. an exit-intent popup firing over an already-open form);
 * the background only unlocks when the LAST one closes, and the original
 * overflow value is restored exactly once — preventing the permanent-lock race
 * that a per-modal `document.body.style.overflow` toggle would cause.
 */
let lockCount = 0;
let savedOverflow = '';

export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    if (lockCount === 0) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;
    return () => {
      lockCount -= 1;
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.style.overflow = savedOverflow;
      }
    };
  }, [active]);
}
