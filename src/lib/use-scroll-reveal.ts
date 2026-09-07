import { useEffect } from "react";

/**
 * Scroll animation for the whole site, driven by GSAP ScrollTrigger.
 *
 * The markup contract is unchanged -- 111 elements across the site already
 * carry `data-reveal`, so the hook keeps that attribute as its API and simply
 * animates it better:
 *
 *   data-reveal            rises and fades in
 *   data-reveal="left"     slides in from the left  (>= 1024px only)
 *   data-reveal="right"    slides in from the right (>= 1024px only)
 *   data-reveal="zoom"     scales up from 96.5%
 *   data-reveal="fade"     opacity only
 *   data-parallax="-70"    drifts by that many px across its section
 *
 * Horizontal offsets are held back below 1024px on purpose: a transform still
 * counts towards scrollWidth, and on a narrow screen a 26px slide is enough to
 * put a scrollbar under the page.
 *
 * Three things keep it safe:
 *
 *  - Nothing is hidden until this runs, and `reveal-ready` is what hides it, so
 *    a visitor without JavaScript sees the finished page.
 *  - GSAP is loaded from a separate chunk, so it costs nothing until the page
 *    is interactive. If that chunk never arrives, a timer un-hides everything
 *    rather than leaving the site blank.
 *  - `prefers-reduced-motion` returns before any of it happens.
 */
export function useScrollReveal(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("reveal-ready");

    let disposed = false;
    let dispose = () => {};

    /* A chunk that never loads must not leave the page invisible. */
    const failsafe = window.setTimeout(() => {
      root.classList.remove("reveal-ready");
    }, 2500);

    void (async () => {
      let gsap: typeof import("gsap").gsap;
      let ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
      try {
        [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      } catch {
        root.classList.remove("reveal-ready");
        return;
      }
      window.clearTimeout(failsafe);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);

      const wide = window.matchMedia("(min-width: 1024px)");

      const startState = (variant: string) => {
        if (variant === "fade") return { opacity: 0 };
        if (variant === "zoom") return { opacity: 0, scale: 0.965 };
        if ((variant === "left" || variant === "right") && wide.matches) {
          return { opacity: 0, x: variant === "left" ? -26 : 26 };
        }
        return { opacity: 0, y: 24 };
      };

      const ctx = gsap.context(() => {
        /* ------------------------------------------------------- reveals */
        const arm = () => {
          const fresh = [
            ...document.querySelectorAll<HTMLElement>("[data-reveal]"),
          ].filter((el) => !el.dataset.revealState);
          if (!fresh.length) return false;

          const groups = new Map<string, HTMLElement[]>();
          for (const el of fresh) {
            el.dataset.revealState = "armed";
            const variant = el.getAttribute("data-reveal") || "up";
            const list = groups.get(variant) ?? [];
            list.push(el);
            groups.set(variant, list);
          }

          for (const [variant, list] of groups) {
            gsap.set(list, startState(variant));
            ScrollTrigger.batch(list, {
              start: "top 92%",
              once: true,
              /* Small batches on purpose. Collecting a whole section into one
                 batch and staggering it puts the last card more than a second
                 behind the first, which reads as lag rather than rhythm. */
              interval: 0.08,
              batchMax: 6,
              onEnter: (batch) => {
                /* `.is-revealed` is what the EKG line's stroke draw hangs off,
                   so it has to go on when the tween starts, not after. */
                batch.forEach((el) => el.classList.add("is-revealed"));
                gsap.to(batch, {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  duration: 0.72,
                  ease: "power2.out",
                  stagger: { each: 0.06 },
                  overwrite: "auto",
                  /* Leave the DOM as it was found, so hover transforms on the
                     cards are not fighting an inline transform afterwards. */
                  clearProps: "transform,opacity",
                });
              },
            });
          }
          return true;
        };

        /* ------------------------------------------------------ parallax */
        const armParallax = () => {
          for (const el of document.querySelectorAll<HTMLElement>(
            "[data-parallax]",
          )) {
            if (el.dataset.parallaxState) continue;
            el.dataset.parallaxState = "armed";
            const distance = Number(el.dataset.parallax || "-70");
            if (!Number.isFinite(distance)) continue;
            gsap.to(el, {
              y: distance,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("section") ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }
        };

        const armAll = () => {
          const added = arm();
          armParallax();
          return added;
        };

        armAll();

        /* Lazily loaded routes, filtered lists and expanding panels add nodes
           after this runs, so watch for them. Refreshing ScrollTrigger is the
           expensive half, so it is rate limited rather than run per mutation. */
        let frame = 0;
        let lastRefresh = 0;
        const queue = () => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            const added = armAll();
            const now = performance.now();
            if (added || now - lastRefresh > 400) {
              lastRefresh = now;
              ScrollTrigger.refresh();
            }
          });
        };
        const mo = new MutationObserver(queue);
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
          if (frame) cancelAnimationFrame(frame);
          mo.disconnect();
        };
      });

      dispose = () => ctx.revert();
    })();

    return () => {
      disposed = true;
      window.clearTimeout(failsafe);
      dispose();
      root.classList.remove("reveal-ready");
    };
  }, [enabled]);
}

/**
 * Kept for the call sites that stagger a list themselves. The reveal batches
 * add their own stagger now, so this only feeds the CSS animation delay on the
 * EKG stroke draw.
 */
export function revealDelay(index: number, step = 70, max = 420) {
  return {
    "--reveal-delay": `${Math.min(index * step, max)}ms`,
  } as React.CSSProperties;
}
