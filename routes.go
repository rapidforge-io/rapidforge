package main

import (
	"embed"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rapidforge-io/rapidforge/models"
)

func setupRoutes(r *gin.Engine, store *models.Store, viewsFS embed.FS, staticFS embed.FS) {

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

	r.GET("/pages", pagesHandler)
}
