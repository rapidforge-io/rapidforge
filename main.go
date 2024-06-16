package main

import (
	"embed"
	"fmt"
	"html/template"
	"net/http"
	"reflect"
	"strconv"
	"time"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"

	"github.com/rapidforge-io/rapidforge/database"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/models"
)

func formatAsDate(t time.Time) string {
	year, month, day := t.Date()
	return fmt.Sprintf("%d%02d/%02d", year, month, day)
}

//go:embed views/*.html
var viewsFS embed.FS

//go:embed static/*
var staticFS embed.FS

// TODO
// [x] Complete Block view
// [ ] Complete Webhook list view
// [ ] Complete Webhook view

func createMyRender() multitemplate.Renderer {
	r := multitemplate.NewRenderer()

	// Define the common template functions
	funcMap := template.FuncMap{
		"formatAsDate": formatAsDate,
	}

	basePages := []string{"views/base.html", "views/navbar.html"}

	// Create and add templates to the renderer
	addTemplate := func(name string, extraPages ...string) {
		allPages := append(basePages, extraPages...)
		tmpl := template.Must(template.New("base.html").Funcs(funcMap).ParseFS(viewsFS, allPages...))
		r.Add(name, tmpl)
	}

	addTemplate("blocks_base", "views/blocks_base.html")
	addTemplate("block", "views/block.html")

	templates, err := template.ParseFS(viewsFS, "views/card.html")
	if err != nil {
		panic(err)
	}

	r.Add("blocks", templates)

	return r
}

func toMap(data any) map[string]any {
	result := make(map[string]any)
	val := reflect.ValueOf(data)

	// Handle pointer to struct
	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}

	if val.Kind() == reflect.Struct {
		typ := val.Type()
		for i := 0; i < val.NumField(); i++ {
			fieldName := typ.Field(i).Name
			fieldValue := val.Field(i).Interface()
			result[fieldName] = fieldValue
		}
	}

	return result
}

func parseInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return i
}

func main() {

	dbCon := database.New("")
	dbCon.RunMigrations()
	store := models.NewModel(dbCon)
	r := gin.Default()
	gin.SetMode(gin.DebugMode)
	r.SetFuncMap(template.FuncMap{
		"formatAsDate": formatAsDate,
	})

	r.HTMLRender = createMyRender()

	staticServer := http.FileServer(http.FS(staticFS))
	r.GET("/static/*filepath", func(c *gin.Context) {
		c.Request.URL.Path = "static" + c.Param("filepath")
		staticServer.ServeHTTP(c.Writer, c.Request)
	})

	r.POST("/rename/:type/:id", func(c *gin.Context) {
		id := c.Param("id")
		tableType := c.Param("type")
		intId := parseInt(id)
		// block, err := store.SelectBlockById(intId)
		// if err != nil {
		// 	c.HTML(http.StatusInternalServerError, "error", gin.H{
		// 		"error": err.Error(),
		// 	})
		// 	return
		// }

		newName := c.PostForm("name")
		rflog.Info("Block", "newName", newName)
		updatedName, err := store.UpdateName(tableType, intId, newName)
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}
		htmlContent := fmt.Sprintf(`<div id="blockTitle">%v</div>`, updatedName)
		rflog.Info("Block", "updatedName", updatedName)
		c.Header("Content-Type", "text/html")
		c.String(200, htmlContent)
	})

	r.GET("/blocks_list", func(c *gin.Context) {
		blocks, err := store.ListBlocks()

		rflog.Info("Blocks", "blocks", blocks)
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}

		c.HTML(http.StatusOK, "blocks", gin.H{
			"blocks": blocks,
		})
	})

	r.GET("/blocks/:id", func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		block, err := store.SelectBlockById(intId)
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}

		rflog.Info("Block", "block", block)

		c.HTML(http.StatusOK, "block", gin.H{
			"block": block,
		})
	})

	r.POST("/blocks/create", func(c *gin.Context) {
		var block models.Block
		id, err := store.InsertBlockWithAutoName(block.Description, block.Active, block.EnvVariables)
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}
		c.Redirect(http.StatusFound, "/blocks/"+strconv.FormatInt(id, 10))

		// c.HTML(http.StatusOK, "raw2", gin.H{
		// 	"blocks": store.ListBlocks(),
		// })
	})

	// Serve the HTML template
	r.GET("/blocks", func(c *gin.Context) {
		c.HTML(http.StatusOK, "blocks_base", gin.H{
			"now": time.Date(2017, 0o7, 0o1, 0, 0, 0, 0, time.UTC),
		})
		// c.HTML(http.StatusOK, "raw", gin.H{
		// 	"now": time.Date(2017, 0o7, 0o1, 0, 0, 0, 0, time.UTC),
		// })
	})

	// TODO
	r.GET("/pages", func(c *gin.Context) {
		c.HTML(http.StatusOK, "pages.html", gin.H{
			"now": time.Date(2017, 0o7, 0o1, 0, 0, 0, 0, time.UTC),
		})
	})

	r.Run(":4000")
}
