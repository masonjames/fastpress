import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Enable fast refresh for better development experience
      fastRefresh: mode === "development",
    }),
    // The code below enables dev tools like taking screenshots of your site
    // while it is being developed on chef.convex.dev.
    // Feel free to remove this code if you're no longer developing your app with Chef.
    mode === "development"
      ? {
          name: "inject-chef-dev",
          transform(code: string, id: string) {
            if (id.includes("main.tsx")) {
              return {
                code: `${code}

/* Added by Vite plugin inject-chef-dev */
window.addEventListener('message', async (message) => {
  if (message.source !== window.parent) return;
  if (message.data.type !== 'chefPreviewRequest') return;

  const worker = await import('https://chef.convex.dev/scripts/worker.bundled.mjs');
  await worker.respondToMessage(message);
});
            `,
                map: null,
              };
            }
            return null;
          },
        }
      : null,
    // End of code for taking screenshots on chef.convex.dev.
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libs for better caching
          vendor: ['react', 'react-dom'],
          convex: ['convex/react'],
          ui: ['tailwindcss'],
        },
      },
    },
    // Enable source maps for production debugging when needed
    sourcemap: mode === 'development',
    // Optimize for faster builds in development
    target: mode === 'development' ? 'esnext' : 'es2015',
    // Enable gzip compression hints
    reportCompressedSize: true,
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1600,
  },
  // Optimize dev server
  server: {
    port: 5173,
    host: true,
    // Enable HMR for faster development
    hmr: true,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'convex/react'],
    // Exclude problematic dependencies that should not be pre-bundled
    exclude: [],
  },
}));
