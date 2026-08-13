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
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@tresjs/core')) {
            return 'three'
          }
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
