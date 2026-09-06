import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { setBlogPosts } from "./lib/cms/blog-store";
import type { BlogPost } from "./lib/cms/types";
import "./globals.css";

/**
 * Build-time renderer.
 *
 * Uses `renderToPipeableStream` + `onAllReady` rather than `renderToString`:
 * every route is behind `React.lazy`, and only the streaming renderer waits for
 * those chunks to resolve. `renderToString` would emit the Suspense fallback,
 * which is how a "prerendered" page ends up shipping the word "Loading…"
 * instead of the article.
 */
export function render(url: string, posts: BlogPost[]): Promise<string> {
  setBlogPosts(posts);

  return new Promise((resolve, reject) => {
    let html = "";
    let settled = false;

    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString("utf8");
        cb();
      },
      final(cb) {
        if (!settled) {
          settled = true;
          resolve(html);
        }
        cb();
      },
    });

    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>,
      {
        // Wait for every lazy route and Suspense boundary before emitting.
        onAllReady() {
          pipe(sink);
        },
        onShellError(err) {
          if (!settled) {
            settled = true;
            reject(err);
          }
        },
        onError(err) {
          if (!settled) {
            settled = true;
            reject(err);
          }
        },
      },
    );

    // A route that never resolves must fail the build, not hang it.
    setTimeout(() => {
      if (!settled) {
        settled = true;
        abort();
        reject(new Error(`render timed out for ${url}`));
      }
    }, 20_000).unref?.();
  });
}
