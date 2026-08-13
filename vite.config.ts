import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import glsl from 'vite-plugin-glsl'
import { templateCompilerOptions } from '@tresjs/core'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    vue({
      ...templateCompilerOptions,
    }),
    tailwindcss(),
    glsl(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Deliberately NO manual chunk for three/@tresjs/core.
        //
        // Forcing them into a named chunk made Rolldown emit a
        // `<link rel="modulepreload">` for it in index.html, so every visitor
        // — including ?plain=1, every phone, and desktop reduced-motion —
        // downloaded 208 kB gzip of a 3D engine they never instantiate.
        // Letting them fall into SceneRoot's async chunk is what actually
        // makes the defineAsyncComponent in App.vue pay off.
        //
        // Verified: with this rule removed, index.html emits no modulepreload
        // at all and the entry chunk drops 191.50 kB -> 97.70 kB.
        // Re-adding a `three` chunk silently undoes the lazy load.
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) {
            return 'gsap'
          }
          if (
            id.includes('node_modules/pinia')
            || id.includes('node_modules/vue/')
            || id.includes('node_modules/@vue/')
          ) {
            return 'vendor'
          }
        },
      },
    },
  },
})
