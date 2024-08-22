package main

import (
	"embed"
	"html/template"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-contrib/timeout"
	"github.com/gin-gonic/gin"

	"github.com/rapidforge-io/rapidforge/config"
	"github.com/rapidforge-io/rapidforge/models"
	"github.com/rapidforge-io/rapidforge/services"
	"github.com/rapidforge-io/rapidforge/utils"
)

func createMyRender(viewsFS embed.FS) multitemplate.Renderer {
	r := multitemplate.NewRenderer()
	funcMap := template.FuncMap{
		"defaultString":  utils.DefaultHtml,
		"formatDateTime": utils.FormatDateTime,
	}
	basePages := []string{"views/base.html", "views/navbar.html"}

	// Helper function to add templates with base pages
	addTemplateWithBase := func(name string, extraPages ...string) {
		allPages := append(basePages, extraPages...)
		tmpl := template.Must(template.New("base.html").Funcs(funcMap).ParseFS(viewsFS, allPages...))
		r.Add(name, tmpl)
	}

	// Helper function to add templates without base pages
	addTemplate := func(name, templateName string, extraPages ...string) {
		allPages := append([]string{templateName}, extraPages...)
		tmpl := template.Must(template.New(filepath.Base(templateName)).Funcs(funcMap).ParseFS(viewsFS, allPages...))
		r.Add(name, tmpl)
	}

	// Templates with base pages
	templatesWithBase := map[string][]string{
		"blocks_base":   {"views/blocks_base.html"},
		"block":         {"views/editableTitle.html", "views/card.html", "views/block.html"},
		"webhook":       {"views/editableTitle.html", "views/webhook.html", "views/cheatsheet.html"},
		"periodic_task": {"views/editableTitle.html", "views/periodic_task.html", "views/cheatsheet.html"},
		"info":          {"views/info.html"},
		"users":         {"views/users.html", "views/user_cards.html"},
		"credentials":   {"views/credentials.html"},
	}

	for name, pages := range templatesWithBase {
		addTemplateWithBase(name, pages...)
	}

	// Templates without base pages
	templatesWithoutBase := map[string][]string{
		"blocks":          {"views/block_list.html", "views/card.html"},
		"page":            {"views/page.html"},
		"entities":        {"views/entities.html", "views/card.html"},
		"event_table":     {"views/event_table.html"},
		"login":           {"views/login.html"},
		"credential_list": {"views/credential_list.html", "views/card.html"},
		"user_cards":      {"views/user_cards.html"},
	}

	for name, pages := range templatesWithoutBase {
		addTemplate(name, pages[0], pages[1:]...)
	}

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

func TimeoutMiddleware() gin.HandlerFunc {
	return timeout.New(
		timeout.WithTimeout(30*time.Second),
		timeout.WithHandler(func(c *gin.Context) {
			c.Next()
		}),
		timeout.WithResponse(func(ctx *gin.Context) {
			ctx.String(http.StatusRequestTimeout, "timeout")
		}),
	)
}

// Middleware to skip logging for static file requests
func SkipLoggingForStatic() gin.HandlerFunc {
	return func(c *gin.Context) {

		if strings.HasPrefix(c.Request.URL.Path, "/static") || c.Request.URL.Path == "/static/"+c.Param("filepath") {
			gin.DefaultWriter = nil // Disable logging
		}
		c.Next()
	}
}

func setupRoutes(r *gin.Engine, store *models.Store, staticFS embed.FS) {
	loginService := services.GetLoginService()
	staticServer := http.FileServer(http.FS(staticFS))
	r.GET("/static/*filepath", func(c *gin.Context) {
		cacheKey := config.Get().FECacheBuster
		c.Request.URL.Path = "static" + c.Param("filepath")

		c.Writer.Header().Set("Cache-Control", "public, max-age=3600")
		c.Writer.Header().Set("ETag", cacheKey)

		if match := c.GetHeader("If-None-Match"); match == cacheKey {
			c.Status(http.StatusNotModified)
			return
		}
		staticServer.ServeHTTP(c.Writer, c.Request)
	})

	r.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/blocks")
	})

	r.GET("/health", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})

	// Authentication Routes
	r.GET("/login", loginHandler())
	r.GET("/logout", logoutHandler())
	r.POST("/login", doLoginHandler(loginService))
	r.GET("/credentials/callback", oAuth2CallbackHandler(store))

	// Public Routes
	r.Any("/webhook/*path", webhookHandlers(store))
	r.GET("/page/:path", pageHandler(store))

	// Block Routes
	blockGroup := r.Group("/blocks")
	blockGroup.Use(TimeoutMiddleware(), AuthMiddleware(loginService))
	{
		blockGroup.GET("/list", blocksListHandler(store))
		blockGroup.GET("/search", blocksSearchHandler(store))
		blockGroup.GET("/:id", getBlockHandler(store))
		blockGroup.GET("/:id/entities/:type", getBlockEntitiesHandler(store))
		blockGroup.GET("/:id/entities/search", blocksEntitiesSearchHandler(store))
		blockGroup.POST("/create", createBlockHandler(store))
		blockGroup.GET("/", blocksBaseHandler)
	}

	// Webhook Routes
	webhookGroup := r.Group("/webhooks")
	webhookGroup.Use(TimeoutMiddleware(), AuthMiddleware(loginService))
	{
		webhookGroup.POST("/create", createWebhookHandler(store))
		webhookGroup.PATCH("/:id", updateWebhookHandler(store))
		webhookGroup.GET("/:id", getWebhookHandler(store))
	}

	// Periodic Task Routes
	periodicTaskGroup := r.Group("/periodic_tasks")
	periodicTaskGroup.Use(TimeoutMiddleware(), AuthMiddleware(loginService))
	{
		periodicTaskGroup.GET("/:id", getPeriodicTaskHandler(store))
		periodicTaskGroup.POST("/create", createPeriodicTaskHandler(store))
		periodicTaskGroup.PATCH("/:id", updatePeriodicTaskHandler(store))
	}

	// Page Routes
	pageGroup := r.Group("/pages")
	pageGroup.Use(TimeoutMiddleware(), AuthMiddleware(loginService))
	{
		pageGroup.POST("/create", createPageHandler(store))
		pageGroup.GET("/:id", pagesHandler(store))
		pageGroup.PATCH("/:id", updatePageHandler(store))
	}

	// Event Routes
	eventGroup := r.Group("/events")
	eventGroup.Use(TimeoutMiddleware(), AuthMiddleware(loginService))
	{
		eventGroup.GET("/:type/:id", eventsHandler(store))
		eventGroup.GET("/details/:id", eventsDetailHandler(store))
	}

	// User Routes
	userGroup := r.Group("/users")
	userGroup.Use(TimeoutMiddleware(), AuthMiddleware(loginService))
	{
		userGroup.GET("/", usersHandler(store))
		userGroup.POST("/:id/edit", updateUserHandler(store))
		userGroup.DELETE("/:id/edit", deleteUserHandler(store))
		userGroup.POST("/new", createUserHandler(store))
		userGroup.GET("/search", usersSearchHandler(store))
		userGroup.GET("/:username/reset_login", resetUserLoginHandler(services.GetLoginService()))
	}

	// Credential Routes
	credentialGroup := r.Group("/credentials")
	credentialGroup.Use(TimeoutMiddleware(), AuthMiddleware(loginService))
	{
		credentialGroup.GET("/", credentialsHandler())
		credentialGroup.POST("/create", credentialsCreateHandlerGenerated(store))
		credentialGroup.GET("/list", credentialsListHandler(store))
		credentialGroup.DELETE("/:id", credentialsDeleteHandler(store))
		credentialGroup.GET("/refresh/:id", refreshCredentialHandler(store))
		credentialGroup.GET("/search", credentialsSearchHandler(store))
	}

	// Miscellaneous Routes
	r.GET("/info", AuthMiddleware(loginService), infoHandler())
	r.POST("/feedback", TimeoutMiddleware(), AuthMiddleware(loginService), feedbackHandler())
	r.DELETE("/delete/:type/:id", TimeoutMiddleware(), AuthMiddleware(loginService), deleteHandler(store))
	r.PATCH("/rename/:type/:id", TimeoutMiddleware(), AuthMiddleware(loginService), renameHandler(store))
}
