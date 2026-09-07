import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseMedical, Phone } from "lucide-react";
import { doctors, homepageDoctorSlugs } from "@/lib/data/doctors";
import { site } from "@/lib/data/site";
import { DoctorCard } from "@/components/cards/DoctorCard";
import { EkgLine } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";

export function DoctorsSection() {
  const list = homepageDoctorSlugs
    .map((slug) => doctors.find((d) => d.slug === slug))
    .filter((d): d is (typeof doctors)[number] => Boolean(d));

  return (
    <section className="relative isolate bg-lavender py-12 sm:py-14 lg:py-16">
      <div className="shell">
        <div
          data-reveal
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="eyebrow">Medical Faculty</p>
            <h2 className="mt-2 text-[1.75rem] leading-none font-extrabold uppercase sm:text-[2.15rem] lg:text-[2.5rem]">
              Our Doctors
            </h2>
            <EkgLine className="mt-2" width={92} />
            <p className="mt-3 max-w-xl text-[0.9375rem] text-muted">
              Meet our senior medical specialists dedicated to patient
              excellence in Sonari, Jamshedpur.
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 self-start text-[0.9375rem] font-bold text-primary transition-colors hover:text-secondary md:self-auto"
          >
            Find specific specialist
            <ArrowRight size={17} strokeWidth={2.2} />
          </Link>
        </div>

        {/* The visiting-specialists tile used to sit in this grid, and being a
            head taller than a doctor card it stretched its whole row -- the
            cards beside it ended up taller than the ones above. It is not a
            doctor, so it now runs full width underneath and the cards are left
            to size themselves identically. */}
        <div
          className="card-row card-row--md-2 card-row--lg-3 mt-9 gap-4"
          style={{ "--row-gap": "1rem" } as React.CSSProperties}
        >
          {list.map((doctor, i) => (
            <DoctorCard
              key={doctor.slug}
              doctor={doctor}
              style={revealDelay(i, 80)}
            />
          ))}
        </div>

        <article
          data-reveal
          className="mt-4 flex flex-col gap-5 rounded-[1.125rem] bg-primary p-6 text-white shadow-[0_24px_50px_-30px_rgba(47,59,128,.95)] sm:flex-row sm:items-center sm:gap-6"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/12">
            <BriefcaseMedical size={20} strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-[1.1875rem] font-extrabold !text-white">
              Looking for another specialist?
            </h3>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-white/75">
              We host visiting super-specialists from top national institutes
              every week for oncology, rheumatology, and pediatric surgery.
            </p>
          </div>
          <a
            href={site.phoneHref}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-xl bg-secondary px-6 text-[0.875rem] font-bold whitespace-nowrap text-white transition-colors hover:bg-secondary-700"
          >
            <Phone size={16} strokeWidth={2.2} />
            CALL OPD RECEPTION
          </a>
        </article>
      </div>
    </section>
  );
}
