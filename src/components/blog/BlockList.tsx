import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Block, BlogContent } from "@/lib/cms/types";

/**
 * Renders structured blocks. Nothing here ever uses `dangerouslySetInnerHTML` —
 * content is typed data, and inline emphasis is parsed into real elements, so
 * a compromised CMS row cannot inject script into the page.
 */

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/;
const BOLD = /\*\*([^*]+)\*\*/;
const ITALIC = /(?<!\*)\*([^*]+)\*(?!\*)/;

/** `**bold**`, `*italic*`, `[text](url)` -> elements. */
export function RichText({ text }: { text: string }): ReactNode {
  const parse = (input: string, key = 0): ReactNode[] => {
    if (!input) return [];

    const link = LINK.exec(input);
    const bold = BOLD.exec(input);
    const italic = ITALIC.exec(input);

    const first = [link, bold, italic]
      .filter((m): m is RegExpExecArray => Boolean(m))
      .sort((a, b) => a.index - b.index)[0];

    if (!first) return [input];

    const before = input.slice(0, first.index);
    const after = input.slice(first.index + first[0].length);

    let node: ReactNode;
    if (first === link) {
      const href = first[2];
      const internal = href.startsWith("/");
      node = internal ? (
        <Link key={key} to={href} className="font-semibold text-primary underline">
          {first[1]}
        </Link>
      ) : (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="font-semibold text-primary underline"
        >
          {first[1]}
        </a>
      );
    } else if (first === bold) {
      node = (
        <strong key={key} className="font-bold text-ink">
          {first[1]}
        </strong>
      );
    } else {
      node = <em key={key}>{first[1]}</em>;
    }

    return [before, node, ...parse(after, key + 1)];
  };

  return <>{parse(text).map((n, i) => <Fragment key={i}>{n}</Fragment>)}</>;
}

function One({ block }: { block: Block }) {
  switch (block.type) {
    case "h1":
      return (
        <h2 className="mt-8 text-[1.5rem] leading-snug font-extrabold sm:text-[1.75rem]">
          <RichText text={block.text} />
        </h2>
      );
    case "h2":
      return (
        <h2 className="mt-8 text-[1.375rem] leading-snug font-extrabold sm:text-[1.5rem]">
          <RichText text={block.text} />
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-6 text-[1.125rem] leading-snug font-bold">
          <RichText text={block.text} />
        </h3>
      );
    case "p":
      return (
        <p className="mt-3.5 text-[1rem] leading-[1.85] text-muted">
          <RichText text={block.text} />
        </p>
      );
    case "blockquote":
      return (
        <blockquote className="mt-5 border-l-4 border-secondary bg-[rgba(190,53,58,.04)] px-5 py-4 text-[1rem] leading-relaxed text-ink italic">
          <RichText text={block.text} />
        </blockquote>
      );
    case "ul":
      return (
        <ul className="mt-4 grid gap-2.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
              <span><RichText text={it} /></span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-4 grid gap-2.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[rgba(47,59,128,.07)] text-[0.6875rem] font-bold text-primary">
                {i + 1}
              </span>
              <span><RichText text={it} /></span>
            </li>
          ))}
        </ol>
      );
    case "code":
      return (
        <pre className="mt-5 overflow-x-auto rounded-xl bg-primary-900 p-4 text-[0.8125rem] text-white">
          <code>{block.text}</code>
        </pre>
      );
    case "hr":
      return <hr className="mt-8 border-line" />;
    case "image":
      return (
        <figure className="mt-6">
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            decoding="async"
            className="w-full rounded-xl"
          />
          {block.caption ? (
            <figcaption className="mt-2 text-center text-[0.8125rem] text-muted">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "table":
      return (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[32rem] text-[0.875rem]">
            <thead className="bg-[rgba(47,59,128,.05)]">
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className="px-4 py-2.5 text-left font-bold text-primary">
                    <RichText text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="px-4 py-2.5 text-ink">
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export function BlockList({ content }: { content: BlogContent }) {
  return (
    <>
      {(content?.blocks ?? []).map((b, i) => (
        <One key={i} block={b} />
      ))}
    </>
  );
}
