import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpDown, Archive, ArchiveRestore, Copy, ExternalLink, Loader2,
  Pencil, Plus, Search, Send, Trash2,
} from "lucide-react";
import {
  createBlog, deleteBlog, listAllBlogs, publishNow, setStatus,
} from "@/lib/cms/admin-api";
import type { BlogPost, BlogStatus } from "@/lib/cms/types";
import { slugify } from "@/lib/cms/types";
import { isPubliclyVisible } from "@/lib/cms/visibility";
import { useAuth } from "./AdminShell";

const TABS: (BlogStatus | "all")[] = [
  "all", "published", "scheduled", "draft", "archived",
];

const STATUS_STYLE: Record<BlogStatus, string> = {
  published: "bg-emerald-100 text-emerald-800",
  scheduled: "bg-blue-100 text-blue-800",
  draft: "bg-slate-200 text-slate-700",
  archived: "bg-amber-100 text-amber-800",
};

type SortKey = "publish_at" | "title" | "category" | "status" | "updated_at";

const IST = "Asia/Kolkata";
const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric", timeZone: IST,
      })
    : "-";
const fmtTime = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", timeZone: IST,
      })
    : "";

export default function BlogList() {
  const { email } = useAuth();
  const [rows, setRows] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<BlogStatus | "all">("all");
  const [category, setCategory] = useState("all");
  const [q, setQ] = useState("");
  // Publish date desc by default — never updated_at, or editing an old post
  // would jump it to the top of the list.
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "publish_at", dir: "desc",
  });
  const [busy, setBusy] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      setRows(await listAllBlogs());
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load posts");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void reload();
  }, []);

  const categories = useMemo(
    () => [...new Set(rows.map((r) => r.category).filter(Boolean))] as string[],
    [rows],
  );

  const view = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = rows.filter((r) => {
      if (tab !== "all" && r.status !== tab) return false;
      if (category !== "all" && r.category !== category) return false;
      if (!needle) return true;
      return `${r.title} ${r.slug} ${r.category ?? ""} ${r.author ?? ""}`
        .toLowerCase()
        .includes(needle);
    });

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sort.key) {
        case "title":
          return a.title.localeCompare(b.title) * dir;
        case "category":
          return (a.category ?? "").localeCompare(b.category ?? "") * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        case "updated_at":
          return (Date.parse(a.updated_at) - Date.parse(b.updated_at)) * dir;
        default:
          return (
            (Date.parse(a.publish_at ?? "0") - Date.parse(b.publish_at ?? "0")) * dir
          );
      }
    });
  }, [rows, tab, category, q, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "title" || key === "category" ? "asc" : "desc" },
    );

  const act = async (id: string, fn: () => Promise<unknown>) => {
    setBusy(id);
    try {
      await fn();
      await reload();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(null);
    }
  };

  const duplicate = (p: BlogPost) =>
    act(p.id, async () => {
      const base = `${p.title} (copy)`;
      await createBlog(
        {
          ...p,
          title: base,
          slug: slugify(`${p.slug}-copy-${Date.now().toString(36).slice(-4)}`),
          status: "draft",
          publish_at: null,
          published_at: null,
        },
        email,
      );
    });

  const remove = (p: BlogPost) => {
    const live = isPubliclyVisible(p);
    const first = window.confirm(`Delete “${p.title}”? This cannot be undone.`);
    if (!first) return;
    if (live) {
      const typed = window.prompt(
        `This post is LIVE at /blog/${p.slug}.\nType DELETE to confirm.`,
      );
      if (typed !== "DELETE") return;
    }
    void act(p.id, () => deleteBlog(p.id));
  };

  const Th = ({
    label, k, className = "",
  }: { label: string; k?: SortKey; className?: string }) => (
    <th className={`px-3 py-2 text-left font-semibold whitespace-nowrap ${className}`}>
      {k ? (
        <button
          type="button"
          onClick={() => toggleSort(k)}
          className={`inline-flex items-center gap-1 ${sort.key === k ? "text-slate-900" : "text-slate-500"}`}
        >
          {label}
          <ArrowUpDown size={11} />
        </button>
      ) : (
        <span className="text-slate-500">{label}</span>
      )}
    </th>
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Blogs</h1>
        <Link
          to="/admin/blogs/new"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-4 text-[0.8125rem] font-bold text-white hover:bg-slate-700"
        >
          <Plus size={15} /> New post
        </Link>
      </div>

      {/* filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-200/60 p-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`h-8 shrink-0 rounded-md px-3 text-[0.75rem] font-semibold capitalize ${
                tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
              }`}
            >
              {t}
              <span className="ml-1.5 text-slate-400">
                {t === "all" ? rows.length : rows.filter((r) => r.status === t).length}
              </span>
            </button>
          ))}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-[0.8125rem]"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="relative min-w-[180px] flex-1">
          <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, slug, author…"
            className="h-9 w-full rounded-lg border border-slate-300 pr-3 pl-8 text-[0.8125rem] outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {err ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-[0.8125rem] text-red-700">{err}</p>
      ) : null}

      {/* table — columns drop away progressively, horizontal scroll as a fallback */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[680px] text-[0.8125rem]">
          <thead className="border-b border-slate-200 bg-slate-50 text-[0.6875rem] uppercase">
            <tr>
              <Th label="Title" k="title" />
              <Th label="Category" k="category" className="hidden md:table-cell" />
              <Th label="Status" k="status" />
              <Th label="Publish date" k="publish_at" />
              <Th label="Updated" k="updated_at" className="hidden xl:table-cell" />
              <Th label="Created by" className="hidden 2xl:table-cell" />
              <Th label="Read" className="hidden lg:table-cell" />
              <Th label="Actions" className="text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-slate-400">
                  <Loader2 className="mx-auto animate-spin" />
                </td>
              </tr>
            ) : view.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-slate-400">
                  No posts match these filters.
                </td>
              </tr>
            ) : (
              view.map((p) => {
                const live = isPubliclyVisible(p);
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="max-w-[22rem] px-3 py-2.5">
                      <Link
                        to={`/admin/blogs/${p.id}`}
                        className="line-clamp-1 font-semibold text-slate-900 hover:underline"
                      >
                        {p.title}
                      </Link>
                      <span className="line-clamp-1 text-[0.6875rem] text-slate-400">
                        /blog/{p.slug}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2.5 whitespace-nowrap text-slate-600 md:table-cell">
                      {p.category ?? "-"}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[0.6875rem] font-bold capitalize ${STATUS_STYLE[p.status]}`}
                      >
                        {p.status}
                      </span>
                      {p.status === "scheduled" && live ? (
                        <span className="mt-0.5 block text-[0.625rem] font-semibold text-emerald-600">
                          live now
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className="block text-slate-800">{fmtDate(p.publish_at)}</span>
                      <span className="block text-[0.6875rem] text-slate-400">
                        {fmtTime(p.publish_at)}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2.5 whitespace-nowrap text-slate-500 xl:table-cell">
                      {fmtDate(p.updated_at)}
                    </td>
                    <td className="hidden px-3 py-2.5 whitespace-nowrap text-slate-500 2xl:table-cell">
                      {p.created_by ?? "-"}
                    </td>
                    <td className="hidden px-3 py-2.5 whitespace-nowrap text-slate-500 lg:table-cell">
                      {p.read_time ?? "-"}m
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-0.5">
                        {busy === p.id ? (
                          <Loader2 size={14} className="animate-spin text-slate-400" />
                        ) : null}
                        <Link
                          to={`/admin/blogs/${p.id}`}
                          title="Edit"
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          type="button"
                          title="Duplicate"
                          onClick={() => duplicate(p)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                        >
                          <Copy size={14} />
                        </button>
                        {live ? (
                          <a
                            href={`/blog/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Preview live page"
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                          >
                            <ExternalLink size={14} />
                          </a>
                        ) : null}
                        {p.status !== "published" ? (
                          <button
                            type="button"
                            title="Publish now"
                            onClick={() => act(p.id, () => publishNow(p, email))}
                            className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50"
                          >
                            <Send size={14} />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          title={p.status === "archived" ? "Unarchive" : "Archive"}
                          onClick={() =>
                            act(p.id, () =>
                              setStatus(
                                p.id,
                                p.status === "archived" ? "draft" : "archived",
                                email,
                              ),
                            )
                          }
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                        >
                          {p.status === "archived" ? (
                            <ArchiveRestore size={14} />
                          ) : (
                            <Archive size={14} />
                          )}
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => remove(p)}
                          className="rounded p-1.5 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
