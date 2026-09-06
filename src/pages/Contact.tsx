import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LocationSection } from "@/components/home/LocationSection";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/data/site";
import { Seo } from "@/components/Seo";


const channels = [
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
  {
    icon: Mail,
    label: "Care Email",
    value: site.email,
    href: `mailto:${site.email}`,
    tone: "primary" as const,
  },
  {
    icon: Mail,
    label: "Info Email",
    value: site.emailAlt,
    href: `mailto:${site.emailAlt}`,
    tone: "primary" as const,
  },
  {
    icon: MapPin,
    label: "Campus",
    value: "Kagal Nagar, Sonari",
    href: site.mapsUrl,
    tone: "primary" as const,
  },
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
        title="Contact | Hospital in Sonari, Jamshedpur — 24x7 Helpline"
        description="Contact Brahmanandam Hospital, Sonari — 184, Near Road No. 3, Kagal Nagar, Jamshedpur 831011. 24x7 helpline 8271827999, WhatsApp, email, Google Maps directions and OPD timings."
      />
      <PageHero
        crumbs={[{ label: "Contact Us" }]}
        eyebrow="Reach Us 24x7"
        title="Contact Brahmanandam Hospital, Sonari"
        subtitle="We are always here to assist you with your healthcare needs. Whether you want to book an appointment, need emergency care, or have a general inquiry, feel free to reach out — our helpdesk responds within 15 minutes during OPD hours."
        icon={<Clock size={14} className="text-secondary" />}
        aside={
          <ul className="grid gap-3 sm:grid-cols-2">
            {channels.map((c) => (
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
        }
      />

      <LocationSection />
      <EmergencyBanner />
    </>
  );
}
