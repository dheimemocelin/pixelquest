import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    allowedHosts: process.env.PIXELQUEST_PREVIEW_HOST
      ? [process.env.PIXELQUEST_PREVIEW_HOST]
      : [],
  },
  build: {
    license: { fileName: "THIRD_PARTY_LICENSES.md" },
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: "phaser", test: /node_modules\/phaser/ }],
        },
      },
    },
  },
});
