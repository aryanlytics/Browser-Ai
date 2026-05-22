import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const rawPort = process.env.PORT ?? "4173";
const port = Number(rawPort);

export default defineConfig({
  base: process.env.BASE_PATH || "/",

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "..", "..", "attached_assets"),
    },
  },

  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",

    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // optional
        configure: (proxy, options) => {
          proxy.on("error", (err) => {
            console.error("Proxy Error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[Proxy] ${req.method} ${req.url} → ${options.target}`);
          });
        },
      },
    },
  },

  preview: {
    port,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
