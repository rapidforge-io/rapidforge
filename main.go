// main.go
package main

import (
	"embed"
	"html/template"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/rapidforge-io/rapidforge/database"
	"github.com/rapidforge-io/rapidforge/models"
	"github.com/rapidforge-io/rapidforge/utils"
)

//go:embed views/*.html
var viewsFS embed.FS

//go:embed static/*
var staticFS embed.FS

func createMyRender() multitemplate.Renderer {
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

func main() {
	dbCon := database.New("")
	dbCon.RunMigrations()
	store := models.NewModel(dbCon)
	r := gin.Default()
	r.HTMLRender = createMyRender()
	gin.SetMode(gin.DebugMode)

	setupRoutes(r, store, viewsFS, staticFS)

	r.Run(":4000")
}
