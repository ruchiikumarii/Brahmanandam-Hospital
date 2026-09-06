import { ContentPage } from "@/components/layout/ContentPage";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { admissionProcess } from "@/lib/data/institutional";

export default function AdmissionProcessPage() {
  return (
    <>
      <Seo
        crumbs={[
          { label: "Patient Care", href: "/patient-services" },
          { label: "Admission Process" },
        ]}
        title="Admission Process"
        description="Registration, admission procedure, room types, billing and payment methods for inpatient admission at Brahmanandam Hospital, Sonari, Jamshedpur."
      />
      <ContentPage
        crumbs={[
          { label: "Patient Care", href: "/patient-services" },
          { label: "Admission Process" },
        ]}
        eyebrow="Patient Care Services"
        title="Admission Process"
        subtitle="Everything you need to know before and during admission — registration, formalities, room categories, billing and hospital policies."
        icon="clipboard-check"
        sections={admissionProcess}
        footerNote="The admission process takes approximately 30 minutes. For emergencies, report directly to the Emergency Department — admission formalities are completed alongside treatment."
      />
      <EmergencyBanner />
    </>
  );
}
