import type { BlogPost } from "@/lib/cms/types";
import { blocksToText } from "@/lib/cms/types";
import { pickRelated } from "@/lib/cms/posts";

/**
 * One function that produces the head for any route.
 *
 * The prerender script calls it to write real tags into the initial HTML
 * (so crawlers see them without running JS), and <Seo> calls it again on
 * client-side navigation to keep the head in sync. Same input, same output —
 * no drift between the two.
 */

export const ORIGIN = "https://sonari.brahmanandamhospital.in";
export const SITE_NAME = "Brahmanandam Hospital, Sonari";
const DEFAULT_IMAGE = "/images/general/hospital-exterior.jpg";

export type RouteMeta = {
  title: string;
  description: string;
  canonical: string;
  image: string;
  noIndex: boolean;
  jsonLd: object[];
};

const abs = (p: string) => (p.startsWith("http") ? p : ORIGIN + p);

/* -------------------------------------------------- fixed marketing routes */

type Fixed = { title: string; description: string; noIndex?: boolean };

export const FIXED_ROUTES: Record<string, Fixed> = {
  "/": {
    title: "Brahmanandam Hospital Sonari | Multispeciality Hospital in Jamshedpur",
    description:
      "Brahmanandam Hospital, Sonari is a multispeciality hospital in Jamshedpur with 24x7 emergency care, ICU, modular operation theatres, cardiology, maternity, orthopaedics, diagnostics and cashless TPA support. Call 8271827999.",
  },
  "/about": {
    title: "About Us | Best Hospital in Jamshedpur for Quality Healthcare",
    description:
      "About Brahmanandam Hospital, Sonari — a trusted multispeciality healthcare provider in Jamshedpur combining modern medical technology, experienced doctors and a patient-first approach.",
  },
  "/chairmans-message": {
    title: "Chairman's Message",
    description:
      "A message from Mr. Monu Bhattacharya, Chairman of Brahmanandam Hospital, Sonari, on compassion, integrity and accessible quality healthcare for Jamshedpur.",
  },
  "/ceo-message": {
    title: "CEO Message",
    description:
      "A message from M. Srinivas Rao, CEO of Brahmanandam Hospital, Sonari, on compassionate, reliable and high-quality healthcare for Jamshedpur.",
  },
  "/our-directors": {
    title: "Our Directors",
    description:
      "The leadership team of Brahmanandam Hospital, Sonari — driven by a shared vision of delivering compassionate, ethical and high-quality healthcare in Jamshedpur.",
  },
  "/mission-vision-values": {
    title: "Mission, Vision and Values",
    description:
      "The mission, vision and seven core values of Brahmanandam Hospital, Sonari — quality, compassion, integrity, teamwork, service, innovation and responsibility.",
  },
  "/quality-and-safety": {
    title: "Quality and Safety",
    description:
      "Quality care and patient safety at Brahmanandam Hospital, Sonari — regulatory compliance, clinical risk management, infection control, patient safety and continuous quality improvement.",
  },
  "/doctors": {
    title: "Doctors in Sonari, Jamshedpur | Our Medical Faculty & Specialists",
    description:
      "Find doctors in Sonari, Jamshedpur — cardiologists, gynaecologists, orthopaedic surgeons, physicians, paediatricians and urologists at Brahmanandam Hospital. See OPD timings, chamber, fees and book online.",
  },
  "/departments": {
    title: "Departments | Multispeciality Hospital in Sonari, Jamshedpur",
    description:
      "Explore 20+ specialities at Brahmanandam Hospital, Sonari — cardiology and cath lab, orthopaedics, gynaecology, paediatrics, general surgery, emergency and trauma care, ICU, radiology and pathology in Jamshedpur.",
  },
  "/services": {
    title: "Hospital Services in Jamshedpur | Emergency, ICU, OT & Diagnostics",
    description:
      "24x7 emergency care, ICU and critical care, modular operation theatres, diagnostic imaging, clinical pathology, in-house pharmacy, ambulance and preventive health check-ups at Brahmanandam Hospital, Sonari, Jamshedpur.",
  },
  "/facilities": {
    title: "Hospital Facilities in Sonari, Jamshedpur",
    description:
      "Trauma centre, ICU and critical care, laminar airflow operation theatres, modern diagnostics, 24x7 in-house pharmacy and ambulance fleet at Brahmanandam Hospital, Sonari, Jamshedpur.",
  },
  "/gallery": {
    title: "Hospital Gallery",
    description:
      "Photo gallery of Brahmanandam Hospital, Sonari — emergency and trauma entrance, ICU, modular operation theatres, diagnostics lab, 24x7 pharmacy, ambulance fleet and OPD consultation rooms.",
  },
  "/health-packages": {
    title: "Preventive Health Check-up Packages",
    description:
      "Preventive health check-up packages at Brahmanandam Hospital, Sonari, Jamshedpur — basic health check, diabetes care, cardiac screening, women's health, senior citizen and executive check-ups with same-day reports.",
  },
  "/insurance": {
    title: "Cashless Hospital in Jamshedpur | TPA & Insurance Partners",
    description:
      "Cashless hospitalisation at Brahmanandam Hospital, Sonari — empanelled with Star Health, ICICI Lombard, HDFC ERGO, Bajaj Allianz, Medi Assist, Paramount and more. Pre-authorisation handled by our TPA desk.",
  },
  "/patient-services": {
    title: "Patient Services",
    description:
      "Support facilities at Brahmanandam Hospital, Sonari — 24x7 pharmacy, blood bank coordination, ambulance, laundry, patient assistance, safe drinking water and cafeteria.",
  },
  "/admission-process": {
    title: "Admission Process",
    description:
      "Registration, admission procedure, room types, billing and payment methods for inpatient admission at Brahmanandam Hospital, Sonari, Jamshedpur.",
  },
  "/discharge-process": {
    title: "Discharge Process",
    description:
      "Discharge formalities at Brahmanandam Hospital, Sonari — billing, discharge summary, medication, medico-legal cases, certificates and patient feedback.",
  },
  "/visitor-guidelines": {
    title: "Guidelines for Visitors",
    description:
      "Visitor rules at Brahmanandam Hospital, Sonari — infection control, attendant policy, visiting conduct, parking, payments and fire safety guidelines.",
  },
  "/patient-rights": {
    title: "Patient and Attendant Rights",
    description:
      "Patient and attendant rights at Brahmanandam Hospital, Sonari — dignity, privacy, clear medical information, safety, cost transparency and access to medical records.",
  },
  "/careers": {
    title: "Careers",
    description:
      "Careers at Brahmanandam Hospital, Sonari, Jamshedpur — clinical, diagnostic, support and administrative roles. Send your resume to our careers desk.",
  },
  "/csr": {
    title: "Corporate Social Responsibility (CSR)",
    description:
      "CSR at Brahmanandam Hospital, Sonari — free health check-up camps, community health awareness, women and child health support, and help for underprivileged patients in Jamshedpur.",
  },
  "/faq": {
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions about Brahmanandam Hospital, Sonari — location, working hours, appointments, available specialities, insurance and online consultation.",
  },
  "/appointment": {
    title: "Book an Appointment — Online OPD Chamber Desk",
    description:
      "Schedule a confirmed OPD consultation with senior specialists at Brahmanandam Hospital, Sonari. Choose department, doctor, date and slot — instant SMS token, no advance payment.",
  },
  "/appointment/confirmation": {
    title: "Appointment Confirmed",
    description:
      "Your OPD consultation at Brahmanandam Hospital, Sonari is confirmed.",
    noIndex: true,
  },
  "/contact": {
    title: "Contact | Hospital in Sonari, Jamshedpur — 24x7 Helpline",
    description:
      "Contact Brahmanandam Hospital, Sonari — 184, Near Road No. 3, Kagal Nagar, Jamshedpur 831011. 24x7 helpline 8271827999, WhatsApp, email, Google Maps directions and OPD timings.",
  },
  "/blog": {
    title: "Health Blog — Latest Medical Insights",
    description:
      "Preventive wellness guidance and specialist articles by senior doctors at Brahmanandam Hospital, Sonari — cardiology, diabetes care and child health.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "How Brahmanandam Hospital, Sonari collects, uses and protects patient information submitted through appointment booking and inquiry forms.",
  },
  "/terms": {
    title: "Terms & Conditions",
    description:
      "Terms governing use of the Brahmanandam Hospital, Sonari website, online OPD appointment booking, cancellations and medical disclaimers.",
  },
  "/patient-charter": {
    title: "Patient Charter",
    description:
      "Patient rights and responsibilities at Brahmanandam Hospital, Sonari — dignity, information, consent, privacy, transparent billing and grievance redressal.",
  },
};

/* ------------------------------------------------------------- blog schema */

export function blogPostJsonLd(post: BlogPost): object {
  const body = blocksToText(post.content);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${ORIGIN}/blog/${post.slug}#post`,
    headline: post.seo_title || post.title,
    name: post.title,
    description: post.meta_description || post.excerpt,
    image: abs(post.featured_image ?? DEFAULT_IMAGE),
    datePublished: post.publish_at,
    dateModified: post.updated_at || post.publish_at,
    wordCount: body.split(/\s+/).filter(Boolean).length,
    keywords: [post.focus_keyword, ...(post.tags ?? [])].filter(Boolean).join(", "),
    articleSection: post.category ?? undefined,
    inLanguage: "en-IN",
    author: {
      "@type": post.author ? "Person" : "Organization",
      name: post.author || SITE_NAME,
    },
    publisher: { "@id": `${ORIGIN}/#hospital` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${ORIGIN}/blog/${post.slug}` },
  };
}

function faqJsonLd(post: BlogPost): object | null {
  if (!post.faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

function breadcrumbJsonLd(trail: { name: string; path?: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
      ...trail.map((t, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: t.name,
        ...(t.path ? { item: ORIGIN + t.path } : {}),
      })),
    ],
  };
}

/* ------------------------------------------------------------------ public */

/**
 * Head for a route. `posts` is the already-visibility-filtered list, so an
 * unpublished slug simply is not found and the caller renders a 404.
 */
export function getRouteMeta(pathname: string, posts: BlogPost[] = []): RouteMeta {
  const path = pathname.replace(/\/+$/, "") || "/";
  const canonical = ORIGIN + (path === "/" ? "/" : path);

  /* ---- blog article */
  const m = /^\/blog\/([^/]+)$/.exec(path);
  if (m) {
    const post = posts.find((p) => p.slug === m[1]);
    if (!post) {
      return {
        title: "Page not found",
        description: "The article you were looking for could not be found.",
        canonical,
        image: abs(DEFAULT_IMAGE),
        noIndex: true,
        jsonLd: [],
      };
    }
    const jsonLd: object[] = [
      breadcrumbJsonLd([
        { name: "Health Blog", path: "/blog" },
        { name: post.category ?? "Article" },
      ]),
      blogPostJsonLd(post),
    ];
    const faq = faqJsonLd(post);
    if (faq) jsonLd.push(faq);

    return {
      title: `${post.seo_title || post.title} | ${SITE_NAME}`,
      description: post.meta_description || post.excerpt,
      canonical: post.canonical_url || canonical,
      image: abs(post.og_image || post.featured_image || DEFAULT_IMAGE),
      noIndex: false,
      jsonLd,
    };
  }

  /* ---- fixed route */
  const fixed = FIXED_ROUTES[path];
  if (fixed) {
    return {
      title: path === "/" ? fixed.title : `${fixed.title} | ${SITE_NAME}`,
      description: fixed.description,
      canonical,
      image: abs(DEFAULT_IMAGE),
      noIndex: Boolean(fixed.noIndex),
      jsonLd: [],
    };
  }

  /* ---- anything else (dynamic doctor/department pages keep their own <Seo>) */
  return {
    title: SITE_NAME,
    description: FIXED_ROUTES["/"].description,
    canonical,
    image: abs(DEFAULT_IMAGE),
    noIndex: false,
    jsonLd: [],
  };
}

/** Related posts for an article page, using the shared visibility-filtered list. */
export function relatedFor(post: BlogPost, posts: BlogPost[]) {
  return pickRelated(post, posts, 3);
}
