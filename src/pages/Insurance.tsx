import { Link } from "react-router-dom";
import { ArrowRight, FileCheck2, Headset, Phone, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { InquiryForm } from "@/components/home/InquiryForm";
import { insurancePartners } from "@/lib/data/content";
import { cashlessProcess, tpaPartners } from "@/lib/data/institutional";
import { site } from "@/lib/data/site";
import { Section, SectionHeading } from "@/components/ui";
import { Seo } from "@/components/Seo";


const steps = [
  {
    icon: FileCheck2,
    title: "Cashless Support",
    text: "Present your health insurance card and photo ID at the TPA desk (Ground Floor, Ext 104) at the time of admission.",
  },
  {
    icon: ShieldCheck,
    title: "Pre-Authorization",
    text: "Our insurance cell prepares the pre-auth form with clinical notes and submits it to your insurer or TPA the same day.",
  },
  {
    icon: Headset,
    title: "Insurance Assistance",
    text: "A dedicated coordinator tracks approval status, handles queries, and explains any non-payable items before discharge.",
  },
];

export default function InsurancePage() {
  return (
    <>
      <Seo
        crumbs={[{ label: "TPA & Insurance" }]}
        title="Cashless Hospital in Jamshedpur | TPA & Insurance Partners"
        description="Cashless hospitalisation at Brahmanandam Hospital, Sonari - empanelled with Star Health, ICICI Lombard, HDFC ERGO, Bajaj Allianz, Medi Assist, Paramount and more. Pre-authorisation handled by our TPA desk."
      />
      <PageHero
        crumbs={[{ label: "TPA & Insurance" }]}
        eyebrow="Hassle-Free Billing"
        title="Cashless Hospitalization with Leading Insurers & TPAs"
        subtitle="Brahmanandam Hospital, Sonari provides cashless treatment through major insurance companies and Third Party Administrators. Our dedicated desk assists with pre-authorization, claim documentation, and zero out-of-pocket stress during medical emergencies."
        icon={<ShieldCheck size={14} className="text-secondary" />}
        aside={
          <div className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card">
            <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
              TPA Cell
            </p>
            <p className="mt-3 text-[1.0625rem] font-extrabold text-primary">
              Ext 104 • Ground Floor
            </p>
            <p className="mt-2 text-[0.875rem] text-muted">
              Open during OPD hours; emergency pre-auth handled 24×7 through the
              casualty desk.
            </p>
            <a
              href={site.phoneHref}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-[0.875rem] font-bold text-white transition-colors hover:bg-primary-800"
            >
              <Phone size={15} />
              {site.phone}
            </a>
          </div>
        }
      />

      <Section tone="white">
        <SectionHeading
          eyebrow="Empanelled Partners"
          title="Cashless Hospitalization & Insurance Approval"
          subtitle="Brahmanandam Hospital is empanelled with major TPAs and private health insurers. Coverage varies by policy - confirm with our desk before admission."
          ekg={false}
        />

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {insurancePartners.map((partner, i) => (
            <li
              key={partner.name}
              data-reveal="zoom"
              style={{ "--reveal-delay": `${i * 65}ms` } as React.CSSProperties}
              className="rounded-xl border border-line bg-white px-4 py-5 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <p className="text-[1rem] font-extrabold text-primary">
                {partner.name}
              </p>
              <p className="mt-1 text-[0.75rem] font-semibold text-success">
                {partner.status}
              </p>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-6 rounded-[1.25rem] bg-[rgba(47,59,128,.05)] p-6">
          <h3 className="text-[1rem] font-extrabold">
            Insurance &amp; TPA partners ({tpaPartners.length} empanelled)
          </h3>
          <p className="mt-1.5 text-[0.875rem] text-muted">
            Brahmanandam Hospital, Sonari is associated with the following
            insurance companies and Third Party Administrators.
          </p>
          <ul className="card-row card-row--3 mt-4 gap-2" style={{ "--row-gap": "0.5rem" } as React.CSSProperties}>
            {tpaPartners.map((name) => (
              <li
                key={name}
                className="flex items-start gap-2.5 rounded-xl bg-white px-3.5 py-3 text-[0.8125rem] font-semibold text-ink"
              >
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-success" />
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.8125rem] text-muted">
            Empanelment is periodically reviewed. Please confirm current status
            with the TPA desk before a planned admission.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {cashlessProcess.map((block, i) => (
            <div
              key={block.heading}
              data-reveal
              style={{ "--reveal-delay": `${(i % 2) * 90}ms` } as React.CSSProperties}
              className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card"
            >
              <h3 className="flex items-center gap-3 text-[1.0625rem] font-extrabold">
                <span className="h-5 w-[3px] shrink-0 rounded-full bg-secondary" />
                {block.heading}
              </h3>
              {block.paragraphs?.map((t) => (
                <p
                  key={t.slice(0, 30)}
                  className="mt-3 text-[0.875rem] leading-relaxed text-muted"
                >
                  {t}
                </p>
              ))}
              {block.points ? (
                <ul className="mt-3 grid gap-2">
                  {block.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-[0.875rem] text-ink"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section tone="lavender">
        <SectionHeading
          eyebrow="How It Works"
          title="Three Steps to a Cashless Admission"
          ekg={false}
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
              className="relative rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="absolute top-5 right-5 font-display text-[2rem] leading-none font-extrabold text-[rgba(47,59,128,.08)]">
                0{i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[rgba(190,53,58,.07)] text-secondary">
                <step.icon size={20} />
              </span>
              <h3 className="mt-5 text-[1.125rem] font-extrabold">{step.title}</h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div
            data-reveal="left"
            className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card"
          >
            <h3 className="text-[1.25rem] font-extrabold">
              Documents to carry
            </h3>
            <ul className="mt-4 grid gap-2.5 text-[0.9375rem] text-ink">
              {[
                "Original health insurance card / e-card",
                "Government photo ID (Aadhaar preferred)",
                "Doctor's admission advice or referral letter",
                "Previous discharge summaries and diagnostic reports",
                "Corporate employee ID, if using a corporate panel",
              ].map((doc) => (
                <li key={doc} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  {doc}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-bold text-primary transition-colors hover:text-secondary"
            >
              Talk to the insurance desk
              <ArrowRight size={17} strokeWidth={2.2} />
            </Link>
          </div>

          <div data-reveal="right">
            <InquiryForm defaultSubject="Cashless TPA / Insurance inquiry" />
          </div>
        </div>
      </Section>

      <EmergencyBanner />
    </>
  );
}
