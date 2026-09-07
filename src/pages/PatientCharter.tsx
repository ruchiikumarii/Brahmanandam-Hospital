import { LegalPage } from "@/components/layout/LegalPage";
import { Seo } from "@/components/Seo";


export default function PatientCharterPage() {
  return (
    <>
      <Seo
        title="Patient Charter"
        description="Patient rights and responsibilities at Brahmanandam Hospital, Sonari - dignity, information, consent, privacy, transparent billing and grievance redressal."
      />
      <LegalPage
      crumb="Patient Charter"
      eyebrow="Rights & Responsibilities"
      title="Patient Charter"
      subtitle="Every patient at Brahmanandam Hospital, Sonari is entitled to safe, respectful and transparent care. This charter sets out what you can expect from us, and what helps us care for you well."
      updated="1 January 2026"
      sections={[
        {
          heading: "Your rights as a patient",
          paragraphs: [
            "These rights apply equally to every patient, regardless of the department, ward category or payment method.",
          ],
          points: [
            "Dignity and respect: care free from discrimination, with privacy during examination and treatment.",
            "Information: a clear explanation of your diagnosis, proposed treatment, expected outcome and alternatives, in a language you understand.",
            "Informed consent: your written consent before any surgery, invasive procedure or anaesthesia, with the right to ask questions first.",
            "Second opinion: the right to seek another clinical opinion, within or outside this hospital.",
            "Transparent billing: a written estimate before planned treatment and an itemised bill at discharge.",
            "Confidentiality: your medical record shared only with those involved in your care, or as required by law.",
            "Refusal: the right to decline treatment after being informed of the consequences.",
            "Records: access to a copy of your medical records and investigation reports.",
          ],
        },
        {
          heading: "Your responsibilities",
          paragraphs: [
            "Safe care is a partnership. These steps help our clinical teams treat you accurately.",
          ],
          points: [
            "Share complete and accurate medical history, including all current medication and allergies.",
            "Follow the agreed treatment plan and attend scheduled follow-up visits.",
            "Respect hospital staff, other patients and visiting hours, and keep wards quiet.",
            "Observe infection-control instructions, especially in the ICU and neonatal areas.",
            "Settle bills as agreed, and inform the TPA desk early if insurance status changes.",
          ],
        },
        {
          heading: "Attendants and visitors",
          paragraphs: [
            "One attendant is permitted with in-patients at all times. ICU and neonatal units follow restricted visiting windows announced at the unit, with daily family briefings by the treating team.",
          ],
        },
        {
          heading: "Grievance redressal",
          paragraphs: [
            "If any part of your care falls short, we want to know. Raise the concern with the duty nursing in-charge first; unresolved matters are escalated to the patient relations desk and reviewed by the medical superintendent.",
            "You will receive an acknowledgement of a written complaint and an update on the outcome of the review.",
          ],
        },
      ]}
    />
    </>
  );
}
