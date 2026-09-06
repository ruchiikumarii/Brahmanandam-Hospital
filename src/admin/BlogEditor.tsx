import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle, ArrowLeft, Clock, Eye, FileUp, History, Loader2, Save, Send, Trash2,
} from "lucide-react";
import {
  createBlog, deleteBlog, getBlogById, listAllBlogs, listCategories,
  listVersions, publishNow, schedule, setStatus, updateBlog,
} from "@/lib/cms/admin-api";
import { importMarkdown } from "@/lib/cms/markdown-import";
import { estimateReadTime, slugify, type BlogPost, type Category } from "@/lib/cms/types";
import { isPubliclyVisible } from "@/lib/cms/visibility";
import { ORIGIN } from "@/lib/seo/route-meta";
import { useAuth } from "./AdminShell";
import { BlockEditor } from "./BlockEditor";
import { SeoField } from "./SeoField";
import { PreviewModal } from "./PreviewModal";

const input =
  "mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-[0.875rem] outline-none focus:border-slate-900";
const lbl = "text-[0.8125rem] font-semibold text-slate-700";

const empty = (): BlogPost => ({
  id: "", title: "", slug: "", excerpt: "", content: { blocks: [] },
  featured_image: null, image_alt: null, category: null, tags: [],
  seo_title: null, meta_description: null, focus_keyword: null,
  read_time: null, author: "Brahmanandam Hospital, Sonari", status: "draft",
  publish_at: null, published_at: null, time_zone: "Asia/Kolkata",
  related_blogs: [], faq: [], canonical_url: null, og_image: null,
  twitter_image: null, created_at: "", updated_at: "", created_by: null,
  updated_by: null, version: 1, source: "cms",
});

/** `datetime-local` value (wall clock in `tz`) -> UTC ISO. */
function localToUtc(local: string, tz: string): string {
  const asUtc = new Date(`${local}:00Z`).getTime();
  // Offset of the target zone at that instant, derived without extra deps.
  const probe = new Date(asUtc);
  const tzTime = new Date(probe.toLocaleString("en-US", { timeZone: tz }));
  const utcTime = new Date(probe.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(asUtc - (tzTime.getTime() - utcTime.getTime())).toISOString();
}

function utcToLocalInput(iso: string | null, tz: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(d);
  const g = (t: string) => parts.find((x) => x.type === t)?.value ?? "00";
  return `${g("year")}-${g("month")}-${g("day")}T${p(Number(g("hour")))}:${g("minute")}`;
}

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { email } = useAuth();

  const [post, setPost] = useState<BlogPost>(empty());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [others, setOthers] = useState<BlogPost[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [versions, setVersions] = useState<Awaited<ReturnType<typeof listVersions>>>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [scheduleAt, setScheduleAt] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importNote, setImportNote] = useState<string | null>(null);

  const dirty = useRef(false);
  const slugTouched = useRef(false);
  const savedRef = useRef<BlogPost>(post);

  /* ------------------------------------------------------------ load */
  useEffect(() => {
    void (async () => {
      try {
        const [all, categories] = await Promise.all([listAllBlogs(), listCategories()]);
        setCats(categories);
        if (!isNew) {
          const found = all.find((p) => p.id === id) ?? (await getBlogById(id!));
          if (found) {
            setPost(found);
            savedRef.current = found;
            setScheduleAt(utcToLocalInput(found.publish_at, found.time_zone));
          } else {
            setErr("Post not found");
          }
          setOthers(all.filter((p) => p.id !== id));
        } else {
          setOthers(all);
        }
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const live = isPubliclyVisible(post);

  const update = useCallback((patch: Partial<BlogPost>) => {
    dirty.current = true;
    setPost((p) => {
      const next = { ...p, ...patch };
      if (patch.title !== undefined && !slugTouched.current && !live) {
        next.slug = slugify(patch.title);
      }
      if (patch.content) next.read_time = estimateReadTime(patch.content);
      return next;
    });
  }, [live]);

  /* -------------------------------------------------------- save paths */
  const persist = useCallback(
    async (overrides: Partial<BlogPost> = {}, quiet = false) => {
      const draft = { ...post, ...overrides };
      if (!draft.title.trim()) throw new Error("Title is required");
      if (!draft.slug.trim()) draft.slug = slugify(draft.title);

      setSaving(true);
      try {
        const saved = draft.id
          ? await updateBlog(draft.id, draft, email)
          : await createBlog(draft, email);
        setPost(saved);
        savedRef.current = saved;
        dirty.current = false;
        if (!quiet) setMsg("Saved");
        if (!draft.id) navigate(`/admin/blogs/${saved.id}`, { replace: true });
        return saved;
      } finally {
        setSaving(false);
      }
    },
    [post, email, navigate],
  );

  const run = async (fn: () => Promise<unknown>) => {
    setErr(null);
    setMsg(null);
    try {
      await fn();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Action failed");
    }
  };

  /* --------------------------------------------------- autosave (30s) */
  useEffect(() => {
    const t = setInterval(() => {
      if (dirty.current && post.title.trim() && !saving) {
        void persist({}, true).then(() => setMsg("Autosaved")).catch(() => {});
      }
    }, 30_000);
    return () => clearInterval(t);
  }, [persist, post.title, saving]);

  /* --------------------------------------------------------- warnings */
  const dupe = useMemo(() => {
    const t = post.title.trim().toLowerCase();
    const s = post.slug.trim().toLowerCase();
    const byTitle = others.find((o) => o.title.trim().toLowerCase() === t && t);
    const bySlug = others.find((o) => o.slug.trim().toLowerCase() === s && s);
    return { byTitle, bySlug };
  }, [post.title, post.slug, others]);

  const seoCtx = useMemo(
    () => ({
      focusKeyword: post.focus_keyword,
      h1: post.title,
      otherTitles: others.map((o) => o.seo_title ?? "").filter(Boolean),
      otherDescriptions: others.map((o) => o.meta_description ?? "").filter(Boolean),
    }),
    [post.focus_keyword, post.title, others],
  );

  /* -------------------------------------------------- related picker */
  const autoAddLatest = () => {
    const pool = others
      .filter((o) => o.category === post.category)
      .filter((o) => o.status === "published" || o.status === "scheduled")
      .sort((a, b) => Date.parse(b.publish_at ?? "0") - Date.parse(a.publish_at ?? "0"))
      .slice(0, 4)
      .map((o) => o.slug);
    update({ related_blogs: [...new Set([...post.related_blogs, ...pool])] });
  };

  /* -------------------------------------------------- markdown import */
  const doImport = () => {
    try {
      const r = importMarkdown(importText);
      update({
        title: r.title, slug: r.slug, excerpt: r.excerpt, content: r.content,
        category: r.category ?? post.category, tags: r.tags.length ? r.tags : post.tags,
        author: r.author ?? post.author, seo_title: r.seo_title,
        meta_description: r.meta_description, focus_keyword: r.focus_keyword,
        featured_image: r.featured_image ?? post.featured_image,
        image_alt: r.image_alt ?? post.image_alt, read_time: r.read_time,
        faq: r.faq, related_blogs: r.related_blogs,
      });
      slugTouched.current = true;
      setImportNote(
        `Imported ${r.matched.length} metadata field(s), ${r.content.blocks.length} blocks, ` +
          `${r.faq.length} FAQ item(s), ${r.related_blogs.length} related slug(s).`,
      );
      setImportOpen(false);
      setImportText("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Import failed");
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <>
      {/* ------------------------------------------------------- header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/admin/blogs" className="rounded p-1.5 text-slate-500 hover:bg-slate-200">
            <ArrowLeft size={17} />
          </Link>
          <div>
            <h1 className="text-lg font-bold">{isNew ? "New post" : "Edit post"}</h1>
            <p className="text-[0.75rem] text-slate-500">
              {post.status}
              {post.publish_at
                ? ` · ${new Date(post.publish_at).toLocaleString("en-IN", { timeZone: post.time_zone })}`
                : ""}
              {post.read_time ? ` · ${post.read_time} min read` : ""}
              {live ? " · LIVE" : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {msg ? <span className="text-[0.75rem] font-semibold text-emerald-600">{msg}</span> : null}
          <button type="button" onClick={() => setImportOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[0.8125rem] font-semibold hover:bg-slate-100">
            <FileUp size={14} /> Import .md
          </button>
          <button type="button" onClick={() => setShowPreview(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[0.8125rem] font-semibold hover:bg-slate-100">
            <Eye size={14} /> Preview
          </button>
          {!isNew ? (
            <button type="button"
              onClick={() => run(async () => {
                setVersions(await listVersions(post.id));
                setShowVersions(true);
              })}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[0.8125rem] font-semibold hover:bg-slate-100">
              <History size={14} /> Versions
            </button>
          ) : null}
          <button type="button" disabled={saving}
            onClick={() => run(() => persist({ status: post.status === "published" ? "published" : "draft" }))}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[0.8125rem] font-semibold hover:bg-slate-100 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save draft
          </button>
          {/* Publish Now — no confirmation dialog, by design */}
          <button type="button" disabled={saving}
            onClick={() => run(async () => {
              const saved = await persist({}, true);
              const out = await publishNow(saved, email);
              setPost(out);
              setMsg("Published");
            })}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-[0.8125rem] font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
            <Send size={14} /> Publish now
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------ warnings */}
      {err ? (
        <p className="mt-3 rounded-lg bg-red-50 p-3 text-[0.8125rem] text-red-700">{err}</p>
      ) : null}
      {importNote ? (
        <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-[0.8125rem] text-emerald-800">{importNote}</p>
      ) : null}
      {dupe.byTitle || dupe.bySlug ? (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-[0.8125rem] text-amber-800">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>
            {dupe.bySlug ? (
              <>Slug <code className="font-mono">{post.slug}</code> is already used by “{dupe.bySlug.title}”. </>
            ) : null}
            {dupe.byTitle ? <>Another post has the same title (“{dupe.byTitle.title}”).</> : null}
          </span>
        </p>
      ) : null}

      {/* --------------------------------------------------------- body */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="grid min-w-0 gap-5">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <label className={lbl}>Title</label>
            <input value={post.title} onChange={(e) => update({ title: e.target.value })}
              className={input} placeholder="Post title" />

            <label className={`${lbl} mt-4 block`}>
              Slug {live ? <span className="text-amber-600">· frozen while live (old slug redirects)</span> : null}
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="shrink-0 text-[0.8125rem] text-slate-400">/blog/</span>
              <input value={post.slug}
                onChange={(e) => { slugTouched.current = true; update({ slug: slugify(e.target.value) }); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-[0.8125rem] outline-none focus:border-slate-900" />
            </div>

            <label className={`${lbl} mt-4 block`}>Excerpt</label>
            <textarea rows={2} value={post.excerpt} onChange={(e) => update({ excerpt: e.target.value })}
              className={`${input} resize-y`} placeholder="One or two sentences used on cards and as the description fallback" />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-1">
            <BlockEditor content={post.content} userEmail={email}
              onChange={(content) => update({ content })} />
          </section>

          {/* FAQ */}
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[0.9375rem] font-bold">FAQ</h2>
              <button type="button"
                onClick={() => update({ faq: [...post.faq, { question: "", answer: "" }] })}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[0.75rem] font-semibold">
                + Question
              </button>
            </div>
            <p className="mt-1 text-[0.75rem] text-slate-500">
              Rendered on the article and emitted as FAQPage structured data.
            </p>
            <div className="mt-3 grid gap-2.5">
              {post.faq.map((f, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex gap-1.5">
                    <input value={f.question} placeholder="Question"
                      onChange={(e) => update({
                        faq: post.faq.map((x, k) => (k === i ? { ...x, question: e.target.value } : x)),
                      })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[0.875rem] font-semibold outline-none focus:border-slate-900" />
                    <button type="button"
                      onClick={() => update({ faq: post.faq.filter((_, k) => k !== i) })}
                      className="shrink-0 rounded px-2 text-slate-400 hover:bg-slate-100">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <textarea rows={2} value={f.answer} placeholder="Answer"
                    onChange={(e) => update({
                      faq: post.faq.map((x, k) => (k === i ? { ...x, answer: e.target.value } : x)),
                    })}
                    className={`${input} resize-y`} />
                </div>
              ))}
            </div>
          </section>

          {/* Related */}
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[0.9375rem] font-bold">Related in this series</h2>
              <button type="button" onClick={autoAddLatest}
                className="rounded-lg bg-slate-900 px-2.5 py-1 text-[0.75rem] font-semibold text-white">
                Auto-add latest
              </button>
            </div>
            <p className="mt-1 text-[0.75rem] text-slate-500">
              Adds the last 4 published or scheduled posts in “{post.category ?? "this category"}”. Order is preserved.
            </p>

            {post.related_blogs.length ? (
              <ol className="mt-3 grid gap-1.5">
                {post.related_blogs.map((s, i) => (
                  <li key={s} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                    <span className="truncate font-mono text-[0.75rem]">{i + 1}. {s}</span>
                    <button type="button"
                      onClick={() => update({ related_blogs: post.related_blogs.filter((x) => x !== s) })}
                      className="shrink-0 rounded px-1.5 text-slate-400 hover:bg-slate-200">
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ol>
            ) : null}

            <input list="all-slugs" placeholder="Search all posts by title or slug, then Enter"
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                const raw = (e.target as HTMLInputElement).value.trim();
                const hit = others.find(
                  (o) => o.slug === raw || o.title.toLowerCase() === raw.toLowerCase(),
                );
                const slug = hit?.slug ?? slugify(raw);
                if (slug) update({ related_blogs: [...new Set([...post.related_blogs, slug])] });
                (e.target as HTMLInputElement).value = "";
              }}
              className={input} />
            <datalist id="all-slugs">
              {others.map((o) => (
                <option key={o.id} value={o.slug}>{o.title}</option>
              ))}
            </datalist>
          </section>
        </div>

        {/* ------------------------------------------------------ sidebar */}
        <aside className="grid gap-4 lg:sticky lg:top-20">
          {/* schedule */}
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="flex items-center gap-1.5 text-[0.875rem] font-bold">
              <Clock size={14} /> Schedule
            </h2>
            <input type="datetime-local" value={scheduleAt}
              onChange={(e) => setScheduleAt(e.target.value)} className={input} />
            <select value={post.time_zone} onChange={(e) => update({ time_zone: e.target.value })}
              className={input}>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="Asia/Dubai">Asia/Dubai</option>
            </select>
            <button type="button" disabled={!scheduleAt || saving}
              onClick={() => run(async () => {
                const saved = await persist({}, true);
                const iso = localToUtc(scheduleAt, post.time_zone);
                const out = await schedule(saved, iso, post.time_zone, email);
                setPost(out);
                setMsg("Scheduled");
              })}
              className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-lg bg-blue-600 text-[0.8125rem] font-bold text-white disabled:opacity-50">
              Schedule
            </button>
            <p className="mt-2 text-[0.6875rem] leading-relaxed text-slate-500">
              Stored in UTC. The post becomes visible when the clock passes it — no status flip.
            </p>
          </section>

          {/* organise */}
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <label className={lbl}>Category</label>
            <input list="cat-list" value={post.category ?? ""}
              onChange={(e) => update({ category: e.target.value || null })} className={input} />
            <datalist id="cat-list">
              {cats.map((c) => <option key={c.id} value={c.name} />)}
            </datalist>

            <label className={`${lbl} mt-3 block`}>Tags (comma separated)</label>
            <input value={post.tags.join(", ")}
              onChange={(e) => update({
                tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
              })} className={input} />

            <label className={`${lbl} mt-3 block`}>Author</label>
            <input value={post.author ?? ""} onChange={(e) => update({ author: e.target.value })}
              className={input} />
          </section>

          {/* image */}
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <label className={lbl}>Featured image URL</label>
            <input value={post.featured_image ?? ""}
              onChange={(e) => update({ featured_image: e.target.value || null })} className={input} />
            {post.featured_image ? (
              <img src={post.featured_image} alt="" className="mt-2 rounded-lg" />
            ) : null}
            <label className={`${lbl} mt-3 block`}>Image ALT</label>
            <input value={post.image_alt ?? ""}
              onChange={(e) => update({ image_alt: e.target.value || null })} className={input} />
          </section>

          {/* SEO */}
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-[0.875rem] font-bold">SEO</h2>

            <div className="mt-3">
              <label className={lbl}>Focus keyword</label>
              <input value={post.focus_keyword ?? ""}
                onChange={(e) => update({ focus_keyword: e.target.value || null })}
                className={input} placeholder="e.g. paediatric asthma" />
              {!post.focus_keyword ? (
                <p className="mt-1 text-[0.6875rem] text-amber-600">
                  Add a focus keyword to score the keyword rules.
                </p>
              ) : null}
            </div>

            <div className="mt-4">
              <SeoField kind="title" label="SEO title" value={post.seo_title ?? ""}
                onChange={(v) => update({ seo_title: v || null })} postTitle={post.title}
                excerpt={post.excerpt} focusKeyword={post.focus_keyword ?? ""} ctx={seoCtx}
                placeholder="Search-facing title (not the H1)" />
            </div>

            <div className="mt-4">
              <SeoField kind="description" label="Meta description"
                value={post.meta_description ?? ""}
                onChange={(v) => update({ meta_description: v || null })} postTitle={post.title}
                excerpt={post.excerpt} focusKeyword={post.focus_keyword ?? ""} ctx={seoCtx}
                placeholder="120–160 characters with the keyword and a call to action" />
            </div>

            <label className={`${lbl} mt-4 block`}>Canonical URL</label>
            <input value={post.canonical_url ?? `${ORIGIN}/blog/${post.slug}`}
              onChange={(e) => update({ canonical_url: e.target.value || null })}
              className={`${input} font-mono text-[0.75rem]`} />
          </section>

          {/* danger zone */}
          {!isNew ? (
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <button type="button"
                onClick={() => run(async () => {
                  const next = post.status === "archived" ? "draft" : "archived";
                  setPost(await setStatus(post.id, next, email));
                  setMsg(next === "archived" ? "Archived" : "Unarchived");
                })}
                className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-slate-300 text-[0.8125rem] font-semibold hover:bg-slate-100">
                {post.status === "archived" ? "Unarchive" : "Archive"}
              </button>
              <button type="button"
                onClick={() => {
                  if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
                  if (live && window.prompt("This post is LIVE. Type DELETE to confirm.") !== "DELETE") return;
                  void run(async () => {
                    await deleteBlog(post.id);
                    navigate("/admin/blogs");
                  });
                }}
                className="mt-2 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-red-50 text-[0.8125rem] font-semibold text-red-700 hover:bg-red-100">
                <Trash2 size={14} /> Delete post
              </button>
            </section>
          ) : null}
        </aside>
      </div>

      {/* ------------------------------------------------------- modals */}
      {showPreview ? (
        <PreviewModal post={post} onClose={() => setShowPreview(false)} />
      ) : null}

      {importOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
          onClick={() => setImportOpen(false)}>
          <div className="w-full max-w-2xl rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-bold">Import from Markdown</h2>
            <p className="mt-1 text-[0.8125rem] text-slate-500">
              Paste a <code>.md</code> file, or upload one. YAML frontmatter and a leading{" "}
              <code>&lt;!-- SEO title: … --&gt;</code> comment block are both read; <code>Primary query</code>{" "}
              becomes the focus keyword. <code>## FAQ</code> and <code>## Related</code> sections are parsed out.
            </p>
            <input type="file" accept=".md,.markdown,.txt" className="mt-3 text-[0.8125rem]"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) setImportText(await f.text());
              }} />
            <textarea rows={12} value={importText} onChange={(e) => setImportText(e.target.value)}
              className="mt-3 w-full rounded-lg border border-slate-300 p-3 font-mono text-[0.75rem] outline-none focus:border-slate-900"
              placeholder="Paste markdown here…" />
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => setImportOpen(false)}
                className="h-9 rounded-lg border border-slate-300 px-4 text-[0.8125rem] font-semibold">
                Cancel
              </button>
              <button type="button" disabled={!importText.trim()} onClick={doImport}
                className="h-9 rounded-lg bg-slate-900 px-4 text-[0.8125rem] font-bold text-white disabled:opacity-50">
                Import
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showVersions ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
          onClick={() => setShowVersions(false)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-bold">Version history</h2>
            {versions.length === 0 ? (
              <p className="mt-2 text-[0.8125rem] text-slate-500">No earlier versions yet.</p>
            ) : (
              <ul className="mt-3 grid max-h-80 gap-1.5 overflow-y-auto">
                {versions.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-[0.8125rem]">
                      v{v.version}
                      <span className="ml-2 text-slate-400">
                        {new Date(v.created_at).toLocaleString("en-IN")}
                      </span>
                    </span>
                    <button type="button"
                      onClick={() => {
                        const snap = v.snapshot as BlogPost;
                        setPost({ ...snap, id: post.id, version: post.version });
                        dirty.current = true;
                        setShowVersions(false);
                        setMsg(`Restored v${v.version} — save to keep it`);
                      }}
                      className="rounded-lg bg-slate-900 px-2.5 py-1 text-[0.75rem] font-semibold text-white">
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
