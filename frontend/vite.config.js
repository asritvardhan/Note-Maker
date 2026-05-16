import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/register": "http://localhost:5000",
      "/login": "http://localhost:5000",
      "/notes": "http://localhost:5000",
      "/search": "http://localhost:5000",
      "/about": "http://localhost:5000",
    },
  },
});
