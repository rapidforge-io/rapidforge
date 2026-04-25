// vite-plugin-inject-html.js

export default function injectHtml() {
  return {
    name: 'inject-html',
    apply: 'build',
    transformIndexHtml(html) {
      // Strip the dev-only pageData script block before injecting the Go template version
      const stripped = html.replace(
        /<script>\s*var pageData\s*=[\s\S]*?<\/script>/,
        ''
      );
      return stripped.replace(
        /<\/head>/,
        `<script>
        var pageData= {
             baseUrl: {{ .baseUrl }},
             path: {{ .page.Path }},
             canvasState: {{ .page.CanvasState.root }},
             active: {{ .page.Active }},
             protected: {{ .page.Protected }},
             title: {{defaultString .page.Name "Title"}},
             description: {{defaultString .page.Description "Description"}},
             pageId: {{ .page.ID }},
             blockId: {{ .blockId }},
             webhookPaths: {{ .page.WebhookPaths }},
             css: {{ .css }},
             js: {{ .js }},
         };</script>`
      );
    },
  };
}
