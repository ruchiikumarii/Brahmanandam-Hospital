import { useEffect } from "react";

/**
 * Reveals any `[data-reveal]` element as it scrolls into view.
 *
 * The hidden state is scoped to `.reveal-ready`, which this hook adds to
 * <html> only after it runs — so if JavaScript is unavailable, or the visitor
 * prefers reduced motion, every element stays visible.
 *
 * Two mechanisms work together:
 *  1. An IntersectionObserver drives the normal, gentle reveal on scroll.
 *  2. A rAF-debounced scroll sweep reveals anything already at or above the
 *     fold. IntersectionObserver coalesces notifications and can miss very
 *     fast jumps (anchor links, Ctrl+End, restored scroll positions), which
 *     would otherwise leave whole sections stuck invisible.
 *
 * A debounced MutationObserver picks up nodes added later by lazily loaded
 * routes, filtered lists and expanding panels.
 */
export function useScrollReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || !("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const reveal = (el: Element) => el.classList.add("is-revealed");
    const pending = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );

    let scanFrame = 0;
    const scan = () => {
      scanFrame = 0;
      pending().forEach((el) => io.observe(el));
    };
    const queueScan = () => {
      if (scanFrame) return;
      scanFrame = requestAnimationFrame(scan);
    };

    /* Safety net: anything the observer skipped past is revealed outright. */
    let sweepFrame = 0;
    const sweep = () => {
      sweepFrame = 0;
      const limit = window.innerHeight * 0.94;
      pending().forEach((el) => {
        if (el.getBoundingClientRect().top < limit) {
          reveal(el);
          io.unobserve(el);
        }
      });
    };
    const queueSweep = () => {
      if (sweepFrame) return;
      sweepFrame = requestAnimationFrame(sweep);
    };

    scan();

    const mo = new MutationObserver(queueScan);
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", queueSweep, { passive: true });
    window.addEventListener("resize", queueSweep, { passive: true });

    return () => {
      if (scanFrame) cancelAnimationFrame(scanFrame);
      if (sweepFrame) cancelAnimationFrame(sweepFrame);
      window.removeEventListener("scroll", queueSweep);
      window.removeEventListener("resize", queueSweep);
      mo.disconnect();
      io.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);
}

/** Staggers a list: `style={revealDelay(i)}`. Capped so long lists stay snappy. */
export function revealDelay(index: number, step = 70, max = 420) {
  return {
    "--reveal-delay": `${Math.min(index * step, max)}ms`,
  } as React.CSSProperties;
}
