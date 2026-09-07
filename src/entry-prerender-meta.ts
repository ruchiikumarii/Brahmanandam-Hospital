// Re-exported for the prerender script: one head-builder for build and client.
export { getRouteMeta, FIXED_ROUTES } from "@/lib/seo/route-meta";

/*
 * Route slugs come from the data itself. They used to be typed into the
 * prerender script by hand, which meant every new doctor or department was
 * silently left out of the static build and the sitemap.
 */
import { doctors } from "@/lib/data/doctors";
import { departments } from "@/lib/data/departments";

export const DOCTOR_SLUGS = doctors.map((d) => d.slug);
export const DEPARTMENT_SLUGS = departments.map((d) => d.slug);
