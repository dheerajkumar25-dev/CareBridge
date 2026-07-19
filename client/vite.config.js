import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite dev server proxy: any request to /api/* from the React app gets
// forwarded to the Express backend on port 5000, so we can just call
// fetch("/api/doctors") in the frontend without hardcoding the full
// backend URL during local development.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
