import { Newspaper } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { BlogSection } from "@/components/home/Sections";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";


export default function BlogPage() {
  return (
    <>
      <Seo
        title="Health Blog — Latest Medical Insights"
        description="Preventive wellness guidance and specialist articles by senior doctors at Brahmanandam Hospital, Sonari — cardiology, diabetes care and child health."
      />
      <PageHero
        crumbs={[{ label: "Health Blog" }]}
        eyebrow="Health Knowledge"
        title="Latest Medical Insights"
        subtitle="Preventive wellness guidance and specialist articles written by our senior consultants at the Sonari campus."
        icon={<Newspaper size={14} className="text-secondary" />}
      />
      <BlogSection />
      <EmergencyBanner />
    </>
  );
}
