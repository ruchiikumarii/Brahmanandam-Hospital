import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, UserRound } from "lucide-react";
import Image from "@/components/ui/Img";
import { getBlogPost, getBlogPosts } from "@/lib/cms/blog-store";
import { pickRelated } from "@/lib/cms/posts";
import { BlockList, RichText } from "@/components/blog/BlockList";
import { blogPostJsonLd } from "@/lib/seo/route-meta";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { cn } from "@/components/ui";
import NotFoundPage from "@/pages/NotFound";

const IST = "Asia/Kolkata";

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getBlogPost(slug) : undefined;

  // Unknown or unpublished slug -> the real 404 page. The prerender never
  // writes an HTML file for it, so the host returns a genuine 404 status.
  if (!article) return <NotFoundPage />;

  const all = getBlogPosts();
  const others = pickRelated(article, all, 2);

  const published = article.publish_at
    ? new Date(article.publish_at).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric", timeZone: IST,
      })
    : "";

  const faqLd = article.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <Seo
        crumbs={[
          { label: "Health Blog", href: "/blog" },
          { label: article.category ?? "Article" },
        ]}
        image={article.og_image ?? article.featured_image ?? undefined}
        schema={[blogPostJsonLd(article), ...(faqLd ? [faqLd] : [])]}
        title={article.seo_title || article.title}
        description={article.meta_description || article.excerpt}
      />

      <article className="relative isolate bg-tint-soft-grad pb-10 lg:pb-12">
        <Breadcrumbs
          items={[
            { label: "Health Blog", href: "/blog" },
            { label: article.category ?? "Article" },
          ]}
        />

        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              {article.category ? (
                <span
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[0.75rem] font-bold",
                    "bg-[rgba(190,53,58,.07)] text-secondary",
                  )}
                >
                  {article.category}
                </span>
              ) : null}
              {published ? (
                <span className="flex items-center gap-1.5 text-[0.8125rem] text-muted">
                  <CalendarDays size={14} />
                  {published}
                </span>
              ) : null}
              {article.read_time ? (
                <span className="flex items-center gap-1.5 text-[0.8125rem] text-muted">
                  <Clock size={14} />
                  {article.read_time} min read
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-[1.875rem] leading-[1.12] font-extrabold tracking-[-0.025em] sm:text-[2.375rem]">
              {article.title}
            </h1>

            {article.excerpt ? (
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
                {article.excerpt}
              </p>
            ) : null}

            {article.author ? (
              <div className="mt-5 flex items-center gap-3 border-y border-line py-4">
                {/* The hospital's editorial desk writes most posts, so those carry
                    its mark. A named doctor or guest author keeps the neutral
                    avatar rather than borrowing the hospital's logo. */}
                {/brahmanandam/i.test(article.author) ? (
                  <Image
                    src="/brand/mark-192.png"
                    alt="Brahmanandam Hospital logo"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full bg-white object-contain p-1 shadow-card"
                  />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[rgba(47,59,128,.07)] text-primary">
                    <UserRound size={18} />
                  </span>
                )}
                <span className="block text-[0.9375rem] font-bold text-primary">
                  {article.author}
                </span>
              </div>
            ) : null}

            {article.featured_image ? (
              <Image
                src={article.featured_image}
                alt={article.image_alt ?? article.title}
                width={900}
                height={438}
                priority
                className="mt-6 w-full rounded-[1.25rem] object-cover shadow-card"
              />
            ) : null}

            <div className="mt-8">
              <BlockList content={article.content} />
            </div>

            {article.faq.length ? (
              <section className="mt-10">
                <h2 className="text-[1.5rem] font-extrabold">
                  Frequently asked questions
                </h2>
                <dl className="mt-4 grid gap-3">
                  {article.faq.map((f) => (
                    <div
                      key={f.question}
                      className="rounded-[1.125rem] border border-line bg-white p-5 shadow-card"
                    >
                      <dt className="text-[1rem] font-bold text-primary">
                        {f.question}
                      </dt>
                      <dd className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                        <RichText text={f.answer} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <aside
              data-reveal="zoom"
              className="mt-10 rounded-[1.25rem] bg-primary p-6 text-white sm:p-8"
            >
              <h2 className="text-[1.25rem] font-extrabold !text-white">
                Need to discuss this with a specialist?
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/75">
                Book an OPD consultation at our Sonari campus. Same-day
                diagnostics and in-house pharmacy available.
              </p>
              <Link
                to="/appointment"
                className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-6 text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
              >
                Book an Appointment
                <ArrowRight size={16} strokeWidth={2.3} />
              </Link>
            </aside>

            <nav className="mt-10 border-t border-line pt-6">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[0.9375rem] font-bold text-primary hover:text-secondary"
              >
                <ArrowLeft size={16} />
                Back to all articles
              </Link>

              {others.length ? (
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link
                        to={`/blog/${other.slug}`}
                        className="flex h-full gap-3.5 rounded-[1.125rem] border border-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                      >
                        {other.featured_image ? (
                          <Image
                            src={other.featured_image}
                            alt=""
                            width={200}
                            height={97}
                            className="h-16 w-22 shrink-0 rounded-lg object-cover"
                          />
                        ) : null}
                        <span className="min-w-0">
                          <span className="block text-[0.75rem] font-bold text-secondary">
                            {other.category}
                          </span>
                          <span className="mt-1 block text-[0.9375rem] leading-snug font-bold text-primary">
                            {other.title}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </nav>
          </div>
        </div>
      </article>

      <EmergencyBanner />
    </>
  );
}
