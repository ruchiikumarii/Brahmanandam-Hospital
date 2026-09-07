import { ContentPage } from "@/components/layout/ContentPage";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { dischargeProcess } from "@/lib/data/institutional";

export default function DischargeProcessPage() {
  return (
    <>
      <Seo
        crumbs={[
          { label: "Patient Care", href: "/patient-services" },
          { label: "Discharge Process" },
        ]}
        title="Discharge Process"
        description="Discharge formalities at Brahmanandam Hospital, Sonari - billing, discharge summary, medication, medico-legal cases, certificates and patient feedback."
      />
      <ContentPage
        crumbs={[
          { label: "Patient Care", href: "/patient-services" },
          { label: "Discharge Process" },
        ]}
        eyebrow="Patient Care Services"
        title="Discharge Process"
        subtitle="What happens once your treating doctor gives medical clearance, and what to collect before you leave the hospital."
        icon="check-circle"
        sections={dischargeProcess}
        footerNote="Please allow approximately 2 hours for the hospital to complete discharge formalities after medical clearance is given."
      />
      <EmergencyBanner />
    </>
  );
}
