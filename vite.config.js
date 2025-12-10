import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    root: "src/",
    envDir: "../",

    server: {
        proxy: {
            '/api/deviantart': {
                target: 'https://www.deviantart.com',
                changeOrigin: true,
                rewrite: (path) => {
                    // Remove /api/deviantart prefix
                    const cleanPath = path.replace(/^\/api\/deviantart/, '');

                    // For OAuth token endpoint
                    if (cleanPath.startsWith('/oauth2/token')) {
                        return cleanPath;
                    }

                    // For API endpoints
                    return `/api/v1/oauth2${cleanPath}`;
                },
                secure: true,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                },
            }
        }
    },

    build: {
        outDir: "../dist",
        emptyOutDir: true,
        minify: 'esbuild',
        cssMinify: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/index.html"),
                detail: resolve(__dirname, "src/detail.html"),
                favorites: resolve(__dirname, "src/favorites.html"),
            },
        },
        chunkSizeWarningLimit: 1000,
    },
});
