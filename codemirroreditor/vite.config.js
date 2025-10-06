import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'CodeMirrorBundle',
      fileName: 'codemirror-bundle',
      formats: ['es']
    },
    rollupOptions: {
    }
  }
})