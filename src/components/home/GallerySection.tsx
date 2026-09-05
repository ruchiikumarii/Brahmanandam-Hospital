import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Image from "@/components/ui/Img";
import { galleryItems } from "@/lib/data/gallery";
import { Section, SectionHeading } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";

/** Compact gallery strip shown on the homepage; links through to /gallery. */
export function GallerySection() {
  const preview = galleryItems.slice(0, 6);

  return (
    <Section tone="white">
      <SectionHeading
        eyebrow="Hospital Gallery"
        title="A Look Inside Our Sonari Campus"
        subtitle="Emergency wing, critical care units, modular operation theatres, diagnostics and in-house pharmacy."
      />

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {preview.map((item, i) => (
          <li key={item.src + item.caption} data-reveal style={revealDelay(i % 3, 90)}>
            <Link
              to="/gallery"
              className="group relative block overflow-hidden rounded-[1.125rem] border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="relative block aspect-[16/10] overflow-hidden bg-tint">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[rgba(28,36,80,.78)] via-[rgba(28,36,80,.15)] to-transparent"
                />
                <span className="absolute inset-x-4 bottom-3.5 text-[0.875rem] font-bold text-white">
                  {item.caption}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center">
        <Link
          to="/gallery"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[0.875rem] font-bold text-white transition-colors hover:bg-primary-800"
        >
          View Full Gallery
          <ArrowRight size={16} strokeWidth={2.3} />
        </Link>
      </p>
    </Section>
  );
}
