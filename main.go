// main.go
package main

import (
	"embed"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator"
	"github.com/rapidforge-io/rapidforge/config"
	"github.com/rapidforge-io/rapidforge/database"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/models"
	"github.com/rapidforge-io/rapidforge/services"
	"github.com/rapidforge-io/rapidforge/utils"
)

//go:embed views/*.html
var viewsFS embed.FS

//go:embed static/*
var staticFS embed.FS

// TODO
// [ ] Think what to add for general settings page (license, current version and package)
// [ ] Implement user management
// [ ] Add pagination for event lists
// [ ] Add authentication feature to webhooks

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
// - consider running docker container with endpoints and periodics tasks

var buildVersion string
var packageVersion string

func main() {
	buildVersion = "1.0.0"
	packageVersion = "community"

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

	err := store.CreateAdminUserIfNoUserExists()
	if err != nil {
		rflog.Error("failed to create admin user", err)
	}

	r := gin.Default()

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("cron", utils.IsCronValid)
	}

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

	services.SetupService(store)
	setupRoutes(r, store, staticFS)

	r.Run(":4000")
}
