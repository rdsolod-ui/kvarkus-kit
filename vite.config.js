import { defineConfig } from "vite";
export default defineConfig({
  base: "./",
  build: {
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      input: { main: "index.html", guide: "guide.html", sample: "sample.html" },
    },
  },
});
