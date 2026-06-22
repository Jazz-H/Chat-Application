import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the output dir as `build` so Firebase Hosting config and the
    // deploy workflows continue to work unchanged.
    outDir: "build",
  },
});
