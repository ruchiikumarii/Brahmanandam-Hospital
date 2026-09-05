import Image from "@/components/ui/Img";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, UserRound } from "lucide-react";
import { blogArticles, getArticle } from "@/lib/data/blog";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { cn } from "@/components/ui";
import { Seo } from "@/components/Seo";
import NotFoundPage from "@/pages/NotFound";

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticle(slug) : undefined;
  if (!article) return <NotFoundPage />;

  const others = blogArticles.filter((a) => a.slug !== article.slug);

  return (
    <>
      <Seo title={article.title} description={article.excerpt} />

      <article className="relative isolate bg-tint-soft-grad pb-10 lg:pb-12">
        <Breadcrumbs
        items={[{ label: "Health Blog", href: "/blog" }, { label: article.category }]}
        />
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-[0.75rem] font-bold",
                  article.categoryTone === "secondary"
                    ? "bg-[rgba(190,53,58,.07)] text-secondary"
                    : "bg-[rgba(47,59,128,.07)] text-primary",
                )}
              >
                {article.category}
              </span>
              <span className="flex items-center gap-1.5 text-[0.8125rem] text-muted">
                <CalendarDays size={14} />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5 text-[0.8125rem] text-muted">
                <Clock size={14} />
                {article.readMinutes} min read
              </span>
            </div>

            <h1 className="mt-4 text-[1.875rem] leading-[1.12] font-extrabold tracking-[-0.025em] sm:text-[2.375rem]">
              {article.title}
            </h1>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
              {article.excerpt}
            </p>

            <div className="mt-5 flex items-center gap-3 border-y border-line py-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[rgba(47,59,128,.07)] text-primary">
                <UserRound size={18} />
              </span>
              <span>
                <span className="block text-[0.9375rem] font-bold text-primary">
                  {article.author}
                </span>
                <span className="block text-[0.8125rem] text-muted">
                  {article.authorRole}
                </span>
              </span>
            </div>

            <Image
              src={article.image}
              alt={article.title}
              width={900}
              height={438}
              priority
              sizes="(max-width: 1023px) 100vw, 768px"
              className="mt-6 w-full rounded-[1.25rem] object-cover shadow-card"
            />

            <div className="mt-9 grid gap-8">
              {article.body.map((block) => (
                <section key={block.heading} data-reveal>
                  <h2 className="text-[1.375rem] leading-snug font-extrabold">
                    {block.heading}
                  </h2>
                  <div className="mt-3 grid gap-3.5 text-[1rem] leading-[1.85] text-muted">
                    {block.paragraphs.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                  {block.points ? (
                    <ul className="mt-4 grid gap-2.5 rounded-[1.125rem] bg-white p-5 shadow-card">
                      {block.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

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
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      to={`/blog/${other.slug}`}
                      className="flex h-full gap-3.5 rounded-[1.125rem] border border-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <Image
                        src={other.image}
                        alt=""
                        width={200}
                        height={97}
                        sizes="88px"
                        className="h-16 w-22 shrink-0 rounded-lg object-cover"
                      />
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
            </nav>
          </div>
        </div>
      </article>

      <EmergencyBanner />
    </>
  );
}
