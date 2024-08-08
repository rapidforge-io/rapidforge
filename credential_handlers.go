package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rapidforge-io/rapidforge/config"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/models"
	"github.com/rapidforge-io/rapidforge/utils"
	"golang.org/x/oauth2"
)

type StateData struct {
	Name string `json:"name"`
}

func generateState(name string) (string, error) {
	stateData := StateData{
		Name: name,
	}

	stateJSON, err := json.Marshal(stateData)
	if err != nil {
		return "", fmt.Errorf("failed to marshal state: %w", err)
	}

	return base64.URLEncoding.EncodeToString(stateJSON), nil
}

func credentialsCreateHandlerGenerated(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		var formData models.CredentialFormData
		var credential models.Credential

		err := c.ShouldBind(&formData)
		if err != nil {
			c.Header("Content-Type", "text/html")
			c.String(http.StatusBadRequest, err.Error())
			return
		}

		credential.Type = formData.Type
		credential.Name = formData.Name

		if formData.Type == "oauth" {
			credential.GrantType = "authorization_code"
			credential.Value = sql.NullString{String: formData.Value, Valid: true}
			credential.ClientID = sql.NullString{String: formData.ClientID, Valid: true}
			credential.ClientSecret = sql.NullString{String: formData.ClientSecret, Valid: true}
			credential.OauthUrl = sql.NullString{String: formData.OauthUrl, Valid: true}
			credential.OauthTokenUrl = sql.NullString{String: formData.TokenUrl, Valid: true}
			credential.Scope = sql.NullString{String: formData.Scope, Valid: true}

			// Generate state
			state, err := generateState(credential.Name)
			if err != nil {
				c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
				return
			}

			err = store.InsertCredential(&credential)
			if err != nil {
				c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
				return
			}

			// Generate the auth URL and redirect
			oauthConfig := &oauth2.Config{
				ClientID:     credential.ClientID.String,
				ClientSecret: credential.ClientSecret.String,
				RedirectURL:  config.CredentialCallbackUrl(),
				Scopes:       []string{credential.Scope.String},
				Endpoint: oauth2.Endpoint{
					AuthURL:  credential.OauthUrl.String,
					TokenURL: credential.OauthTokenUrl.String,
				},
			}
			// oauth2.AccessTypeOnline

			authURL := oauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)

			c.Header("HX-Redirect", authURL)
			c.Status(http.StatusFound)
			//c.Redirect(http.StatusFound, authURL)
		} else {
			c.Header("Content-Type", "text/html")
			err = store.InsertCredential(&credential)
			if err != nil {
				c.String(http.StatusOK, utils.AlertBox(utils.Error, err.Error()))
				return
			}
			c.String(http.StatusOK, utils.AlertBox(utils.Info, "Credential Created"))
		}
	}

}

func credentialsHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.HTML(http.StatusOK, "credentials", gin.H{
			"callbackUrl": config.CredentialCallbackUrl(),
		})
	}
}

func credentialsSearchHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		searchQuery := c.Query("q")
		if searchQuery == "" {

			credentials, err := store.ListCredentials()

			if err != nil {
				c.Header("Content-Type", "text/html")
				c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
				return
			}

			c.HTML(http.StatusOK, "credential_list", gin.H{
				"Credentials": credentials,
			})
			return
		}

		credentials, err := store.SearchCredentials(searchQuery)
		if err != nil {
			c.Header("Content-Type", "text/html")
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.HTML(http.StatusOK, "credential_list", gin.H{
			"Credentials": credentials,
		})
	}
}

func credentialsDeleteHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		c.Header("Content-Type", "text/html")

		err := store.DeleteCredential(utils.ParseInt64(id))
		if err != nil {
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.String(http.StatusOK, utils.AlertBox(utils.Success, "Credential deleted"))
	}
}

func credentialsListHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		credentials, err := store.ListCredentials()
		if err != nil {
			c.Header("Content-Type", "text/html")
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		if len(*credentials) == 0 {
			c.Header("Content-Type", "text/html")

			message := "Credentials are used to store sensitive information. Create a credential to use it in your scripts"

			tmpl := `<div class="is-flex is-align-items-center is-justify-content-center">
                    <sl-alert open>
					  <div >
					  <sl-icon slot="icon" name="info-circle"></sl-icon>
					   {{.Message}}
					  </div>
                    </sl-alert>
                    </div>`

			outputHtml, err := utils.GenerateHTML(tmpl, map[string]any{"Message": message})

			if err != nil {
				c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
				return
			}

			c.String(http.StatusOK, outputHtml)
		}

		c.HTML(http.StatusOK, "credential_list", gin.H{
			"Credentials": credentials,
		})
	}
}

// 2024/08/01 00:13:08 INFO ----- token="&{AccessToken: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
// TokenType:bearer RefreshToken: Expiry:0001-01-01 00:00:00 +0000 UTC raw:map[access_token:[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] scope:[gist]
// token_type:[bearer]] expiryDelta:0}"
func oAuth2CallbackHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {

		code := c.Query("code")
		state := c.Query("state")
		if code == "" || state == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		// Decode state
		var stateData StateData
		stateBytes, err := base64.URLEncoding.DecodeString(state)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode state"})
			return
		}

		err = json.Unmarshal(stateBytes, &stateData)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal state"})
			return
		}

		credential, err := store.FetchCredentialByName(stateData.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Credential not found"})
			return
		}

		oauthConfig := &oauth2.Config{
			ClientID:     credential.ClientID.String,
			ClientSecret: credential.ClientSecret.String,
			RedirectURL:  config.CredentialCallbackUrl(),
			Scopes:       []string{credential.Scope.String},
			Endpoint: oauth2.Endpoint{
				AuthURL:  credential.OauthUrl.String,
				TokenURL: credential.OauthTokenUrl.String,
			},
		}

		token, err := oauthConfig.Exchange(context.Background(), code)
		// token.ex
		rflog.Info("-----", "token", token)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token"})
			return
		}

		// Save the token and related information to the database
		err = store.SaveToken(credential.ID, token)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save token"})
			return
		}

		c.Redirect(http.StatusFound, "/credentials")
	}
}

const webhookURL = "https://discord.com/api/webhooks/1269323216955117579/dyetvast66wSf7VVWSSot24F8KCU5emuRjWrI82U4oOEBiwK9TxIdcM_4tZnpmbUSowo"

func feedbackHandler() gin.HandlerFunc {
	type Feedback struct {
		Content  string `json:"content" form:"feedback" binding:"required"`
		Username string `json:"username"`
	}

	return func(c *gin.Context) {

		var feedback Feedback

		err := c.ShouldBind(&feedback)
		if err != nil {
			c.Header("Content-Type", "text/html")
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "Invalid parameters"))
			return
		}

		feedback.Username = "Feedback"

		messageBytes, err := json.Marshal(feedback)
		if err != nil {
			rflog.Error("Error marshalling message", "err", err)
		}

		rflog.Info("feedback", "feedback", string(messageBytes))

		resp, err := http.Post(webhookURL, "application/json", bytes.NewBuffer(messageBytes))
		if err != nil || resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
			rflog.Error("Error sending POST request", "err", err, "status", resp.Status)
		}

		c.String(http.StatusOK, utils.AlertBox(utils.Success, "Feedback submitted successfully"))
	}
}

func refreshCredentialHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		credential, err := store.FetchCredentialByID(utils.ParseInt64(id))
		if err != nil {
			c.Header("Content-Type", "text/html")
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		state, err := generateState(credential.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate state"})
			return
		}

		oauthConfig := &oauth2.Config{
			ClientID:     credential.ClientID.String,
			ClientSecret: credential.ClientSecret.String,
			RedirectURL:  config.CredentialCallbackUrl(),
			Scopes:       []string{credential.Scope.String},
			Endpoint: oauth2.Endpoint{
				AuthURL:  credential.OauthUrl.String,
				TokenURL: credential.OauthTokenUrl.String,
			},
		}

		authURL := oauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)

		c.Header("HX-Redirect", authURL)
		c.Status(http.StatusFound)
	}
}
