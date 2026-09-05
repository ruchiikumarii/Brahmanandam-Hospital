import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { StatsBand, WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialsSection } from "@/components/home/Sections";
import { Seo } from "@/components/Seo";
import Image from "@/components/ui/Img";
import {
  aboutHospital,
  aboutKeyPoints,
  aboutUsHeadline,
  coreValues,
  leadership,
  mission,
  vision,
} from "@/lib/data/institutional";
import { Icon } from "@/components/ui/Icon";
import { EkgLine, Section, SectionHeading } from "@/components/ui";

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Brahmanandam Hospital, Sonari"
        description="Brahmanandam Hospital, Sonari is a trusted multi-speciality healthcare provider delivering quality, affordable and compassionate medical care to Jamshedpur and surrounding regions."
      />
      <PageHero
        crumbs={[{ label: "About Us" }]}
        eyebrow="About Us"
        title={aboutUsHeadline}
        subtitle={aboutHospital}
        icon={<ShieldCheck size={14} className="text-secondary" />}
        aside={
          <div className="overflow-hidden rounded-[1.25rem] border border-line bg-white p-2 shadow-card">
            <Image
              src="/images/general/hospital-exterior.jpg"
              alt="Brahmanandam Hospital Multi Specialty Centre building in Sonari, Jamshedpur"
              width={1400}
              height={666}
              priority
              className="w-full rounded-[0.9rem] object-cover"
            />
          </div>
        }
      />

      <Section tone="white">
        <div className="grid gap-9 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div data-reveal="left">
            <p className="eyebrow">Who We Are</p>
            <h2 className="mt-2 text-[1.625rem] leading-tight font-extrabold sm:text-[2rem]">
              Equipped for Every Stage of Care
            </h2>
            <EkgLine className="mt-2" width={140} />

            <ul className="mt-6 grid gap-2.5">
              {aboutKeyPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-xl bg-[rgba(47,59,128,.04)] px-4 py-3.5 text-[0.9375rem] leading-relaxed text-ink"
                >
                  <CircleCheck size={17} className="mt-0.5 shrink-0 text-success" />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              to="/departments"
              className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-bold text-primary transition-colors hover:text-secondary"
            >
              Explore our clinical departments
              <ArrowRight size={17} strokeWidth={2.2} />
            </Link>
          </div>

          <ul className="grid content-start gap-4">
            <li
              data-reveal="right"
              className="rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <p className="text-[0.6875rem] font-extrabold tracking-[0.1em] text-secondary uppercase">
                Our Mission
              </p>
              <p className="mt-3 text-[0.9375rem] leading-[1.8] text-muted">
                {mission}
              </p>
            </li>
            <li
              data-reveal="right"
              style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
              className="rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <p className="text-[0.6875rem] font-extrabold tracking-[0.1em] text-secondary uppercase">
                Our Vision
              </p>
              <p className="mt-3 text-[0.9375rem] leading-[1.8] text-muted">
                {vision}
              </p>
            </li>
            <li
              data-reveal="right"
              style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
              className="rounded-[1.125rem] border border-line bg-white p-6 shadow-card"
            >
              <p className="text-[0.6875rem] font-extrabold tracking-[0.1em] text-secondary uppercase">
                Our Values
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {coreValues.map((v) => (
                  <li
                    key={v.name}
                    className="flex items-center gap-1.5 rounded-full bg-[rgba(47,59,128,.05)] px-3 py-1.5 text-[0.8125rem] font-bold text-primary"
                  >
                    <Icon name={v.icon} size={14} className="text-secondary" />
                    {v.name}
                  </li>
                ))}
              </ul>
              <Link
                to="/mission-vision-values"
                className="mt-4 inline-flex items-center gap-2 text-[0.875rem] font-bold text-primary transition-colors hover:text-secondary"
              >
                Read them in full
                <ArrowRight size={15} strokeWidth={2.3} />
              </Link>
            </li>
          </ul>
        </div>
      </Section>

      <StatsBand />
      <WhyChooseUs />

      <Section tone="lavender">
        <SectionHeading
          eyebrow="Leadership"
          title="Guided by a Shared Vision"
          subtitle="At Brahmanandam Hospital, Sonari, our leadership team is driven by a shared vision of delivering compassionate, ethical, and high-quality healthcare."
          ekg={false}
        />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          {leadership.map((person, i) => (
            <li
              key={person.name}
              data-reveal
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
            >
              <Link
                to={person.href}
                className="flex h-full flex-col rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`grid h-14 w-14 shrink-0 place-items-center rounded-full font-display text-[1.125rem] font-extrabold text-white ${
                      i === 0 ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    {person.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[1.0625rem] font-extrabold text-primary">
                      {person.name}
                    </span>
                    <span className="block text-[0.8125rem] font-semibold text-secondary">
                      {person.role}
                    </span>
                  </span>
                </div>
                <p className="mt-4 text-[0.875rem] leading-relaxed text-muted">
                  {person.summary}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.875rem] font-bold text-primary">
                  About Me
                  <ArrowRight size={15} strokeWidth={2.3} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center">
          <Link
            to="/our-directors"
            className="inline-flex items-center gap-2 text-[0.9375rem] font-bold text-primary transition-colors hover:text-secondary"
          >
            View our directors
            <ArrowRight size={17} strokeWidth={2.2} />
          </Link>
        </p>
      </Section>

      <TestimonialsSection limit={6} />
      <EmergencyBanner />
    </>
  );
}
