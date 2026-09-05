import { ConfirmationView } from "@/components/appointment/ConfirmationView";
import { Seo } from "@/components/Seo";

export default function ConfirmationPage() {
  return (
    <>
      <Seo
        title="Appointment Confirmed"
        description="Your OPD consultation at Brahmanandam Hospital, Sonari is confirmed. View your booking reference, OPD token, chamber details and visit instructions."
        noIndex
      />
      <ConfirmationView />
    </>
  );
}
