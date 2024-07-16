package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

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

		blockEnvVariables := webhook.Block.GetEnvVars()
		webhookEnvVariables := webhook.Webhook.GetEnvVars()

		envVars = utils.MergeMaps(envVars, blockEnvVariables)
		envVars = utils.MergeMaps(envVars, webhookEnvVariables)

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

		headers := c.Request.Header
		const prefix = "HEADER"

		eventArgs := map[string]any{
			"payload": envVars["PAYLOAD_DATA"],
			"headers": map[string]any{},
		}

		// injecting headers
		for key, values := range headers {
			strings.Join(values, ",")
			for _, value := range values {
				key := prefix + "_" + strings.Replace(strings.ToUpper(key), "-", "_", -1)
				envVars[key] = value
				// prep for recording event args
				tmp := eventArgs["headers"].(map[string]any)
				tmp[key] = value
			}
		}

		envVars = utils.MergeMaps(envVars, webhookEnvVariables)

		exitHttpPair := webhook.Webhook.GetExitHttpPair()

		res, err := bashrunner.Run(webhook.File.Content, envVars)

		args, _ := json.Marshal(eventArgs)

		defer store.InsertEvent(models.Event{
			Status:         fmt.Sprint(res.ExitCode),
			CreatedAt:      time.Now(),
			EventType:      utils.WebhookEntity,
			Args:           string(args),
			Logs:           string(res.Error),
			WebhookID:      sql.NullInt64{Int64: webhook.Webhook.ID, Valid: true},
			PeriodicTaskID: sql.NullInt64{},
			BlockID:        webhook.Block.ID,
		})

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

func eventsHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		typeName := c.Param("type")
		id := c.Param("id")

		idField := map[string]string{
			utils.WebhookEntity:      "webhook_id",
			utils.BlockEntity:        "block_id",
			utils.PeriodicTaskEntity: "periodic_task_id",
		}

		c.Header("Content-Type", "text/html")

		if typeName == "" {
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "typeName is required"))
			return
		}

		if id == "" {
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "id is required"))
			return
		}

		events, err := store.FetchEventByTypeAndID(typeName, parseInt(id), idField[typeName])

		if err != nil {
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.HTML(http.StatusOK, "event_table", gin.H{
			"events": events,
		})
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
			"Type":                    utils.WebhookEntity,
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

func deleteHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		typeName := c.Param("type")
		intId := parseInt(id)

		if typeName == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "typeName is required"})
			return
		}

		switch typeName {
		case utils.BlockEntity:
			err := store.DeleteBlockById(intId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		case utils.WebhookEntity:
			err := store.DeleteWebhookById(intId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		case utils.PageEntity:
			err := store.DeletePageById(intId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		case utils.PeriodicTaskEntity:
			err := store.DeletePeriodicTaskById(intId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "typeName is invalid"})
			return
		}

		c.Status(http.StatusOK)
		c.String(200, utils.AlertBox(utils.Success, "Item deleted"))
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
		rflog.Info("-----", "pageData", pageData.Active)
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

func parseInt(s string) int64 {
	i, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return 0
	}
	return i
}
