import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@stellar/stellar-sdk") || id.includes("stellar-sdk") || id.includes("js-xdr")) {
              return "stellar-sdk";
            }
            if (id.includes("framer-motion") || id.includes("popmotion") || id.includes("motion-dom")) {
              return "animations";
            }
            return "vendor";
          }
        },
      },
    },
  },
});

// Vite configuration for production builds
