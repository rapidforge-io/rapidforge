package main

import (
	"embed"
	"html/template"
	"net/http"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/rapidforge-io/rapidforge/models"
	"github.com/rapidforge-io/rapidforge/utils"
)

func createMyRender(viewsFS embed.FS) multitemplate.Renderer {
	r := multitemplate.NewRenderer()

	// Define the common template functions
	funcMap := template.FuncMap{
		"defaultString": utils.DefaultHtml,
	}

	basePages := []string{"views/base.html", "views/navbar.html"}

	// Create and add templates to the renderer
	addTemplate := func(name string, extraPages ...string) {
		allPages := append(basePages, extraPages...)
		tmpl := template.Must(template.New("base.html").Funcs(funcMap).ParseFS(viewsFS, allPages...))
		r.Add(name, tmpl)
	}

	addTemplate("blocks_base", "views/blocks_base.html")
	addTemplate("block", "views/editableTitle.html", "views/card.html", "views/block.html")
	addTemplate("webhook", "views/editableTitle.html", "views/webhook.html")
	addTemplate("periodic_task", "views/editableTitle.html", "views/periodic_task.html")

	tmpl := template.Must(template.New("block_list.html").Funcs(funcMap).ParseFS(viewsFS, "views/card.html", "views/block_list.html"))

	r.Add("blocks", tmpl)

	tmpl = template.Must(template.New("entities.html").Funcs(funcMap).ParseFS(viewsFS, "views/card.html", "views/entities.html"))
	r.Add("entities", tmpl)

	return r
}
func setupRoutes(r *gin.Engine, store *models.Store, staticFS embed.FS) {

	staticServer := http.FileServer(http.FS(staticFS))
	r.GET("/static/*filepath", func(c *gin.Context) {
		c.Request.URL.Path = "static" + c.Param("filepath")
		staticServer.ServeHTTP(c.Writer, c.Request)
	})

	r.Any("/webhook/:path", webhookHandlers(store))

	r.PATCH("/rename/:type/:id", renameHandler(store))

	r.GET("/blocks_list", blocksListHandler(store))

	r.GET("/blocks/:id", getBlockHandler(store))

	r.GET("/block/:id/entities/:type", getBlockEntitiesHandler(store))

	r.POST("/blocks/create", createBlockHandler(store))

	r.POST("/webhooks/create", createWebhookHandler(store))

	r.GET("/blocks", blocksBaseHandler)

	r.PATCH("/webhooks/:id", updateWebhookHandler(store))

	r.GET("/webhooks/:id", getWebhookHandler(store))

	r.GET("/periodic_tasks/:id", getPeriodicTaskHandler(store))

	r.POST("/periodic_tasks/create", createPeriodicTaskHandler(store))

	r.PATCH("/periodic_tasks/:id", updatePeriodicTaskHandler(store))

	// r.GET("/pages", pagesHandler)
}
