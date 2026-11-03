import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// duongdonate.github.io is a user site, served from the domain root.
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
