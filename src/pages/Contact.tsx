import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LocationSection } from "@/components/home/LocationSection";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/data/site";
import { Seo } from "@/components/Seo";


/*
 * Two short contacts sit side by side; the two long ones (email addresses and
 * the address) take a full row each so nothing truncates and no card is left
 * stranded on a half-empty row.
 */
const quickChannels = [
  {
    icon: Phone,
    label: "24×7 Helpline",
    value: site.phone,
    href: site.phoneHref,
    tone: "secondary" as const,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Desk",
    value: `+91 ${site.phone}`,
    href: site.whatsapp,
    tone: "success" as const,
  },
];

const emails = [
  { label: "Care", value: site.email },
  { label: "Info", value: site.emailAlt },
];

const toneClass = {
  primary: "bg-[rgba(47,59,128,.06)] text-primary",
  secondary: "bg-[rgba(190,53,58,.07)] text-secondary",
  success: "bg-[rgba(15,157,110,.09)] text-success",
};

export default function ContactPage() {
  return (
    <>
      <Seo
        crumbs={[{ label: "Contact Us" }]}
        title="Contact | Hospital in Sonari, Jamshedpur - 24x7 Helpline"
        description="Contact Brahmanandam Hospital, Sonari - 184, Near Road No. 3, Kagal Nagar, Jamshedpur 831011. 24x7 helpline 8271827999, WhatsApp, email, Google Maps directions and OPD timings."
      />
      <PageHero
        crumbs={[{ label: "Contact Us" }]}
        eyebrow="Reach Us 24x7"
        title="Contact Brahmanandam Hospital, Sonari"
        subtitle="We are always here to assist you with your healthcare needs. Whether you want to book an appointment, need emergency care, or have a general inquiry, feel free to reach out - our helpdesk responds within 15 minutes during OPD hours."
        icon={<Clock size={14} className="text-secondary" />}
        aside={
          <div className="grid gap-3">
            <ul className="grid grid-cols-2 gap-3">
              {quickChannels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="flex h-full items-center gap-3 rounded-[1.125rem] border border-line bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClass[c.tone]}`}
                    >
                      <c.icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.6875rem] font-bold tracking-[0.07em] text-muted uppercase">
                        {c.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.9375rem] font-bold text-primary">
                        {c.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-start gap-3 rounded-[1.125rem] border border-line bg-white p-4 shadow-card">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClass.primary}`}
              >
                <Mail size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.6875rem] font-bold tracking-[0.07em] text-muted uppercase">
                  Email
                </p>
                <ul className="mt-1 grid gap-0.5">
                  {emails.map((e) => (
                    <li key={e.value}>
                      <a
                        href={`mailto:${e.value}`}
                        className="block text-[0.875rem] font-semibold break-all text-primary hover:text-secondary"
                      >
                        {e.value}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-start gap-3 rounded-[1.125rem] border border-line bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClass.primary}`}
              >
                <MapPin size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.6875rem] font-bold tracking-[0.07em] text-muted uppercase">
                  Campus
                </span>
                <span className="mt-0.5 block text-[0.875rem] leading-snug font-semibold text-primary">
                  {site.address.line1},<br />
                  {site.address.line2}
                </span>
              </span>
            </a>
          </div>
        }
      />

      <LocationSection />
      <GoogleReviews />
      <EmergencyBanner />
    </>
  );
}
