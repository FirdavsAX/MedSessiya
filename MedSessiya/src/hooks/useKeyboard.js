import { useEffect } from 'react';

/**
 * handlers:
 *   onOption(index) — 1-9 tugmalari
 *   onNext()        — Enter yoki ArrowRight
 *   onPrev()        — ArrowLeft
 *   onEscape()      — Escape
 */
export function useKeyboard(handlers) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key >= '1' && e.key <= '9') {
        handlers.onOption?.(parseInt(e.key) - 1);
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        handlers.onNext?.();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlers.onPrev?.();
      } else if (e.key === 'Escape') {
        handlers.onEscape?.();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlers]);
}
