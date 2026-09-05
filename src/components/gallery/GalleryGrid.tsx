import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "@/components/ui/Img";
import {
  galleryCategories,
  galleryItems,
  type GalleryCategory,
} from "@/lib/data/gallery";
import { cn } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";

export function GalleryGrid() {
  const [category, setCategory] = useState<GalleryCategory | "all">("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = useMemo(
    () =>
      category === "all"
        ? galleryItems
        : galleryItems.filter((g) => g.category === category),
    [category],
  );

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (delta: number) =>
      setLightbox((i) =>
        i === null ? i : (i + delta + items.length) % items.length,
      ),
    [items.length],
  );

  /* Keyboard control + scroll lock while the lightbox is open. */
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, close, step]);

  const active = lightbox === null ? null : items[lightbox];

  return (
    <>
      <div
        role="tablist"
        aria-label="Gallery categories"
        className="no-scrollbar -mx-1 flex max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-card sm:mx-auto sm:w-fit"
      >
        {galleryCategories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            type="button"
            aria-selected={category === cat.id}
            onClick={() => {
              setCategory(cat.id);
              setLightbox(null);
            }}
            className={cn(
              "h-10 shrink-0 rounded-full px-4 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors",
              category === cat.id
                ? "bg-primary text-white"
                : "text-muted hover:bg-[rgba(47,59,128,.06)] hover:text-primary",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li
            key={item.src + item.caption}
            data-reveal
            style={revealDelay(i % 3, 90)}
          >
            <button
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative block w-full overflow-hidden rounded-[1.125rem] border border-line bg-white text-left shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="relative block aspect-[16/9] overflow-hidden bg-tint">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  loading={i < 3 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[rgba(28,36,80,.72)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-3 right-3 grid h-9 w-9 scale-90 place-items-center rounded-full bg-white/92 text-primary opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                >
                  <Expand size={16} />
                </span>
              </span>
              <span className="block px-4 py-3.5 text-[0.875rem] font-semibold text-primary">
                {item.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(19,24,54,.92)] p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/25"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/25 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>

          <figure
            className="max-h-full w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              priority
              className="max-h-[72vh] w-full rounded-[1.125rem] object-contain"
            />
            <figcaption className="mt-4 text-center">
              <p className="text-[1rem] font-bold text-white">{active.caption}</p>
              <p className="mt-1 text-[0.8125rem] text-white/60">
                {lightbox! + 1} of {items.length}
              </p>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
            className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/25 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      ) : null}
    </>
  );
}
