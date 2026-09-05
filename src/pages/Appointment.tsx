import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import {
  AppointmentFlow,
  BookingAssistanceCard,
} from "@/components/appointment/AppointmentFlow";
import { Seo } from "@/components/Seo";

export default function AppointmentPage() {
  return (
    <>
      <Seo
        title="Book an Appointment — Online OPD Chamber Desk"
        description="Schedule a confirmed OPD consultation with senior specialists at Brahmanandam Hospital, Sonari. Choose department, doctor, date and slot — instant SMS token, no advance payment."
      />


      <section className="relative isolate overflow-hidden bg-white pb-8 lg:pb-10">
        <Breadcrumbs items={[{ label: "Book Appointment" }]} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(47,59,128,.07), transparent 70%)",
          }}
        />
        <div className="shell relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(190,53,58,.07)] px-3.5 py-2 text-[0.6875rem] font-extrabold tracking-[0.1em] text-secondary uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Online OPD Chamber Desk
            </p>
            <h1 className="mt-4 text-[1.875rem] leading-[1.08] font-extrabold tracking-[-0.03em] sm:text-[2.5rem]">
              Schedule Your Clinical Consultation
            </h1>
            <p className="mt-3 max-w-2xl text-[0.9375rem] text-muted">
              Confirmed OPD slot with senior specialists at Sonari Main Campus.
              Instant SMS token provided.
            </p>
          </div>
          <BookingAssistanceCard />
        </div>
      </section>

      <AppointmentFlow />
    </>
  );
}
