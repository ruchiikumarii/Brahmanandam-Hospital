import { ExternalLink, PenLine, Star } from "lucide-react";
import { site } from "@/lib/data/site";
import { Section, SectionHeading, Stars } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";

/**
 * Live Google Business Profile block.
 *
 * The rating, review count and quoted reviews come from `site.google`. Those
 * fields are deliberately null until someone copies the real numbers off the
 * hospital's Google listing (or wires up the Places API) — this section never
 * invents a score. With them unset it still does its job: it points visitors
 * at the real listing to read and leave reviews.
 */
export function GoogleReviews() {
  const { rating, reviewCount, listingUrl } = site.google;
  const hasScore = typeof rating === "number" && typeof reviewCount === "number";

  return (
    <Section tone="white">
      <SectionHeading
        eyebrow="Google Reviews"
        title="What Patients Say on Google"
        subtitle="Read verified reviews from patients and families across Jamshedpur on our Google Business listing."
      />

      <div
        data-reveal
        className="mx-auto mt-9 max-w-3xl overflow-hidden rounded-[1.25rem] border border-line bg-white shadow-card"
      >
        <div className="flex flex-col items-center gap-5 p-7 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
          <span
            aria-hidden="true"
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[rgba(47,59,128,.05)]"
          >
            {/* Google "G" */}
            <svg width="30" height="30" viewBox="0 0 48 48">
              <path
                fill="#4285F4"
                d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.1z"
              />
              <path
                fill="#34A853"
                d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.6-3.9-12.3-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46z"
              />
              <path
                fill="#FBBC05"
                d="M11.7 28.1c-.4-1.3-.7-2.7-.7-4.1s.2-2.8.7-4.1v-5.7H4.3A22 22 0 0 0 2 24c0 3.6.9 6.9 2.3 9.8l7.4-5.7z"
              />
              <path
                fill="#EA4335"
                d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 7.9 6.9 4.3 14.1l7.4 5.7c1.7-5.2 6.6-9 12.3-9z"
              />
            </svg>
          </span>

          <div className="min-w-0 flex-1">
            {hasScore ? (
              <>
                <p className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                  <span className="font-display text-[2.5rem] leading-none font-extrabold text-primary">
                    {rating.toFixed(1)}
                  </span>
                  <Stars rating={rating} size={18} />
                </p>
                <p className="mt-2 text-[0.9375rem] text-muted">
                  Based on{" "}
                  <strong className="font-bold text-ink">
                    {reviewCount.toLocaleString("en-IN")} Google reviews
                  </strong>{" "}
                  for {site.legalName}.
                </p>
              </>
            ) : (
              <>
                <p className="text-[1.125rem] font-extrabold text-primary">
                  {site.legalName} on Google
                </p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                  Ratings and reviews are shown live on our Google Business
                  listing. Open it to read what patients say — or add your own
                  after a visit.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-line bg-[rgba(47,59,128,.03)] p-5 sm:flex-row sm:justify-center">
          <a
            href={listingUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[0.875rem] font-bold text-white transition-colors hover:bg-primary-800"
          >
            <Star size={16} strokeWidth={2.2} />
            Read Reviews on Google
            <ExternalLink size={14} />
          </a>
          <a
            href={listingUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-6 text-[0.875rem] font-bold text-primary transition-colors hover:bg-[rgba(47,59,128,.05)]"
          >
            <PenLine size={16} strokeWidth={2.2} />
            Write a Review
          </a>
        </div>
      </div>

      {site.google.reviews.length ? (
        <ul className="mx-auto mt-4 grid max-w-5xl gap-4 md:grid-cols-3">
          {site.google.reviews.map((r, i) => (
            <li key={r.name} data-reveal style={revealDelay(i, 90)}>
              <figure className="flex h-full flex-col rounded-[1.125rem] border border-line bg-white p-5 shadow-card">
                <Stars rating={r.rating} size={14} />
                <blockquote className="mt-3 text-[0.875rem] leading-[1.7] text-ink italic">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-[0.75rem] font-bold text-white">
                    {r.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.875rem] font-bold text-primary">
                      {r.name}
                    </span>
                    <span className="block text-[0.75rem] text-muted">
                      {r.when} · Google review
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}
