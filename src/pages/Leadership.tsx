import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { coreValues, directorsIntro, leadership } from "@/lib/data/institutional";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui";

export default function LeadershipPage() {
  return (
    <>
      <Seo
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Our Directors" }]}
        title="Our Directors"
        description="The leadership team of Brahmanandam Hospital, Sonari - driven by a shared vision of delivering compassionate, ethical and high-quality healthcare in Jamshedpur."
      />
      <PageHero
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Our Directors" }]}
        eyebrow="Governance • Brahmanandam Hospital"
        title="Our Directors"
        subtitle={directorsIntro}
        icon={<Icon name="users" size={14} className="text-secondary" />}
      />

      <Section tone="white">
        <ul className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          {leadership.map((person, i) => (
            <li
              key={person.name}
              data-reveal
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
            >
              <article className="flex h-full flex-col rounded-[1.25rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-center gap-4">
                  <span
                    className={`grid h-16 w-16 shrink-0 place-items-center rounded-full font-display text-[1.25rem] font-extrabold text-white ${
                      i === 0 ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    {person.initials}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-[1.1875rem] leading-tight font-extrabold">
                      {person.name}
                    </h2>
                    <p className="mt-1 text-[0.875rem] font-semibold text-secondary">
                      {person.role}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                  {person.summary}
                </p>
                <Link
                  to={person.href}
                  className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.875rem] font-bold text-primary transition-colors hover:text-secondary"
                >
                  About Me
                  <ArrowRight size={16} strokeWidth={2.3} />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="lavender">
        <SectionHeading
          eyebrow="What Guides Us"
          title="The Values Our Leadership Upholds"
          ekg={false}
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value, i) => (
            <li
              key={value.name}
              data-reveal="zoom"
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              className="rounded-[1.125rem] border border-line bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(47,59,128,.06)] text-primary">
                <Icon name={value.icon} size={18} />
              </span>
              <h3 className="mt-4 text-[1rem] font-extrabold">{value.name}</h3>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                {value.text}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center">
          <Link
            to="/mission-vision-values"
            className="inline-flex items-center gap-2 text-[0.9375rem] font-bold text-primary transition-colors hover:text-secondary"
          >
            Read our mission, vision &amp; values in full
            <ArrowRight size={17} strokeWidth={2.2} />
          </Link>
        </p>
      </Section>

      <EmergencyBanner />
    </>
  );
}
