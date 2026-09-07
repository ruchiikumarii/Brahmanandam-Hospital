import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { galleryItems } from "@/lib/data/gallery";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui";

export default function GalleryPage() {
  return (
    <>
      <Seo
        crumbs={[{ label: "Gallery" }]}
        title="Hospital Gallery"
        description="Photo gallery of Brahmanandam Hospital, Sonari - emergency and trauma entrance, ICU, modular operation theatres, diagnostics lab, 24x7 pharmacy, ambulance fleet and OPD consultation rooms."
      />
      <PageHero
        crumbs={[{ label: "Gallery" }]}
        eyebrow="Hospital Gallery • Sonari, Jamshedpur"
        title="Inside Brahmanandam Hospital"
        subtitle="A look at our emergency wing, critical care units, operation theatres, diagnostic lab, pharmacy and consultation chambers at the Kagal Nagar campus."
        icon={<Icon name="scan" size={14} className="text-secondary" />}
        aside={
          <div className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card">
            <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
              In this gallery
            </p>
            <p className="mt-3 font-display text-[2.25rem] leading-none font-extrabold text-primary">
              {galleryItems.length}
            </p>
            <p className="mt-2 text-[0.875rem] text-muted">
              Photographs across the campus, emergency wing, critical care,
              diagnostics and OPD.
            </p>
          </div>
        }
      />

      <Section tone="soft" backdrop="soft">
        <GalleryGrid />
      </Section>

      <EmergencyBanner />
    </>
  );
}
