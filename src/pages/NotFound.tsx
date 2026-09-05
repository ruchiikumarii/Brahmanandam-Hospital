import { Link } from "react-router-dom";
import { CalendarCheck, Home, Phone, Stethoscope } from "lucide-react";
import { site } from "@/lib/data/site";
import { EkgLine } from "@/components/ui";
import { Seo } from "@/components/Seo";

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page not found"
        description="The page you were looking for could not be found. Browse departments, find a doctor, or book an OPD appointment at Brahmanandam Hospital, Sonari."
      />
      <section className="relative isolate bg-tint-soft-grad py-20 lg:py-28">
      <div className="shell">
        <div className="mx-auto max-w-xl rounded-[1.5rem] border border-line bg-white p-8 text-center shadow-card sm:p-12">
          <p className="font-display text-[4rem] leading-none font-extrabold text-primary sm:text-[5rem]">
            404
          </p>
          <EkgLine className="mx-auto mt-2" width={140} />
          <h1 className="mt-5 text-[1.5rem] font-extrabold sm:text-[1.875rem]">
            This page could not be found
          </h1>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
            The page you were looking for may have moved. Use the links below, or
            call our helpdesk and we will point you in the right direction.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <Link
              to="/"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[0.875rem] font-bold text-white transition-colors hover:bg-primary-800"
            >
              <Home size={16} />
              Hospital Homepage
            </Link>
            <Link
              to="/appointment"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-6 text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
            >
              <CalendarCheck size={16} />
              Book Appointment
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 border-t border-line pt-6 text-[0.875rem]">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 font-bold text-primary hover:text-secondary"
            >
              <Stethoscope size={15} />
              Find a Doctor
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 font-bold text-secondary hover:underline"
            >
              <Phone size={15} />
              {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
