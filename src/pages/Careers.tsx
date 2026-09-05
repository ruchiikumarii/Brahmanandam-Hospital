import { ArrowRight, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { careers } from "@/lib/data/institutional";
import { site } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui";

export default function CareersPage() {
  const mailto = `mailto:${careers.applyEmail}?subject=Job%20application`;
  const tel = `tel:${careers.applyPhone.replace(/\s/g, "")}`;

  return (
    <>
      <Seo
        title="Careers"
        description="Careers at Brahmanandam Hospital, Sonari, Jamshedpur — a supportive and professional environment for medical and non-medical professionals. Send your updated resume to our careers desk."
      />
      <PageHero
        crumbs={[{ label: "Careers" }]}
        eyebrow="Work With Us • Sonari, Jamshedpur"
        title={careers.heading}
        subtitle={careers.intro}
        icon={<Icon name="graduation-cap" size={14} className="text-secondary" />}
        aside={
          <div className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card">
            <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
              Careers Desk
            </p>
            <a
              href={mailto}
              className="mt-3 flex items-start gap-2.5 text-[0.9375rem] leading-snug font-bold break-all text-primary transition-colors hover:text-secondary"
            >
              <Mail size={17} className="mt-0.5 shrink-0 text-secondary" />
              {careers.applyEmail}
            </a>
            <a
              href={tel}
              className="mt-2.5 flex items-center gap-2.5 text-[0.9375rem] font-bold text-primary transition-colors hover:text-secondary"
            >
              <Phone size={17} className="shrink-0 text-secondary" />
              {careers.applyPhone}
            </a>
            <a
              href={mailto}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-secondary text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
            >
              Apply Now
              <ArrowRight size={16} strokeWidth={2.3} />
            </a>
          </div>
        }
      />

      <Section tone="white">
        <div
          data-reveal
          className="mx-auto max-w-3xl rounded-[1.25rem] border border-line bg-white p-7 shadow-card sm:p-9"
        >
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[rgba(190,53,58,.07)] text-secondary">
              <Mail size={24} />
            </span>
            <h2 className="mt-5 text-[1.375rem] leading-tight font-extrabold sm:text-[1.625rem]">
              Send us your resume
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
              {careers.invitation}
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <a
              href={mailto}
              className="flex items-center gap-3.5 rounded-xl bg-[rgba(47,59,128,.05)] px-4 py-4 transition-colors hover:bg-[rgba(47,59,128,.09)]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-secondary shadow-card">
                <Mail size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
                  Email
                </span>
                <span className="mt-0.5 block text-[0.8125rem] leading-snug font-bold break-all text-primary">
                  {careers.applyEmail}
                </span>
              </span>
            </a>

            <a
              href={tel}
              className="flex items-center gap-3.5 rounded-xl bg-[rgba(47,59,128,.05)] px-4 py-4 transition-colors hover:bg-[rgba(47,59,128,.09)]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-secondary shadow-card">
                <Phone size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
                  Phone
                </span>
                <span className="mt-0.5 block text-[0.9375rem] font-bold text-primary">
                  {careers.applyPhone}
                </span>
              </span>
            </a>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3 border-t border-line pt-7">
            <a
              href={mailto}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-7 text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
            >
              Apply Now
              <ArrowRight size={16} strokeWidth={2.3} />
            </a>
            <a
              href={tel}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-white px-7 text-[0.875rem] font-bold text-primary transition-colors hover:bg-[rgba(47,59,128,.04)]"
            >
              <Phone size={15} className="text-secondary" />
              Call the HR desk
            </a>
          </div>

          <p className="mt-6 text-center text-[0.8125rem] text-muted">
            {site.address.full}
          </p>
        </div>
      </Section>

      <EmergencyBanner />
    </>
  );
}
