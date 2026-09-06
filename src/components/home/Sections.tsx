import Image from "@/components/ui/Img";
import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import {
  facilities,
  insurancePartners,
  testimonials,
} from "@/lib/data/content";
import { getBlogPosts } from "@/lib/cms/blog-store";
import { FacilityCard } from "@/components/cards/FacilityCard";
import { Section, SectionHeading, Stars, cn } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";

/* ------------------------------------------------- Departments & Facilities */

export function FacilitiesSection() {
  return (
    <Section tone="lavender">
      <SectionHeading
        eyebrow="Infrastructure"
        title={
          <span className="tracking-[-0.01em] uppercase">
            Departments &amp; Facilities
          </span>
        }
        subtitle="Modern clinical spaces engineered for acute interventions, zero hospital-acquired infections, and peaceful patient recovery."
        ekg={false}
      />
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility, i) => (
          <FacilityCard
            key={facility.slug}
            facility={facility}
            style={revealDelay(i % 3, 90)}
          />
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- Insurance */

export function InsuranceSection() {
  return (
    <Section tone="soft" backdrop="soft">
      <div
        data-reveal
        className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card sm:p-9 lg:p-11"
      >
        <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <p className="eyebrow">Hassle-Free Billing</p>
            <h2 className="mt-3 text-[1.5rem] leading-tight font-extrabold sm:text-[1.75rem]">
              22+ TPA / Insurance Partners with Instant Cashless Support
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
              Our dedicated Cashless Desk assists you with pre-authorization,
              seamless claim documentation, and zero out-of-pocket stress during
              medical emergencies.
            </p>
            <Link
              to="/insurance"
              className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-bold text-primary transition-colors hover:text-secondary"
            >
              Inquire About Your Policy Coverage
              <ArrowRight size={17} strokeWidth={2.2} />
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {insurancePartners.map((partner, i) => (
              <li
                key={partner.name}
                data-reveal="zoom"
                style={revealDelay(i, 65)}
                className="rounded-xl bg-[rgba(47,59,128,.05)] px-3 py-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(47,59,128,.09)]"
              >
                <p className="text-[0.9375rem] font-extrabold text-primary">
                  {partner.name}
                </p>
                <p className="mt-1 text-[0.75rem] font-semibold text-success">
                  {partner.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------- Testimonials */

export function TestimonialsSection({ limit = 3 }: { limit?: number } = {}) {
  return (
    <Section tone="lavender">
      <SectionHeading
        eyebrow="Patient Stories"
        title="What Our Patients Say"
        subtitle="Real experiences from families across Jamshedpur treated with clinical diligence at Sonari."
      />
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, limit).map((item, i) => (
          <li key={item.name} data-reveal style={revealDelay(i, 100)}>
            <figure className="flex h-full flex-col rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
              <div className="flex items-start justify-between">
                <Stars rating={item.rating} size={15} />
                <Quote size={22} className="text-[rgba(47,59,128,.12)]" aria-hidden="true" />
              </div>
              <blockquote className="mt-4 text-[0.9375rem] leading-[1.75] text-ink italic">
                &ldquo;{item.text}&rdquo;
              </blockquote>
              <figcaption className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
                <div>
                  <p className="text-[0.9375rem] font-extrabold text-primary">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] text-muted">
                    {item.location}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-[rgba(15,157,110,.09)] px-2.5 py-1 text-[0.6875rem] font-bold text-success">
                  {item.badge}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------------ Blog */

export function BlogSection({ limit = 3 }: { limit?: number } = {}) {
  // Merged CMS + hand-written posts, already visibility-filtered and sorted.
  const posts = getBlogPosts().slice(0, limit);

  return (
    <Section tone="white">
      <div
        data-reveal
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <p className="eyebrow">Health Knowledge</p>
          <h2 className="mt-2 text-[1.75rem] leading-tight font-extrabold sm:text-[2.15rem]">
            Latest Medical Insights
          </h2>
          <p className="mt-2.5 max-w-xl text-[0.9375rem] text-muted">
            Preventive wellness guidance and specialist articles by our senior
            doctors.
          </p>
        </div>
        <Link
          to="/blog"
          className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-primary px-6 text-[0.8125rem] font-bold text-white transition-colors hover:bg-primary-800 md:self-auto"
        >
          VIEW ALL BLOGS
          <ArrowRight size={16} strokeWidth={2.3} />
        </Link>
      </div>

      <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <article
            key={post.slug}
            data-reveal
            style={revealDelay(i, 90)}
            className="group flex h-full flex-col overflow-hidden rounded-[1.125rem] border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="relative aspect-[450/218] w-full overflow-hidden bg-tint">
              <Image
                src={post.featured_image ?? "/images/general/hospital-exterior.jpg"}
                alt={post.title}
                fill
                loading="lazy"
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[0.75rem] font-bold",
                    i % 2 === 0
                      ? "bg-[rgba(190,53,58,.07)] text-secondary"
                      : "bg-[rgba(47,59,128,.07)] text-primary",
                  )}
                >
                  {post.category}
                </span>
                <time
                  dateTime={post.publish_at ?? undefined}
                  className="text-[0.8125rem] text-muted"
                >
                  {post.publish_at
                    ? new Date(post.publish_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "Asia/Kolkata",
                      })
                    : ""}
                </time>
              </div>
              <h3 className="mt-3 text-[1.0625rem] leading-snug font-extrabold">
                {post.title}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                {post.excerpt}
              </p>
              <Link
                to={`/blog/${post.slug}`}
                className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.875rem] font-bold text-primary transition-colors hover:text-secondary"
              >
                Read Full Article
                <ArrowRight size={15} strokeWidth={2.3} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
