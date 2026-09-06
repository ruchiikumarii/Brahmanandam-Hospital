import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const alias = { "@": fileURLToPath(new URL("./src", import.meta.url)) };

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  resolve: { alias },
  server: { port: 3000 },
  preview: { port: 3000 },
  build: {
    outDir: isSsrBuild ? "dist/server" : "dist",
    // The client build owns dist/, so the SSR pass must not wipe it.
    emptyOutDir: !isSsrBuild,
    assetsInlineLimit: 2048,
    ...(isSsrBuild
      ? {
          ssr: true,
          rollupOptions: {
            input: {
              "entry-server": fileURLToPath(
                new URL("./src/entry-server.tsx", import.meta.url),
              ),
              "prerender-data": fileURLToPath(
                new URL("./src/entry-prerender-data.ts", import.meta.url),
              ),
              "prerender-meta": fileURLToPath(
                new URL("./src/entry-prerender-meta.ts", import.meta.url),
              ),
              "prerender-visibility": fileURLToPath(
                new URL("./src/entry-prerender-test.ts", import.meta.url),
              ),
              "prerender-seo": fileURLToPath(
                new URL("./src/entry-prerender-seo.ts", import.meta.url),
              ),
              "prerender-suggest": fileURLToPath(
                new URL("./src/entry-prerender-suggest.ts", import.meta.url),
              ),
              "prerender-md": fileURLToPath(
                new URL("./src/entry-prerender-md.ts", import.meta.url),
              ),
            },
            output: { format: "es", entryFileNames: "[name].js" },
          },
        }
      : {
          rollupOptions: {
            output: {
              manualChunks: {
                react: ["react", "react-dom", "react-router-dom"],
                icons: ["lucide-react"],
              },
            },
          },
        }),
  },
}));
