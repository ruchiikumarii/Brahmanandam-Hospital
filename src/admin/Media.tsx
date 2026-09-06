import { useEffect, useRef, useState } from "react";
import { Check, Copy, Loader2, Trash2, Upload } from "lucide-react";
import { deleteMedia, listMedia, uploadImage } from "@/lib/cms/admin-api";
import type { MediaItem } from "@/lib/cms/types";
import { useAuth } from "./AdminShell";

export default function Media() {
  const { email } = useAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reload = async () => {
    setLoading(true);
    try {
      setItems(await listMedia());
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load media");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void reload();
  }, []);

  const upload = async (files: FileList) => {
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        if (f.type.startsWith("image/")) await uploadImage(f, email);
      }
      await reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Media library</h1>
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-4 text-[0.8125rem] font-bold text-white disabled:opacity-50"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </div>

      {err ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-[0.8125rem] text-red-700">{err}</p>
      ) : null}

      {loading ? (
        <div className="grid py-20 place-items-center">
          <Loader2 className="animate-spin text-slate-400" />
        </div>
      ) : items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-300 py-16 text-center text-[0.875rem] text-slate-500">
          No images yet. Upload one to get started.
        </p>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img
                src={m.url}
                alt={m.alt ?? ""}
                loading="lazy"
                className="aspect-[4/3] w-full bg-slate-100 object-cover"
              />
              <div className="flex items-center justify-between gap-1 p-2">
                <span className="truncate text-[0.6875rem] text-slate-500">
                  {Math.round((m.size_bytes ?? 0) / 1024)} KB
                </span>
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    title="Copy URL"
                    onClick={() => {
                      void navigator.clipboard.writeText(m.url);
                      setCopied(m.id);
                      setTimeout(() => setCopied(null), 1500);
                    }}
                    className="rounded p-1 text-slate-500 hover:bg-slate-100"
                  >
                    {copied === m.id ? (
                      <Check size={13} className="text-emerald-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    onClick={async () => {
                      if (!window.confirm("Delete this image permanently?")) return;
                      await deleteMedia(m);
                      await reload();
                    }}
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
