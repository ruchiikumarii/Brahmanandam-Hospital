import { LegalPage } from "@/components/layout/LegalPage";
import { Seo } from "@/components/Seo";


export default function TermsPage() {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        description="Terms governing use of the Brahmanandam Hospital, Sonari website, online OPD appointment booking, cancellations and medical disclaimers."
      />
      <LegalPage
      crumb="Terms & Conditions"
      eyebrow="Website & Booking Terms"
      title="Terms & Conditions"
      subtitle="These terms govern your use of this website and the online OPD appointment service operated by Brahmanandam Hospital, Sonari, Jamshedpur."
      updated="1 January 2026"
      sections={[
        {
          heading: "Medical disclaimer",
          paragraphs: [
            "Content on this website — including department descriptions, doctor profiles and health articles — is provided for general information. It is not a substitute for professional medical advice, diagnosis or treatment.",
            "Never disregard or delay seeking medical advice because of something you have read here. In an emergency, call our helpline or report directly to the casualty department.",
          ],
        },
        {
          heading: "Appointment booking",
          paragraphs: [
            "Online booking reserves an OPD slot with the selected consultant, subject to the doctor's availability on the day.",
          ],
          points: [
            "No advance online payment is required; consultation fees are payable at the OPD counter or by UPI at the hospital.",
            "Slots are held against the mobile number provided. Please carry the booking reference or SMS token.",
            "Report 15 minutes before your slot for vitals recording and registration.",
            "Emergency admissions and critical cases may cause unavoidable delays to scheduled OPD timings.",
          ],
        },
        {
          heading: "Cancellation and rescheduling",
          paragraphs: [
            "Appointments can be cancelled or rescheduled free of charge at any time before the scheduled slot by calling the hospital helpline. No cancellation fee is levied.",
            "If a consultant is unavailable due to an emergency procedure, our desk will contact you to reschedule at the earliest convenient slot.",
          ],
        },
        {
          heading: "Fees and estimates",
          paragraphs: [
            "Charges are not published on this website. Consultation, investigation, procedure and admission charges are confirmed at the hospital, and a written estimate is shared before treatment begins.",
            "Insurance coverage depends on your individual policy terms. Non-payable items are explained by the TPA desk before discharge.",
          ],
        },
        {
          heading: "Acceptable use",
          paragraphs: [
            "You agree to provide accurate patient information when booking, and not to use this website to submit false bookings, attempt unauthorised access, or disrupt hospital services.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            "These terms are governed by the laws of India. Any dispute is subject to the jurisdiction of the courts at Jamshedpur, Jharkhand.",
          ],
        },
      ]}
    />
    </>
  );
}
