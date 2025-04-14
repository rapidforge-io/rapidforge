// vite-plugin-inject-html.js

export default function injectHtml() {
  return {
    name: 'inject-html',
    transformIndexHtml(html) {
      return html.replace(
        /<\/head>/,
        `<script>
        var pageData= {
             baseUrl: {{ .baseUrl }},
             path: {{ .page.Path }},
             canvasState: {{ .page.CanvasState.root }},
             active: {{ .page.Active }},
             title: {{defaultString .page.Name "Title"}},
             description: {{defaultString .page.Description "Description"}},
             pageId: {{ .page.ID }},
             blockId: {{ .blockId }},
             webhookPaths: {{ .page.WebhookPaths }},
         };</script>`
      );
    },
  };
}