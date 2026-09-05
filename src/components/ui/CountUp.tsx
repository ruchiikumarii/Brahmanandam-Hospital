import { useEffect, useRef, useState } from "react";

/**
 * Counts a numeric statistic up once it scrolls into view.
 *
 * Accepts the display string ("22+", "10,000+", "24×7", "4.9★") and only
 * animates when it starts with a plain number; anything else renders as-is.
 * Respects `prefers-reduced-motion`.
 */
export function CountUp({
  value,
  duration = 1400,
  className = "",
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const match = /^([\d,]+(?:\.\d+)?)(.*)$/.exec(value.trim());
  const target = match ? Number(match[1].replace(/,/g, "")) : NaN;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(".") ? 1 : 0;
  const grouped = Boolean(match && match[1].includes(","));
  const animatable = Boolean(match) && Number.isFinite(target);

  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(animatable ? null : value);

  useEffect(() => {
    if (!animatable) return;
    const node = ref.current;
    if (!node) return;

    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      const out = grouped
        ? Number(fixed).toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : fixed;
      return out + suffix;
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      setDisplay(format(target));
      return;
    }

    setDisplay(format(0));
    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast start, gentle settle
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setDisplay(format(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(node);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [animatable, target, suffix, decimals, grouped, duration]);

  return (
    <span ref={ref} className={className}>
      {/* Reserve the final width so the layout never jumps mid-count. */}
      <span aria-hidden="true" className="invisible block h-0 overflow-hidden">
        {value}
      </span>
      <span aria-label={value}>{display ?? value}</span>
    </span>
  );
}
