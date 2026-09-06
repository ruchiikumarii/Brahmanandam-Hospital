import { X } from "lucide-react";
import type { BlogPost } from "@/lib/cms/types";
import { RichText, BlockList } from "@/components/blog/BlockList";

/** Live preview of the article body exactly as the public page renders it. */
export function PreviewModal({
  post,
  onClose,
}: {
  post: BlogPost;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div
        className="mx-auto max-w-3xl rounded-xl bg-white p-6 sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[0.6875rem] font-bold tracking-wide text-slate-400 uppercase">
            Preview · not saved
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={17} />
          </button>
        </div>

        {/* search snippet preview */}
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-[0.75rem] text-emerald-700">
            sonari.brahmanandamhospital.in › blog › {post.slug || "slug"}
          </p>
          <p className="mt-0.5 text-[1.0625rem] leading-snug text-blue-800">
            {post.seo_title || post.title || "Untitled"}
          </p>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-slate-600">
            {post.meta_description || post.excerpt || "No description set."}
          </p>
        </div>

        <article className="mt-7">
          <h1 className="text-[1.875rem] leading-tight font-extrabold text-slate-900">
            {post.title || "Untitled"}
          </h1>
          {post.excerpt ? (
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-slate-500">
              {post.excerpt}
            </p>
          ) : null}
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.image_alt ?? ""}
              className="mt-5 w-full rounded-xl"
            />
          ) : null}

          <div className="mt-6">
            <BlockList content={post.content} />
          </div>

          {post.faq.length ? (
            <section className="mt-8">
              <h2 className="text-[1.375rem] font-extrabold text-slate-900">
                Frequently asked questions
              </h2>
              <dl className="mt-3 grid gap-3">
                {post.faq.map((f) => (
                  <div key={f.question} className="rounded-lg bg-slate-50 p-4">
                    <dt className="font-bold text-slate-900">{f.question}</dt>
                    <dd className="mt-1 text-slate-600">
                      <RichText text={f.answer} />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </article>
      </div>
    </div>
  );
}
