import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { deleteCategory, listCategories, upsertCategory } from "@/lib/cms/admin-api";
import { slugify, type Category } from "@/lib/cms/types";

export default function Categories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      setItems(await listCategories());
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load categories");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void reload();
  }, []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    try {
      await upsertCategory({ name: n, slug: slugify(n) });
      setName("");
      await reload();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Could not save");
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold">Categories</h1>

      <form onSubmit={add} className="mt-4 flex max-w-md gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="h-9 flex-1 rounded-lg border border-slate-300 px-3 text-[0.8125rem] outline-none focus:border-slate-900"
        />
        <button
          type="submit"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-4 text-[0.8125rem] font-bold text-white"
        >
          <Plus size={14} /> Add
        </button>
      </form>

      {err ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-[0.8125rem] text-red-700">{err}</p>
      ) : null}

      {loading ? (
        <div className="grid py-16 place-items-center">
          <Loader2 className="animate-spin text-slate-400" />
        </div>
      ) : (
        <ul className="mt-5 grid max-w-md gap-1.5">
          {items.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5"
            >
              <span>
                <span className="text-[0.875rem] font-semibold">{c.name}</span>
                <span className="ml-2 font-mono text-[0.6875rem] text-slate-400">
                  {c.slug}
                </span>
              </span>
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm(`Delete category “${c.name}”?`)) return;
                  await deleteCategory(c.id);
                  await reload();
                }}
                className="rounded p-1.5 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
