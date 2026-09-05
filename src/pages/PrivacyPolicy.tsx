import { LegalPage } from "@/components/layout/LegalPage";
import { Seo } from "@/components/Seo";


export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How Brahmanandam Hospital, Sonari collects, uses and protects patient information submitted through appointment booking and inquiry forms."
      />
      <LegalPage
      crumb="Privacy Policy"
      eyebrow="Patient Data Protection"
      title="Privacy Policy"
      subtitle="Brahmanandam Hospital treats every patient record as confidential medical information. This policy explains what we collect through this website and how it is handled."
      updated="1 January 2026"
      sections={[
        {
          heading: "Information we collect",
          paragraphs: [
            "When you book an appointment or submit an inquiry on this website, we collect only the details required to schedule and deliver care.",
          ],
          points: [
            "Patient name, age, gender and contact mobile number.",
            "Selected department, consultant, appointment date and time slot.",
            "Chief clinical concern or reason for visit, where you choose to provide it.",
            "Insurance or TPA assistance preference, where selected.",
          ],
        },
        {
          heading: "How we use your information",
          paragraphs: [
            "Booking details are used to reserve your OPD slot, issue an SMS or WhatsApp token, and prepare your consultation record at the Sonari campus.",
            "Clinical information you share is added to your hospital medical record and is accessible only to the treating clinician and authorised hospital staff involved in your care.",
            "We do not sell, rent, or share patient information with advertisers or unrelated third parties.",
          ],
        },
        {
          heading: "Sharing with insurers and TPAs",
          paragraphs: [
            "If you request cashless assistance, the minimum necessary clinical and billing information is shared with your insurer or third-party administrator for pre-authorisation and claim settlement. This happens only with your consent at the time of admission.",
          ],
        },
        {
          heading: "Data retention and security",
          paragraphs: [
            "Medical records are retained in line with statutory requirements applicable to hospitals in India. Access is restricted to authorised personnel, and physical records are stored in secured hospital premises.",
            "Website inquiry submissions are retained only as long as needed to respond to your query and complete any resulting consultation.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "You may request a copy of your medical records, ask for correction of factual errors in your demographic details, or withdraw consent for non-essential communication.",
          ],
          points: [
            "Requests can be made in person at the medical records desk with photo identification.",
            "Requests can also be initiated by calling the hospital helpline during working hours.",
          ],
        },
        {
          heading: "Cookies and analytics",
          paragraphs: [
            "This website uses only the storage required for the appointment booking flow to remember your selections between steps within the same browser session. No advertising or cross-site tracking cookies are set.",
          ],
        },
      ]}
    />
    </>
  );
}
