// vite-plugin-inject-html.js

export default function injectHtml() {
  return {
    name: 'inject-html',
    transformIndexHtml(html) {
      return html.replace(
        /<\/head>/,
        `
        <script>
         var pageData= {
             baseUrl: {{ .baseUrl }},
             path: {{ .page.Path }},
             canvasState: {{ .page.CanvasState.root }},
             active: {{ .page.Active }},
             title: {{ .page.Name }},
             description: {{ .page.Description }},
             pageId: {{ .page.ID }},
          };
        </script>
        </head>`
      );
    },
  };
}