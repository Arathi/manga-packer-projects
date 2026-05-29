import path from "node:path";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import monkey, { cdn } from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 45551,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    preact(),
    monkey({
      entry: "src/main.tsx",
      userscript: {
        name: "Manga Packer UP",
        icon: "https://vitejs.dev/logo.svg",
        namespace: "manga-packer-up",
        match: ["https://telegra.ph/*"],
      },
      build: {
        externalGlobals: {
          preact: cdn.jsdelivr("preact", "dist/preact.min.js"),
        },
      },
    }),
  ],
});
