import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "Brahmanandam Hospital, Sonari";
const ORIGIN = "https://sonari.brahmanandamhospital.in";

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
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

/**
 * Keeps <title>, description, canonical and Open Graph tags in sync with the
 * route. Rendered near the top of every page component.
 */
export function Seo({
  title,
  description,
  noIndex = false,
}: {
  title: string;
  description: string;
  noIndex?: boolean;
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const full = pathname === "/" ? title : `${title} | ${SITE}`;
    document.title = full;

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow",
    );
    setMeta('meta[property="og:title"]', "property", "og:title", full);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    setMeta('meta[property="og:url"]', "property", "og:url", ORIGIN + pathname);
    setLink("canonical", ORIGIN + pathname);
  }, [title, description, noIndex, pathname]);

  return null;
}
