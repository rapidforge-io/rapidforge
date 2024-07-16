// main.go
package main

import (
	"embed"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/rapidforge-io/rapidforge/config"
	"github.com/rapidforge-io/rapidforge/database"
	"github.com/rapidforge-io/rapidforge/models"
)

//go:embed views/*.html
var viewsFS embed.FS

//go:embed static/*
var staticFS embed.FS

// TODO
// [ ] Add out column to event log
// [ ] Make list view for webhook event logs
// [ ] Make a list view for block event logs
// [ ] Add back button for views
// [ ] Add blank state button
// [ ] Implement perodic task
// [ ] Think what to add for settings page

// [ ] Add Settings page general settings
// [ ] Add search function
// [ ] Should we add status to periodic tasks?
// [ ] Add pagination for block list (can be done later)
// [ ] Adding throttling for webhook endpoints
// [ ] adding config for max password attempt

// Thinking
// - what will happend for authentication when there is more then one instance
// - check backup from pocketbase
// - only allow user creation from admin board
// - import script feature, importing and creating end points for each file

func main() {
	dbCon := database.GetDbConn("")
	dbCon.RunMigrations()
	store := models.NewModel(dbCon)
	authSecret, _ := store.GetConfigByKey("authSecretKey")

	if len(authSecret) == 0 {
		authSecret = config.Get().AuthSecretKey
		store.InsertSetting("authSecretKey", authSecret)
	} else {
		config.SetAuthSecretKey(authSecret)
	}

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
