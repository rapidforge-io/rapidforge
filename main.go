// main.go
package main

import (
	"embed"

	"github.com/gin-gonic/gin"
	"github.com/rapidforge-io/rapidforge/database"
	"github.com/rapidforge-io/rapidforge/models"
)

//go:embed views/*.html
var viewsFS embed.FS

//go:embed static/*
var staticFS embed.FS

// TODO
// [ ] Pages
// [ ] Make page list page
// [ ] Fetch page details when page editor is opened
// [ ] Save button should send a request to save page

// [ ] Not found webhook should not cause a panic
// [ ] Returning header config for webhook
// [ ] Add back button for block and webhook
// [ ] Add Settings page general settings
// [ ] Add delete action
// [ ] Add search function
// [ ] Add pagination for block list (can be done later)

func main() {
	dbCon := database.New("")
	dbCon.RunMigrations()
	store := models.NewModel(dbCon)
	r := gin.Default()
	r.HTMLRender = createMyRender(viewsFS)
	gin.SetMode(gin.DebugMode)

	setupRoutes(r, store, staticFS)

	r.Run(":4000")
}
