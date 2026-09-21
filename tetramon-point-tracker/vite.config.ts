import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg'],
      manifest: {
        name: 'Tetramon Point Tracker',
        short_name: 'Tetramon Tracker',
        description: 'An offline elemental point tracker for Tetramon games.',
        theme_color: '#17232b',
        background_color: '#17232b',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/tetramon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/icons/tetramon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png}'],
      },
    }),
  ],
})
