import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Appears once the visitor is well down a long page. Sits clear of the mobile tab bar. */
export function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setShown(window.scrollY > 900);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={`no-print fixed right-4 bottom-[4.5rem] z-40 grid h-11 w-11 place-items-center rounded-full bg-primary text-white shadow-[0_10px_28px_-10px_rgba(47,59,128,.9)] transition-all duration-300 hover:bg-primary-800 xl:right-6 xl:bottom-6 ${
        shown
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-3 scale-90 opacity-0"
      }`}
    >
      <ArrowUp size={19} strokeWidth={2.4} />
    </button>
  );
}
