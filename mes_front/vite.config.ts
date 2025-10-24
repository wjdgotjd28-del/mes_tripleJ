import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // host: "localhost",
    host: "172.20.20.14",
    port:80,
    strictPort:true,
    proxy: {
      "/api": {
        // target: "http://localhost:8080",
        target: "http://172.20.20.14:8080",
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true,
      },
    },
  },
});
