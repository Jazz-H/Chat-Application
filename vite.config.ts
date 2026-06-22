import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the output dir as `build` so Firebase Hosting config and the
    // deploy workflows continue to work unchanged.
    outDir: "build",
    rollupOptions: {
      output: {
        // Split large/stable dependencies into their own cacheable chunks
        // instead of one big bundle.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@firebase") || id.includes("firebase"))
            return "firebase";
          if (id.includes("@sentry")) return "sentry";
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("scheduler")
          )
            return "react";
          return "vendor";
        },
      },
    },
  },
});
