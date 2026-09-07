import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { Crumb } from "@/components/layout/Breadcrumbs";

const SITE = "Brahmanandam Hospital, Sonari";
const ORIGIN = "https://sonari.brahmanandamhospital.in";

function setMeta(
  selector: string,
  attr: "name" | "property",
  key: string,
  content: string,
) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Route-level structured data lives in its own tag so it can be swapped cleanly. */
const ROUTE_LD_ID = "route-jsonld";

function setJsonLd(blocks: object[]) {
  document.getElementById(ROUTE_LD_ID)?.remove();
  if (!blocks.length) return;
  const tag = document.createElement("script");
  tag.type = "application/ld+json";
  tag.id = ROUTE_LD_ID;
  tag.textContent = JSON.stringify(
    blocks.length === 1 ? blocks[0] : { "@graph": blocks },
  );
  document.head.appendChild(tag);
}

/**
 * Keeps <title>, description, canonical, Open Graph, Twitter and JSON-LD in
 * sync with the current route.
 */
export function Seo({
  title,
  description,
  crumbs,
  image = "/images/general/hospital-exterior.jpg",
  schema,
  noIndex = false,
}: {
  title: string;
  description: string;
  /** Same trail shown in the UI — emitted as BreadcrumbList structured data. */
  crumbs?: Crumb[];
  image?: string;
  /** Extra JSON-LD for this route (Physician, MedicalClinic, FAQPage…). */
  schema?: object | object[];
  noIndex?: boolean;
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const full = pathname === "/" ? title : `${title} | ${SITE}`;
    const url = ORIGIN + pathname;
    const img = image.startsWith("http") ? image : ORIGIN + image;

    document.title = full;

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow",
    );

    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:title"]', "property", "og:title", full);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", img);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE);

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", full);
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", img);

    setLink("canonical", url);

    const blocks: object[] = [];

    if (crumbs?.length) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: ORIGIN + "/",
          },
          ...crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: c.label,
            ...(c.href ? { item: ORIGIN + c.href } : {}),
          })),
        ],
      });
    }

    if (schema) {
      blocks.push(...(Array.isArray(schema) ? schema : [schema]));
    }

    setJsonLd(blocks);
  }, [title, description, noIndex, pathname, image, crumbs, schema]);

  return null;
}

/* --------------------------------------------------------- schema helpers */

export const HOSPITAL_ID = `${ORIGIN}/#hospital`;

/** Physician structured data for a doctor profile. */
export function physicianSchema(d: {
  name: string;
  slug: string;
  qualification?: string;
  designation: string;
  specialtyLabel: string;
  photo?: string;
  daysLabel: string;
  opdTiming: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${ORIGIN}/doctors/${d.slug}#physician`,
    name: d.name,
    url: `${ORIGIN}/doctors/${d.slug}`,
    medicalSpecialty: d.specialtyLabel,
    jobTitle: d.designation,
    description: `${d.name}${d.qualification ? ", " + d.qualification : ""}. ${d.designation} at Brahmanandam Hospital, Sonari, Jamshedpur.`,
    worksFor: { "@id": HOSPITAL_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: "184, Near Road No. 3, Kagal Nagar, Sonari",
      addressLocality: "Jamshedpur",
      addressRegion: "Jharkhand",
      postalCode: "831011",
      addressCountry: "IN",
    },
    telephone: "+918271827999",
    ...(d.photo ? { image: ORIGIN + d.photo } : {}),
  };
}

/** MedicalClinic structured data for a department page. */
export function departmentSchema(dept: {
  name: string;
  slug: string;
  summary: string;
  procedures: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${ORIGIN}/departments/${dept.slug}#department`,
    name: `${dept.name} - Brahmanandam Hospital, Sonari`,
    url: `${ORIGIN}/departments/${dept.slug}`,
    description: dept.summary,
    parentOrganization: { "@id": HOSPITAL_ID },
    telephone: "+918271827999",
    availableService: dept.procedures.map((p) => ({
      "@type": "MedicalProcedure",
      name: p,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: "184, Near Road No. 3, Kagal Nagar, Sonari",
      addressLocality: "Jamshedpur",
      addressRegion: "Jharkhand",
      postalCode: "831011",
      addressCountry: "IN",
    },
  };
}

/** FAQPage structured data — powers rich results for question searches. */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BlogPosting structured data for an article. */
export function articleSchema(a: {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${ORIGIN}/blog/${a.slug}#post`,
    headline: a.title,
    description: a.excerpt,
    image: ORIGIN + a.image,
    datePublished: new Date(a.date).toISOString().slice(0, 10),
    author: { "@type": "Organization", name: a.author },
    publisher: { "@id": HOSPITAL_ID },
    mainEntityOfPage: `${ORIGIN}/blog/${a.slug}`,
  };
}
