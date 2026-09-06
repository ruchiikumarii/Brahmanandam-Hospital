import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { coreValues, mission, vision } from "@/lib/data/institutional";
import { Icon } from "@/components/ui/Icon";
import { EkgLine, Section, SectionHeading } from "@/components/ui";

export default function MissionVisionValuesPage() {
  return (
    <>
      <Seo
        crumbs={[
          { label: "About Us", href: "/about" },
          { label: "Mission, Vision and Values" },
        ]}
        title="Mission, Vision and Values"
        description="The mission, vision and seven core values of Brahmanandam Hospital, Sonari — quality, compassion, integrity, teamwork, service, innovation and responsibility."
      />
      <PageHero
        crumbs={[
          { label: "About Us", href: "/about" },
          { label: "Mission, Vision and Values" },
        ]}
        eyebrow="Our Purpose • Sonari, Jamshedpur"
        title="Mission, Vision and Values"
        subtitle="What we set out to do, where we are going, and the principles we hold ourselves to along the way."
        icon={<Icon name="shield-check" size={14} className="text-secondary" />}
      />

      <Section tone="white">
        <div className="grid gap-4 lg:grid-cols-2">
          <article
            data-reveal="left"
            className="relative overflow-hidden rounded-[1.25rem] p-7 text-white sm:p-9"
            style={{
              background:
                "radial-gradient(520px 300px at 90% 110%, rgba(190,53,58,.32), transparent 62%), linear-gradient(120deg,#2f3b80,#333f8c)",
            }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/14">
              <Icon name="siren" size={22} className="text-white" />
            </span>
            <h2 className="mt-5 text-[1.5rem] font-extrabold !text-white">
              Our Mission
            </h2>
            <EkgLine className="mt-2" width={130} tone="light" />
            <p className="mt-4 text-[1rem] leading-[1.8] text-white/85">{mission}</p>
          </article>

          <article
            data-reveal="right"
            className="rounded-[1.25rem] border border-line bg-white p-7 shadow-card sm:p-9"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[rgba(190,53,58,.07)] text-secondary">
              <Icon name="scan" size={22} />
            </span>
            <h2 className="mt-5 text-[1.5rem] font-extrabold">Our Vision</h2>
            <EkgLine className="mt-2" width={130} />
            <p className="mt-4 text-[1rem] leading-[1.8] text-muted">{vision}</p>
          </article>
        </div>
      </Section>

      <Section tone="lavender">
        <SectionHeading
          eyebrow="Our Values"
          title="Seven Commitments We Practise Daily"
          subtitle="These values shape how our clinical and support teams work with every patient and family at Sonari."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreValues.map((value, i) => (
            <li
              key={value.name}
              data-reveal
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              className="relative rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="absolute top-5 right-5 font-display text-[1.75rem] leading-none font-extrabold text-[rgba(47,59,128,.07)]">
                0{i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[rgba(47,59,128,.06)] text-primary">
                <Icon name={value.icon} size={20} />
              </span>
              <h3 className="mt-5 text-[1.125rem] font-extrabold">{value.name}</h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                {value.text}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <EmergencyBanner />
    </>
  );
}
