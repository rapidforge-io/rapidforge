import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';
const iconsPath = 'node_modules/@shoelace-style/shoelace/dist/assets/icons';
import { resolve } from 'path';
import injectHtml from './vite-plugin-inject-html';


export default defineConfig({
  build: {
    // Only apply this plugin during the build process
    apply: 'build',
    rollupOptions: {
       // for multiple entry points
       //     input: {
       //       entry1: resolve(__dirname, '/index.html'),
       //       entry2: resolve(__dirname, '/main.html'),
       //     }
      output: {
        entryFileNames: 'static/assets/[name]-[hash].js',
        chunkFileNames: 'static/assets/[name]-[hash].js',
        assetFileNames: 'static/assets/[name]-[hash][extname]',
      },
      input: {
        app: './pages.html',
      },
    },
  },
  plugins: [
    injectHtml(),
    viteStaticCopy({
      targets: [
        {
          src: iconsPath,
          dest: 'static/assets',
        },
      ],
    }),
    react(),
  ],
})