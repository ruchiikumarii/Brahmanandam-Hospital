import { Link } from "react-router-dom";
import { Ambulance, Asterisk, MapPin } from "lucide-react";
import { site } from "@/lib/data/site";

export function EmergencyBanner() {
  return (
    <section className="relative isolate bg-white py-10 sm:py-12">
      <div className="shell">
        <div
          data-reveal="zoom"
          className="relative overflow-hidden rounded-[1.25rem] px-6 py-9 sm:px-10 sm:py-11"
          style={{
            background:
              "radial-gradient(700px 400px at 88% 108%, rgba(190,53,58,.35), transparent 62%), linear-gradient(112deg,#2f3b80 0%,#333f8c 46%,#3b3f86 100%)",
          }}
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 opacity-40 lg:block"
            width="430"
            height="150"
            viewBox="0 0 430 150"
            fill="none"
          >
            <path
              d="M0 75h140l18-52 22 104 18-72 14 20h218"
              stroke="rgba(255,255,255,.45)"
              strokeWidth="1.6"
            />
          </svg>

          <div className="relative grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-[0.6875rem] font-extrabold tracking-[0.1em] text-white uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                24x7 Emergency Helpline
              </span>
              <h2 className="mt-4 text-[1.625rem] leading-[1.15] font-extrabold !text-white sm:text-[2.125rem]">
                Need Immediate Medical Attention or Urgent OPD Slot?
              </h2>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-white/78">
                Our Emergency Triage, Trauma Surgeons, and On-Call Medical
                Officers are operational round-the-clock. Walk in directly to
                our Sonari Centre or call the hospital lifeline immediately.
              </p>
              <ul className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2 text-[0.8125rem] text-white/72">
                <li className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#5ee3ab]" />
                  Sonari, Jamshedpur
                </li>
                <li className="flex items-center gap-2">
                  <Ambulance size={15} className="text-[#5ee3ab]" />
                  Rapid Response Ambulance
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
              <a
                href={site.phoneHref}
                className="inline-flex h-[3.5rem] items-center justify-center gap-2.5 rounded-full bg-secondary px-7 text-[1.0625rem] font-extrabold text-white shadow-[0_0_36px_-8px_rgba(190,53,58,.95)] transition-colors hover:bg-secondary-700"
              >
                <Asterisk size={20} strokeWidth={2.6} />
                Call: {site.phone}
              </a>
              <Link
                to="/appointment"
                className="inline-flex h-[3.5rem] items-center justify-center rounded-full bg-white px-7 text-[0.9375rem] font-extrabold text-primary transition-colors hover:bg-white/90"
              >
                Online Pre-Booking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
