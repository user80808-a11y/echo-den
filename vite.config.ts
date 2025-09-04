import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    async configureServer(server) {
      // Only import and create server during development
      console.log("🚀 Loading Express server middleware...");
      const { createServer } = await import("./server");
      const app = createServer();
      console.log("✅ Express server created successfully");

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
      console.log("✅ Express middleware added to Vite");
    },
  };
}
