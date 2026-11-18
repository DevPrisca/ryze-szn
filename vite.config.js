import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import process from "node:process";

const API_PORT = process.env.API_PORT || process.env.PORT || 5000;

// In development, any request starting with /api is passed to the Node server
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:" + API_PORT,
    },
  },
});
