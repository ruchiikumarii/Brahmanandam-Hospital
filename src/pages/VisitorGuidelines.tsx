import { ContentPage } from "@/components/layout/ContentPage";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { visitorGuidelines } from "@/lib/data/institutional";

export default function VisitorGuidelinesPage() {
  return (
    <>
      <Seo
        crumbs={[
          { label: "Patient Care", href: "/patient-services" },
          { label: "Guidelines for Visitors" },
        ]}
        title="Guidelines for Visitors"
        description="Visitor rules at Brahmanandam Hospital, Sonari — infection control, attendant policy, visiting conduct, parking, payments and fire safety guidelines."
      />
      <ContentPage
        crumbs={[
          { label: "Patient Care", href: "/patient-services" },
          { label: "Guidelines for Visitors" },
        ]}
        eyebrow="Patient Care Services"
        title="General Guidelines for Visitors"
        subtitle="To ensure a safe, hygienic and peaceful environment for patients, visitors are requested to follow these guidelines while at Brahmanandam Hospital."
        icon="users"
        sections={[
          {
            heading: "Visitor Rules",
            points: visitorGuidelines,
            numbered: true,
          },
          {
            heading: "Thank You for Your Cooperation",
            paragraphs: [
              "By following these guidelines, you help maintain a safe and comfortable environment for all patients at Brahmanandam Hospital, Sonari.",
              "Your cooperation supports better healthcare and faster recovery for our patients.",
            ],
          },
        ]}
        footerNote="For infection control and patient safety, only one attendant may stay with the patient at a time, except during official visiting hours. Nursing staff may limit visitor numbers depending on the patient's medical condition."
      />
      <EmergencyBanner />
    </>
  );
}
