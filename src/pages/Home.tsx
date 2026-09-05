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
import { Seo } from "@/components/Seo";

export default function HomePage() {
  return (
    <>
      <Seo
        title="Brahmanandam Hospital, Sonari | Multi Specialty Centre in Jamshedpur"
        description="Brahmanandam Hospital, Sonari is a multi specialty centre in Jamshedpur offering 24x7 emergency care, ICU, advanced operation theatres, cardiology, maternity, orthopaedics and cashless TPA support."
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
      <BlogSection />
      <HomeFaq />
      <LocationSection />
    </>
  );
}
