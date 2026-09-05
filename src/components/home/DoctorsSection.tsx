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

        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((doctor, i) => (
            <DoctorCard
              key={doctor.slug}
              doctor={doctor}
              style={revealDelay(i, 80)}
            />
          ))}

          <article
            data-reveal
            style={revealDelay(list.length, 80)}
            className="flex flex-col justify-center rounded-[1.125rem] bg-primary p-6 text-white shadow-[0_24px_50px_-30px_rgba(47,59,128,.95)]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/12">
              <BriefcaseMedical size={20} strokeWidth={2} />
            </span>
            <h3 className="mt-5 text-[1.1875rem] font-extrabold !text-white">
              Looking for another specialist?
            </h3>
            <p className="mt-2.5 text-[0.875rem] leading-relaxed text-white/75">
              We host visiting super-specialists from top national institutes
              every week for oncology, rheumatology, and pediatric surgery.
            </p>
            <a
              href={site.phoneHref}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-secondary text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
            >
              <Phone size={16} strokeWidth={2.2} />
              CALL OPD RECEPTION
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
