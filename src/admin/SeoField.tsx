import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, Loader2, Sparkles, X } from "lucide-react";
import {
  BAND_LABEL,
  scoreDescription,
  scoreTitle,
  type ScoreContext,
  type ScoreResult,
} from "@/lib/cms/seo-score";
import { aiSuggestAvailable, suggest, type Suggestion } from "@/lib/cms/seo-suggest";

const BAND_STYLE = {
  good: { bar: "bg-emerald-500", text: "text-emerald-700", ring: "ring-emerald-200" },
  "needs-work": { bar: "bg-amber-500", text: "text-amber-700", ring: "ring-amber-200" },
  poor: { bar: "bg-red-500", text: "text-red-700", ring: "ring-red-200" },
} as const;

/**
 * SEO Title / Meta Description field with a live rule-based score and a
 * Suggest panel that names the failing rule, explains why it matters, and
 * offers rewrites built from the post's own title, excerpt and focus keyword.
 */
export function SeoField({
  kind,
  value,
  onChange,
  postTitle,
  excerpt,
  focusKeyword,
  ctx,
  label,
  placeholder,
}: {
  kind: "title" | "description";
  value: string;
  onChange: (v: string) => void;
  postTitle: string;
  excerpt: string;
  focusKeyword: string;
  ctx: ScoreContext;
  label: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Suggestion[]>([]);

  const score: ScoreResult = useMemo(
    () =>
      kind === "title" ? scoreTitle(value, ctx) : scoreDescription(value, ctx),
    [kind, value, ctx],
  );

  const [min, max] = score.idealRange;
  const style = BAND_STYLE[score.band];
  const inRange = score.length >= min && score.length <= max;

  useEffect(() => {
    if (!open) setOptions([]);
  }, [open]);

  const runSuggest = async () => {
    setOpen(true);
    setLoading(true);
    try {
      setOptions(
        await suggest({
          kind,
          title: postTitle,
          excerpt,
          focusKeyword,
          ctx,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-[0.875rem] outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-[0.8125rem] font-semibold text-slate-700">
          {label}
        </label>
        <div className="flex items-center gap-3">
          <span
            className={`text-[0.75rem] font-semibold ${inRange ? "text-emerald-600" : "text-slate-500"}`}
          >
            {score.length}/{min}–{max}
          </span>
          <span className={`text-[0.75rem] font-bold ${style.text}`}>
            {score.score}/100 · {BAND_LABEL[score.band]}
          </span>
        </div>
      </div>

      {kind === "title" ? (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={fieldClass}
        />
      ) : (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldClass} resize-y`}
        />
      )}

      {/* score bar */}
      <div className="mt-2 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all ${style.bar}`}
            style={{ width: `${score.score}%` }}
          />
        </div>
        {score.score < 80 ? (
          <button
            type="button"
            onClick={runSuggest}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-[0.75rem] font-semibold text-white hover:bg-slate-700"
          >
            <Sparkles size={13} />
            Suggest
          </button>
        ) : null}
      </div>

      {/* inline rule failures */}
      {score.failing.length ? (
        <ul className="mt-2 grid gap-1">
          {score.failing.slice(0, 2).map((r) => (
            <li
              key={r.id}
              className="flex items-start gap-1.5 text-[0.75rem] text-slate-500"
            >
              <AlertCircle size={12} className="mt-0.5 shrink-0 text-amber-500" />
              {r.problem}
            </li>
          ))}
        </ul>
      ) : null}

      {/* ---------------------------------------------------- suggest panel */}
      {open ? (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.875rem] font-bold text-slate-900">
                Fix the {kind === "title" ? "SEO title" : "meta description"}
              </p>
              <p className="mt-0.5 text-[0.75rem] text-slate-500">
                {aiSuggestAvailable
                  ? "Rewrites are generated against the rules below, then re-scored."
                  : "No AI key set - rewrites are built from this post's own title, excerpt and keyword, then re-scored."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              aria-label="Close suggestions"
            >
              <X size={15} />
            </button>
          </div>

          {/* every failing rule: problem + rule/why */}
          <ul className="mt-3 grid gap-2.5">
            {score.failing.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-amber-200 bg-amber-50 p-3"
              >
                <p className="text-[0.8125rem] font-semibold text-amber-900">
                  {r.problem}
                </p>
                <p className="mt-1 text-[0.75rem] leading-relaxed text-amber-800">
                  <strong className="font-semibold">{r.label}.</strong> {r.why}
                </p>
              </li>
            ))}
          </ul>

          {/* rewrite options */}
          <p className="mt-4 text-[0.75rem] font-bold tracking-wide text-slate-500 uppercase">
            Rewrite options
          </p>

          {loading ? (
            <p className="mt-2 flex items-center gap-2 text-[0.8125rem] text-slate-500">
              <Loader2 size={14} className="animate-spin" />
              Generating…
            </p>
          ) : options.length ? (
            <ul className="mt-2 grid gap-2">
              {options.map((o) => (
                <li key={o.text}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.text);
                      setOpen(false);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:border-slate-900"
                  >
                    <p className="text-[0.8125rem] leading-snug text-slate-900">
                      {o.text}
                    </p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem]">
                      <span className="font-semibold text-slate-500">
                        {o.length} chars
                      </span>
                      <span
                        className={`font-bold ${BAND_STYLE[o.score.band].text}`}
                      >
                        {o.score.score}/100
                      </span>
                      {o.score.rules
                        .filter((r) => r.passed)
                        .map((r) => (
                          <span
                            key={r.id}
                            className="inline-flex items-center gap-0.5 text-emerald-600"
                          >
                            <Check size={10} strokeWidth={3} />
                            {r.label.split(" ").slice(0, 3).join(" ")}
                          </span>
                        ))}
                      {o.origin === "ai" ? (
                        <span className="rounded bg-slate-900 px-1.5 py-0.5 font-semibold text-white">
                          AI
                        </span>
                      ) : null}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[0.8125rem] text-slate-500">
              No option scored better than what you already have.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
