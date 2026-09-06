import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, FileText, Loader2, Send, Plus } from "lucide-react";
import { listAllBlogs } from "@/lib/cms/admin-api";
import type { BlogPost } from "@/lib/cms/types";
import { isPubliclyVisible } from "@/lib/cms/visibility";

export default function Dashboard() {
  const [rows, setRows] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void listAllBlogs()
      .then(setRows)
      .catch((e) => setErr(e instanceof Error ? e.message : "Load failed"))
      .finally(() => setLoading(false));
  }, []);

  const live = rows.filter((p) => isPubliclyVisible(p));
  const queued = rows.filter(
    (p) => p.status === "scheduled" && !isPubliclyVisible(p),
  );
  const drafts = rows.filter((p) => p.status === "draft");

  const stats = [
    { label: "Live now", value: live.length, icon: Send, tone: "text-emerald-600" },
    { label: "Scheduled", value: queued.length, icon: Clock, tone: "text-blue-600" },
    { label: "Drafts", value: drafts.length, icon: FileText, tone: "text-slate-600" },
    { label: "All posts", value: rows.length, icon: FileText, tone: "text-slate-600" },
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <Link
          to="/admin/blogs/new"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-4 text-[0.8125rem] font-bold text-white"
        >
          <Plus size={15} /> New post
        </Link>
      </div>

      {err ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-[0.8125rem] text-red-700">{err}</p>
      ) : null}

      {loading ? (
        <div className="grid py-20 place-items-center">
          <Loader2 className="animate-spin text-slate-400" />
        </div>
      ) : (
        <>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <li key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
                <s.icon size={18} className={s.tone} />
                <p className="mt-3 text-2xl font-extrabold">{s.value}</p>
                <p className="text-[0.8125rem] text-slate-500">{s.label}</p>
              </li>
            ))}
          </ul>

          {queued.length ? (
            <section className="mt-6">
              <h2 className="text-[0.9375rem] font-bold">Going live soon</h2>
              <ul className="mt-2 grid gap-1.5">
                {queued
                  .sort((a, b) => Date.parse(a.publish_at ?? "0") - Date.parse(b.publish_at ?? "0"))
                  .slice(0, 5)
                  .map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5"
                    >
                      <Link to={`/admin/blogs/${p.id}`} className="truncate text-[0.875rem] font-semibold hover:underline">
                        {p.title}
                      </Link>
                      <span className="shrink-0 text-[0.75rem] text-slate-500">
                        {new Date(p.publish_at!).toLocaleString("en-IN", {
                          timeZone: p.time_zone,
                        })}
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-6">
            <h2 className="text-[0.9375rem] font-bold">Recently updated</h2>
            <ul className="mt-2 grid gap-1.5">
              {[...rows]
                .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
                .slice(0, 6)
                .map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5"
                  >
                    <Link to={`/admin/blogs/${p.id}`} className="truncate text-[0.875rem] font-semibold hover:underline">
                      {p.title}
                    </Link>
                    <span className="shrink-0 text-[0.75rem] text-slate-500 capitalize">{p.status}</span>
                  </li>
                ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
