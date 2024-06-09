package main

import (
	"embed"
	"fmt"
	"html/template"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rapidforge-io/rapidforge/database"
)

func formatAsDate(t time.Time) string {
	year, month, day := t.Date()
	return fmt.Sprintf("%d%02d/%02d", year, month, day)
}

//go:embed views/*.html
var viewsFS embed.FS

//go:embed static/*
var staticFS embed.FS

func main() {
	database.RunMigrations()
	r := gin.Default()

	r.SetFuncMap(template.FuncMap{
		"formatAsDate": formatAsDate,
	})

	tmpl := template.New("").Funcs(template.FuncMap{
		"formatAsDate": formatAsDate,
	})
	tmpl = template.Must(tmpl.ParseFS(viewsFS, "views/*.html"))
	r.SetHTMLTemplate(tmpl)

	staticServer := http.FileServer(http.FS(staticFS))
	r.GET("/static/*filepath", func(c *gin.Context) {
		c.Request.URL.Path = "static" + c.Param("filepath")
		staticServer.ServeHTTP(c.Writer, c.Request)
	})

	// Serve the HTML template
	r.GET("/raw", func(c *gin.Context) {
		c.HTML(http.StatusOK, "raw.html", gin.H{
			"now": time.Date(2017, 0o7, 0o1, 0, 0, 0, 0, time.UTC),
		})
	})

	r.Run(":4000")
}

// func main() {

// 	router := gin.Default()
// 	router.SetFuncMap(template.FuncMap{
// 		"formatAsDate": formatAsDate,
// 	})
// 	router.StaticFile("test.js", "./views/javascript/test.js")
// 	router.LoadHTMLGlob("./views/*.html")
// 	// router.LoadHTMLFiles("./views/raw.html")

// 	router.GET("/raw", func(c *gin.Context) {
// 		c.HTML(http.StatusOK, "raw.html", gin.H{
// 			"now": time.Date(2017, 0o7, 0o1, 0, 0, 0, 0, time.UTC),
// 		})
// 	})

// 	router.Run(":4000")

// }
