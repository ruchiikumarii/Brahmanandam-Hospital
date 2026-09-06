import { Hero } from "@/components/home/Hero";
import { QuickActions } from "@/components/home/QuickActions";
import { Specialities } from "@/components/home/Specialities";
import { DoctorsSection } from "@/components/home/DoctorsSection";
import { StatsBand, WhyChooseUs } from "@/components/home/WhyChooseUs";
import { BookingWorkflow } from "@/components/home/BookingWorkflow";
import {
  BlogSection,
  FacilitiesSection,
  InsuranceSection,
  TestimonialsSection,
} from "@/components/home/Sections";
import { LocationSection } from "@/components/home/LocationSection";
import { CoreServices, EmergencyHours } from "@/components/home/CoreServices";
import { HomeFaq } from "@/components/home/HomeFaq";
import { GallerySection } from "@/components/home/GallerySection";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { Seo } from "@/components/Seo";

export default function HomePage() {
  return (
    <>
      <Seo
        title="Brahmanandam Hospital Sonari | Multispeciality Hospital in Jamshedpur"
        description="Brahmanandam Hospital, Sonari is a multispeciality hospital in Jamshedpur with 24x7 emergency care, ICU, modular operation theatres, cardiology, maternity, orthopaedics, diagnostics and cashless TPA support. Call 8271827999."
      />
      <Hero />
      <QuickActions />
      <Specialities />
      <CoreServices />
      <EmergencyHours />
      <DoctorsSection />
      <WhyChooseUs />
      <StatsBand />
      <BookingWorkflow />
      <FacilitiesSection />
      <GallerySection />
      <InsuranceSection />
      <TestimonialsSection />
      <GoogleReviews />
      <BlogSection />
      <HomeFaq />
      <LocationSection />
    </>
  );
}
