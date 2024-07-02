package main

import (
	"database/sql"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/rapidforge-io/rapidforge/bashrunner"
	"github.com/rapidforge-io/rapidforge/config"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/models"
	"github.com/rapidforge-io/rapidforge/utils"
)

func webhookHandlers(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		httpVerb := c.Request.Method
		path := c.Param("path")
		envVars := map[string]string{}

		path = strings.TrimPrefix(path, "/")
		webhook, err := store.SelectWebhookByPath(path, httpVerb)

		if errors.Is(err, sql.ErrNoRows) {
			rflog.Error("failed to get webhook", err, "path", path)
			c.Status(http.StatusNotFound)
			return
		}

		if httpVerb == "POST" || httpVerb == "PUT" || httpVerb == "PATCH" {
			body, err := io.ReadAll(c.Request.Body)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
				return
			}

			envVars["PAYLOAD_DATA"] = string(body)
		} else {
			const prefix = "URL_PARAM"
			values := c.Request.URL.Query()
			for k, v := range values {
				key := prefix + "_" + strings.ToUpper(k)
				envVars[key] = v[0]
			}
		}

		webhookEnvVariables := webhook.Webhook.GetEnvVars()
		headers := c.Request.Header
		const prefix = "HEADER"

		// injecting headers
		for key, values := range headers {
			strings.Join(values, ",")
			for _, value := range values {
				key := prefix + "_" + strings.Replace(strings.ToUpper(key), "-", "_", -1)
				envVars[key] = value
			}
		}

		envVars = utils.MergeMaps(envVars, webhookEnvVariables)

		// rflog.Info("----", "webhook env vars", envVars)

		exitHttpPair := webhook.Webhook.GetExitHttpPair()

		rflog.Info("----", "webhook exit http pair", exitHttpPair)

		res, err := bashrunner.Run(webhook.File.Content, envVars)

		httpCode, ok := exitHttpPair[res.ExitCode]

		if !ok {
			httpCode = http.StatusOK
		}

		if err != nil {
			rflog.Error("failed to run webhook", err)
			c.Status(http.StatusInternalServerError)
		}

		c.JSON(httpCode, res)
	}
}

func pageHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Param("path")
		decodedURL, _ := url.QueryUnescape(path)
		page, err := store.SelectPageByPath(decodedURL)

		if err != nil {
			rflog.Error("failed to get page", err)
			c.Status(http.StatusNotFound)
		}

		html := utils.DefaultString(page.HTMLOutput, "<p>Page is empty</p>")

		c.Header("Content-Type", "text/html")
		c.String(http.StatusOK, html)
	}
}

func renameHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		tableType := c.Param("type")
		intId := parseInt(id)
		newName := c.PostForm("val")
		var updatedField string
		var err error
		var htmlContent string
		if tableType != utils.WebhookEntity {
			updatedField, err = store.UpdateName(tableType, intId, newName)
			htmlContent = fmt.Sprintf(`<div id="blockTitle">%v</div>`, updatedField)
		} else {
			updatedField, err = store.UpdateWebhookPath(intId, newName)
			htmlContent = fmt.Sprintf(`<div id="blockTitle">%v/webhook/%v</div>`, config.BaseUrl(), updatedField)
		}

		if err != nil {
			rflog.Error("failed to update name", err)
			key, value := utils.ToastHeader(err.Error())
			c.Header(key, value)
			return
		}
		rflog.Info("Block", "updatedName", updatedField)
		c.Header("Content-Type", "text/html")
		c.String(200, htmlContent)
	}
}

func blocksListHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		blocks, err := store.ListBlocks()

		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}

		mapBlocks := utils.TransformToMaps(blocks, "blocks")

		c.HTML(http.StatusOK, "blocks", gin.H{
			"blockMaps": mapBlocks,
		})
	}
}

func getBlockHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		block, err := store.SelectBlockById(intId)
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}
		webhooks, err := store.ListWebhooksByBlockID(block.ID)

		if err != nil {
			rflog.Error("failed to get webhooks", err)
			return
		}

		editableComponentArgs := utils.ToMap(block)
		editableComponentArgs["Type"] = utils.BlockEntity
		editableComponentArgs["Field"] = block.Name

		webhookMaps := utils.TransformToMaps(webhooks, utils.WebhookEntity)

		c.HTML(http.StatusOK, "block", gin.H{
			"block":                   block,
			"webhooks":                webhookMaps,
			"editableComponentParams": editableComponentArgs,
		})
	}
}

func getBlockEntitiesHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		entityType := c.Param("type")
		blockId := parseInt(id)

		var data []map[string]any

		switch entityType {
		case utils.WebhookEntity:
			webhooks, err := store.ListWebhooksByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get pages", err)
				return
			}
			data = utils.TransformToMaps(webhooks, utils.WebhookEntity)
		case utils.PageEntity:
			pages, err := store.ListPagesByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get pages", err)
				return
			}
			data = utils.TransformToMaps(pages, utils.PageEntity)
		case utils.PeriodicTaskEntity:
			periodicRuns, err := store.ListPeriodicTasksByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get periodic runs", err)
				return
			}
			data = utils.TransformToMaps(periodicRuns, utils.PeriodicTaskEntity)
		case "all":
			// Fetch all types
			webhooks, err := store.ListWebhooksByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get webhooks", err)
				c.AbortWithStatus(http.StatusInternalServerError)
				return
			}
			pages, err := store.ListPagesByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get pages", err)
				c.AbortWithStatus(http.StatusInternalServerError)
				return
			}
			periodicRuns, err := store.ListPeriodicTasksByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get periodic runs", err)
				c.AbortWithStatus(http.StatusInternalServerError)
				return
			}

			// Transform each type to maps and combine
			data = append(data, utils.TransformToMaps(webhooks, utils.WebhookEntity)...)
			data = append(data, utils.TransformToMaps(pages, utils.PageEntity)...)
			data = append(data, utils.TransformToMaps(periodicRuns, utils.PeriodicTaskEntity)...)
		}

		c.HTML(http.StatusOK, "entities", gin.H{
			"data": data,
		})
	}
}

func createBlockHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		var block models.Block
		id, err := store.InsertBlockWithAutoName(block.Description, block.Active)
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}
		redirectTo := fmt.Sprintf("/blocks/%d", id)

		c.Header("HX-Redirect", redirectTo)
		c.Status(http.StatusFound)
	}
}

func createWebhookHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		blockId := parseInt(c.PostForm("blockId"))

		webhookId, err := store.InsertWebhookWithAutoName(blockId)

		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}

		redirectTo := fmt.Sprintf("/webhooks/%d", webhookId)
		c.Header("HX-Redirect", redirectTo)
		c.Status(http.StatusFound)
	}
}

func blocksBaseHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "blocks_base", gin.H{})
}

func updateWebhookHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		_, err := store.SelectWebhookById(intId)
		if err != nil {
			rflog.Error("failed to get webhook", err)
			return
		}

		var form models.WebhookFormData

		if err := c.ShouldBind(&form); err != nil {
			// Return error messages if validation fails
			var errs []string
			for _, err := range err.(validator.ValidationErrors) {
				errs = append(errs, err.Field()+": "+err.ActualTag())
			}
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		err = store.UpdateFileContentByWebhookID(intId, form)

		if err != nil {
			rflog.Error("failed to update file content", err)
			return
		}

		c.Header("Content-Type", "text/html")
		c.String(200, utils.AlertBox(utils.Success, "Webhook updated"))
	}
}

func updatePeriodicTaskHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)

		var form models.PeriodicTaskFormData

		if err := c.ShouldBind(&form); err != nil {
			// Return error messages if validation fails
			var errs []string
			for _, err := range err.(validator.ValidationErrors) {
				errs = append(errs, err.Field()+": "+err.ActualTag())
			}
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		err := store.UpdatePeriodicTaskByFrom(intId, form)

		if err != nil {
			rflog.Error("failed to update periodic task", err)
			return
		}

		c.Header("Content-Type", "text/html")
		c.String(200, utils.AlertBox(utils.Success, "Periodic task updated"))
	}
}

func getWebhookHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		webhookWithDetails, err := store.SelectWebhookDetailsById(intId)
		if err != nil {
			rflog.Error("failed to get webhook", err)
			return
		}
		editableComponentArgs := utils.ToMap(webhookWithDetails.Webhook)
		editableComponentArgs["Type"] = utils.WebhookEntity
		editableComponentArgs["Field"] = webhookWithDetails.Webhook.Path
		editableComponentArgs["Url"] = fmt.Sprintf("%s/webhook/%s", config.BaseUrl(), webhookWithDetails.Webhook.Path)
		c.HTML(http.StatusOK, "webhook", gin.H{
			"webhook":                 webhookWithDetails.Webhook,
			"httpExitPair":            webhookWithDetails.Webhook.GetExitHttpPair(),
			"fileContent":             utils.DefaultHtml(webhookWithDetails.File.Content, "echo 'Hello World!'"),
			"editableComponentParams": editableComponentArgs,
		})
	}
}

func getPeriodicTaskHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		periodicTaskDetails, err := store.SelectPeriodicTaskDetailsById(intId)
		if err != nil {
			rflog.Error("failed to get periodic tasks", err)
			return
		}
		editableComponentArgs := utils.ToMap(periodicTaskDetails.PeriodicTask)
		editableComponentArgs["Type"] = utils.PeriodicTaskEntity
		editableComponentArgs["Field"] = utils.DefaultString(periodicTaskDetails.PeriodicTask.Name, "No Name")
		c.HTML(http.StatusOK, "periodic_task", gin.H{
			"periodicTask":            periodicTaskDetails.PeriodicTask,
			"fileContent":             utils.DefaultString(periodicTaskDetails.File.Content, "echo 'Hello World!'"),
			"editableComponentParams": editableComponentArgs,
		})
	}
}

func createPageHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		blockId := parseInt(c.PostForm("blockId"))

		webhookId, err := store.InsertPageWithAutoName(blockId)

		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}

		redirectTo := fmt.Sprintf("/pages/%d", webhookId)
		c.Header("HX-Redirect", redirectTo)
		c.Status(http.StatusFound)
	}
}

func createPeriodicTaskHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		blockId := parseInt(c.PostForm("blockId"))

		periodicTaskId, err := store.InsertPeriodicTaskWithAutoName(blockId)

		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}

		redirectTo := fmt.Sprintf("/periodic_tasks/%d", periodicTaskId)
		c.Header("HX-Redirect", redirectTo)
		c.Status(http.StatusFound)
	}
}

func updatePageHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		var pageData models.PageData

		if err := c.ShouldBindJSON(&pageData); err != nil {
			// Return error messages if validation fails
			var errs []string
			for _, err := range err.(validator.ValidationErrors) {
				errs = append(errs, err.Field()+": "+err.ActualTag())
			}
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		err := store.UpdatePageByID(intId, pageData)

		if err != nil {
			rflog.Error("failed to update page", err)
		}

		c.Status(http.StatusOK)
	}
}

func pagesHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		page, err := store.SelectPageById(intId)
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
		}
		c.HTML(http.StatusOK, "page", gin.H{
			"page":    page,
			"baseUrl": config.BaseUrl(),
		})
	}
}

func parseInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return i
}
