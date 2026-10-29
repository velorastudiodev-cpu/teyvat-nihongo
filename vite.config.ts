import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// `vite build --mode android` makes the bundle for the Capacitor APK: everything already ships
// inside the app, so no service worker or install manifest.
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      disable: mode === 'android',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Teyvat Nihongo',
        short_name: 'Teyvat',
        description: 'Belajar bahasa Jepang N5 → N1 seperti main game, ditemani chibi Teyvat.',
        lang: 'id',
        start_url: '/',
        display: 'standalone',
        theme_color: '#d1402f',
        background_color: '#fbf3e4',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // everything the app needs offline, including the KanjiVG stroke chunks (~6 MB in total)
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }, cacheableResponse: { statuses: [0, 200] } },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/chibi/'),
            handler: 'CacheFirst',
            options: { cacheName: 'chibi', cacheableResponse: { statuses: [200] } },
          },
        ],
      },
    }),
  ],
}))
