import { useRef, useState } from "react";
import {
  ChevronDown, ChevronUp, Code2, Heading1, Heading2, Heading3, Image as ImageIcon,
  List, ListOrdered, Minus, Plus, Quote, Table2, Trash2, Type, Upload,
} from "lucide-react";
import type { Block, BlogContent } from "@/lib/cms/types";
import { uploadImage } from "@/lib/cms/admin-api";

/**
 * Structured block editor.
 *
 * Content is stored as typed blocks (never raw HTML), which is what the public
 * renderer and the JSON-LD word count consume. Inline emphasis stays as the
 * markdown-ish tokens the spec calls for: **bold**, *italic*, [text](url).
 */

const ADD: { type: Block["type"]; label: string; icon: typeof Type }[] = [
  { type: "p", label: "Paragraph", icon: Type },
  { type: "h2", label: "Heading 2", icon: Heading2 },
  { type: "h3", label: "Heading 3", icon: Heading3 },
  { type: "h1", label: "Heading 1", icon: Heading1 },
  { type: "ul", label: "Bullet list", icon: List },
  { type: "ol", label: "Numbered list", icon: ListOrdered },
  { type: "blockquote", label: "Quote", icon: Quote },
  { type: "code", label: "Code", icon: Code2 },
  { type: "table", label: "Table", icon: Table2 },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "hr", label: "Divider", icon: Minus },
];

function blank(type: Block["type"]): Block {
  switch (type) {
    case "ul":
    case "ol":
      return { type, items: [""] };
    case "code":
      return { type: "code", text: "" };
    case "hr":
      return { type: "hr" };
    case "image":
      return { type: "image", src: "", alt: "" };
    case "table":
      return { type: "table", head: ["Column 1", "Column 2"], rows: [["", ""]] };
    default:
      return { type, text: "" } as Block;
  }
}

const input =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-[0.875rem] outline-none focus:border-slate-900";

export function BlockEditor({
  content,
  onChange,
  userEmail,
}: {
  content: BlogContent;
  onChange: (c: BlogContent) => void;
  userEmail: string | null;
}) {
  const blocks = content.blocks ?? [];
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (next: Block[]) => onChange({ blocks: next });
  const patch = (i: number, b: Block) =>
    set(blocks.map((old, idx) => (idx === i ? b : old)));
  const add = (type: Block["type"], at = blocks.length) =>
    set([...blocks.slice(0, at), blank(type), ...blocks.slice(at)]);
  const remove = (i: number) => set(blocks.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    set(next);
  };

  const insertImages = async (files: FileList | File[]) => {
    setUploading(true);
    try {
      const added: Block[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const m = await uploadImage(file, userEmail);
        added.push({ type: "image", src: m.url, alt: m.alt ?? "" });
      }
      if (added.length) set([...blocks, ...added]);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) void insertImages(e.dataTransfer.files);
      }}
      onPaste={(e) => {
        const imgs = Array.from(e.clipboardData.files).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (imgs.length) {
          e.preventDefault();
          void insertImages(imgs);
        }
      }}
      className={`rounded-xl border-2 p-4 transition-colors ${
        dragOver ? "border-slate-900 bg-slate-50" : "border-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[0.6875rem] font-bold tracking-wide text-slate-500 uppercase">
          Content · {blocks.length} block{blocks.length === 1 ? "" : "s"}
        </p>
        <p className="text-[0.6875rem] text-slate-400">
          Inline: <code>**bold**</code> <code>*italic*</code>{" "}
          <code>[text](url)</code> · drop or paste images
        </p>
      </div>

      <ol className="mt-3 grid gap-2.5">
        {blocks.map((b, i) => (
          <li key={i} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.625rem] font-bold tracking-wide text-slate-500 uppercase">
                {b.type}
              </span>
              <div className="flex items-center gap-0.5">
                <button type="button" onClick={() => move(i, -1)} title="Move up"
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                  <ChevronUp size={14} />
                </button>
                <button type="button" onClick={() => move(i, 1)} title="Move down"
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                  <ChevronDown size={14} />
                </button>
                <button type="button" onClick={() => remove(i)} title="Remove block"
                  className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* --- editors per block type */}
            {b.type === "hr" ? (
              <hr className="border-slate-300" />
            ) : b.type === "ul" || b.type === "ol" ? (
              <div className="grid gap-1.5">
                {b.items.map((it, k) => (
                  <div key={k} className="flex gap-1.5">
                    <input
                      value={it}
                      onChange={(e) =>
                        patch(i, {
                          ...b,
                          items: b.items.map((v, x) => (x === k ? e.target.value : v)),
                        })
                      }
                      className={input}
                      placeholder={`Item ${k + 1}`}
                    />
                    <button type="button"
                      onClick={() =>
                        patch(i, { ...b, items: b.items.filter((_, x) => x !== k) })
                      }
                      className="shrink-0 rounded px-2 text-slate-400 hover:bg-slate-100">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button type="button"
                  onClick={() => patch(i, { ...b, items: [...b.items, ""] })}
                  className="justify-self-start rounded-lg bg-slate-100 px-2.5 py-1 text-[0.75rem] font-semibold">
                  + Item
                </button>
              </div>
            ) : b.type === "image" ? (
              <div className="grid gap-1.5">
                {b.src ? (
                  <img src={b.src} alt={b.alt} className="max-h-48 rounded-lg object-contain" />
                ) : null}
                <input value={b.src} onChange={(e) => patch(i, { ...b, src: e.target.value })}
                  className={input} placeholder="Image URL" />
                <input value={b.alt} onChange={(e) => patch(i, { ...b, alt: e.target.value })}
                  className={input} placeholder="ALT text (required for accessibility & SEO)" />
                <input value={b.caption ?? ""} onChange={(e) => patch(i, { ...b, caption: e.target.value })}
                  className={input} placeholder="Caption (optional)" />
              </div>
            ) : b.type === "table" ? (
              <div className="grid gap-1.5">
                <div className="flex gap-1.5">
                  {b.head.map((h, k) => (
                    <input key={k} value={h}
                      onChange={(e) =>
                        patch(i, { ...b, head: b.head.map((v, x) => (x === k ? e.target.value : v)) })
                      }
                      className={`${input} font-semibold`} placeholder={`Header ${k + 1}`} />
                  ))}
                </div>
                {b.rows.map((row, r) => (
                  <div key={r} className="flex gap-1.5">
                    {row.map((cell, c) => (
                      <input key={c} value={cell}
                        onChange={(e) =>
                          patch(i, {
                            ...b,
                            rows: b.rows.map((rr, x) =>
                              x === r ? rr.map((cc, y) => (y === c ? e.target.value : cc)) : rr,
                            ),
                          })
                        }
                        className={input} />
                    ))}
                    <button type="button"
                      onClick={() => patch(i, { ...b, rows: b.rows.filter((_, x) => x !== r) })}
                      className="shrink-0 rounded px-2 text-slate-400 hover:bg-slate-100">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-1.5">
                  <button type="button"
                    onClick={() => patch(i, { ...b, rows: [...b.rows, b.head.map(() => "")] })}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-[0.75rem] font-semibold">
                    + Row
                  </button>
                  <button type="button"
                    onClick={() =>
                      patch(i, {
                        ...b,
                        head: [...b.head, `Column ${b.head.length + 1}`],
                        rows: b.rows.map((r) => [...r, ""]),
                      })
                    }
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-[0.75rem] font-semibold">
                    + Column
                  </button>
                </div>
              </div>
            ) : b.type === "code" ? (
              <textarea rows={5} value={b.text}
                onChange={(e) => patch(i, { ...b, text: e.target.value })}
                className={`${input} font-mono text-[0.8125rem]`} />
            ) : (
              <textarea
                rows={b.type === "p" || b.type === "blockquote" ? 3 : 1}
                value={(b as Extract<Block, { text: string }>).text}
                onChange={(e) =>
                  patch(i, { type: b.type, text: e.target.value } as Block)
                }
                className={`${input} resize-y ${b.type.startsWith("h") ? "font-bold" : ""}`}
                placeholder={b.type.startsWith("h") ? "Heading text" : "Write…"}
              />
            )}
          </li>
        ))}
      </ol>

      {/* add-block palette */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {ADD.map((a) => (
          <button key={a.type} type="button" onClick={() => add(a.type)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[0.75rem] font-semibold text-slate-700 hover:border-slate-900">
            <a.icon size={13} />
            {a.label}
          </button>
        ))}
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[0.75rem] font-semibold text-white disabled:opacity-50">
          {uploading ? <Plus size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? "Uploading…" : "Upload image"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden
          onChange={(e) => e.target.files && insertImages(e.target.files)} />
      </div>
    </div>
  );
}
