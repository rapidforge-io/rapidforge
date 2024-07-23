package main

import (
	"embed"
	"html/template"
	"net/http"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/rapidforge-io/rapidforge/models"
	"github.com/rapidforge-io/rapidforge/services"
	"github.com/rapidforge-io/rapidforge/utils"
)

func createMyRender(viewsFS embed.FS) multitemplate.Renderer {
	r := multitemplate.NewRenderer()

	// Define the common template functions
	funcMap := template.FuncMap{
		"defaultString":  utils.DefaultHtml,
		"formatDateTime": utils.FormatDateTime,
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
	addTemplate("info", "views/info.html")

	tmpl := template.Must(template.New("block_list.html").Funcs(funcMap).ParseFS(viewsFS, "views/card.html", "views/block_list.html"))

	r.Add("blocks", tmpl)

	tmpl2 := template.Must(template.New("page.html").Funcs(funcMap).ParseFS(viewsFS, "views/page.html"))
	r.Add("page", tmpl2)
	// addSinglePage("page", "views/page.html")

	tmpl = template.Must(template.New("entities.html").Funcs(funcMap).ParseFS(viewsFS, "views/card.html", "views/entities.html"))
	r.Add("entities", tmpl)

	tmpl = template.Must(template.New("event_table.html").Funcs(funcMap).ParseFS(viewsFS, "views/event_table.html"))
	r.Add("event_table", tmpl)

	tmpl = template.Must(template.New("login.html").Funcs(funcMap).ParseFS(viewsFS, "views/login.html"))
	r.Add("login", tmpl)

	return r
}

func AuthMiddleware(loginService *services.LoginService) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("token")
		if err != nil {
			c.Redirect(http.StatusFound, "/login")
			c.Abort()
			return
		}

		user, err := loginService.LoginWithToken(tokenString)
		if err != nil {
			c.Redirect(http.StatusFound, "/login")
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Next()
	}
}

func setupRoutes(r *gin.Engine, store *models.Store, staticFS embed.FS) {

	staticServer := http.FileServer(http.FS(staticFS))
	r.GET("/static/*filepath", func(c *gin.Context) {
		c.Request.URL.Path = "static" + c.Param("filepath")
		staticServer.ServeHTTP(c.Writer, c.Request)
	})

	r.GET("/login", loginHandler())
	r.POST("/login", doLoginHandler(services.GetLoginService()))
	r.GET("/info", infoHandler())

	// public route
	r.Any("/webhook/*path", webhookHandlers(store))
	//r.Use(AuthMiddleware(services.GetLoginService()))

	r.DELETE("/delete/:type/:id", deleteHandler(store))

	r.GET("/page/:path", pageHandler(store))

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

	r.POST("/pages/create", createPageHandler(store))

	r.GET("/pages/:id", pagesHandler(store))

	r.PATCH("/pages/:id", updatePageHandler(store))

	r.GET("/events/:type/:id", eventsHandler(store))

	r.GET("/event_details/:id", eventsDetailHandler(store))
}
