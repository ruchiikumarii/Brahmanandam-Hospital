import { MapPin, Navigation, Phone } from "lucide-react";
import { site } from "@/lib/data/site";
import { InquiryForm } from "./InquiryForm";

export function LocationSection() {
  return (
    <section
      id="location"
      className="relative isolate bg-lavender py-12 sm:py-14 lg:py-16"
    >
      <div className="shell grid gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        <div data-reveal="left">
          <p className="eyebrow">Reach Us 24x7</p>
          <h2 className="mt-2 text-[1.75rem] leading-tight font-extrabold sm:text-[2.15rem]">
            Emergency &amp; Hospital Location
          </h2>
          <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
            Conveniently accessible in the heart of Sonari near Road No. 3 with
            dedicated ambulance parking.
          </p>

          <div className="mt-7 grid gap-3.5 sm:grid-cols-2">
            <div className="rounded-[1.125rem] border border-line bg-white p-5 shadow-card">
              <h3 className="flex items-center gap-2 text-[1.0625rem] font-extrabold">
                <MapPin size={18} className="text-secondary" />
                Address
              </h3>
              <address className="mt-2.5 text-[0.875rem] leading-[1.7] text-muted not-italic">
                184, Near Road No. 3, Kagal Nagar,
                <br />
                Sonari, Jamshedpur, Jharkhand - 831011
              </address>
            </div>

            <div className="rounded-[1.125rem] border border-line bg-white p-5 shadow-card">
              <h3 className="flex items-center gap-2 text-[1.0625rem] font-extrabold">
                <Phone size={17} className="text-secondary" />
                Helpline
              </h3>
              <a
                href={site.phoneHref}
                className="mt-2 block font-display text-[1.375rem] font-extrabold text-secondary hover:underline"
              >
                {site.phone}
              </a>
              <p className="mt-1 text-[0.8125rem] font-semibold text-success">
                24×7 Emergency Line
              </p>
            </div>
          </div>

          <div className="group relative mt-4 overflow-hidden rounded-[1.125rem] border border-line bg-white shadow-card">
            <iframe
              title="Brahmanandam Hospital, Sonari - location map"
              src={site.google.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-[19rem] w-full border-0 sm:h-[21rem]"
            />
            <div className="pointer-events-none absolute bottom-4 left-4 max-w-[16rem] rounded-xl bg-white/95 p-3.5 shadow-card backdrop-blur-sm">
              <p className="text-[0.6875rem] font-extrabold tracking-[0.08em] text-secondary uppercase">
                Central Sonari Location
              </p>
              <p className="mt-1 text-[0.9375rem] font-extrabold text-primary">
                Brahmanandam Hospital Centre
              </p>
              <p className="mt-0.5 text-[0.75rem] text-muted">
                Direct drive from Marine Drive &amp; Kadma
              </p>
            </div>
          </div>

          <a
            href={site.google.directionsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-[rgba(47,59,128,.06)] px-5 text-[0.875rem] font-bold text-primary transition-colors hover:bg-[rgba(47,59,128,.11)]"
          >
            <Navigation size={15} className="text-secondary" />
            Get Directions on Google Maps
          </a>
        </div>

        <div data-reveal="right">
          <InquiryForm />
        </div>
      </div>
    </section>
  );
}
