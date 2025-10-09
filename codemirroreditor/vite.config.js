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
      treeshake: {
        moduleSideEffects: id => {
          // preserve @codemirror/view and thememirror for style injection
          return /@codemirror\/view|thememirror/.test(id);
        },
      },
    },
    cssCodeSplit: false, // Bundle all CSS together
     output: {
        // Ensure CSS is not optimized away
        inlineDynamicImports: true,
        assetFileNames: 'codemirror-bundle.[ext]'
    }
  }
})
