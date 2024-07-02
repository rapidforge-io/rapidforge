// main.go
package main

import (
	"embed"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/rapidforge-io/rapidforge/database"
	"github.com/rapidforge-io/rapidforge/models"
)

//go:embed views/*.html
var viewsFS embed.FS

//go:embed static/*
var staticFS embed.FS

// TODO
// [ ] Pass payload to webhook runner
// [ ] Make form submit for pages

// [ ] Returning header config when webhook is invoked
// [ ] Add back button for block and webhook
// [ ] Add Settings page general settings
// [ ] Add delete action
// [ ] Add search function
// [ ] Should we add status to periodic tasks?
// [ ] Add pagination for block list (can be done later)

func main() {
	dbCon := database.New("")
	dbCon.RunMigrations()
	store := models.NewModel(dbCon)
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Set("store", store)
		c.Next()
	})

	// Allow all CORS in development environment
	if gin.Mode() == gin.DebugMode {
		r.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"*"},
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		}))
	}
	r.HTMLRender = createMyRender(viewsFS)
	gin.SetMode(gin.DebugMode)

	setupRoutes(r, store, staticFS)

	r.Run(":4000")
}
