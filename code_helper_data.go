package main

import (
	"fmt"
	"strings"

	"github.com/rapidforge-io/rapidforge/utils"
)

type codeHelperItemSpec struct {
	ID        string
	Title     string
	Kind      string
	Contexts  []string
	Languages []string
	Keywords  []string
	Summary   string
	Content   string
	Snippets  map[string]string
	SourceID  string
	QuickRef  bool
}

type codeHelperSectionSpec struct {
	ID      string
	Title   string
	ItemIDs []string
}

type codeHelperSourceSpec struct {
	ID                  string
	Label               string
	Description         string
	Searchable          bool
	ExternalURLTemplate string
}

func helperSnippets(pairs ...string) map[string]string {
	snippets := map[string]string{}
	for index := 0; index+1 < len(pairs); index += 2 {
		if pairs[index+1] == "" {
			continue
		}
		snippets[pairs[index]] = pairs[index+1]
	}
	return snippets
}

func (spec codeHelperItemSpec) toMap() map[string]any {
	context := "all"
	if len(spec.Contexts) == 1 {
		context = spec.Contexts[0]
	}

	item := map[string]any{
		"id":       spec.ID,
		"title":    spec.Title,
		"kind":     spec.Kind,
		"context":  context,
		"contexts": spec.Contexts,
		"language": spec.Languages,
		"keywords": spec.Keywords,
		"summary":  spec.Summary,
		"content":  spec.Content,
		"quickRef": spec.QuickRef,
	}

	if len(spec.Snippets) > 0 {
		item["snippet"] = spec.Snippets["bash"]
		item["snippets"] = spec.Snippets
	}

	if spec.SourceID != "" {
		item["sourceId"] = spec.SourceID
	}

	return item
}

func (spec codeHelperSectionSpec) toMap() map[string]any {
	return map[string]any{
		"id":      spec.ID,
		"title":   spec.Title,
		"itemIds": spec.ItemIDs,
	}
}

func (spec codeHelperSourceSpec) toMap() map[string]any {
	return map[string]any{
		"id":                  spec.ID,
		"label":               spec.Label,
		"description":         spec.Description,
		"searchable":          spec.Searchable,
		"externalUrlTemplate": spec.ExternalURLTemplate,
	}
}

func defaultCodeHelperItems() []codeHelperItemSpec {
	return []codeHelperItemSpec{
		{
			ID:        "payload-data",
			Title:     "PAYLOAD_DATA",
			Kind:      "env_var",
			Contexts:  []string{utils.WebhookEntity},
			Languages: []string{"bash", "lua"},
			Keywords:  []string{"request", "body", "payload", "json", "webhook"},
			Summary:   "Request body data for webhook runs.",
			Content:   "RapidForge stores the raw request body in PAYLOAD_DATA so scripts can parse or forward it.",
			Snippets:  helperSnippets("bash", `echo "$PAYLOAD_DATA"`, "lua", `local payload = os.getenv("PAYLOAD_DATA")`),
			SourceID:  "rapidforge-internal",
			QuickRef:  true,
		},
		{
			ID:        "form-vars",
			Title:     "FORM_{NAME}",
			Kind:      "env_var",
			Contexts:  []string{utils.WebhookEntity},
			Languages: []string{"bash", "lua"},
			Keywords:  []string{"form", "request", "fields", "post"},
			Summary:   "Parsed form fields from webhook requests.",
			Content:   "Each submitted form field becomes an environment variable such as FORM_COMMENT or FORM_EMAIL.",
			Snippets:  helperSnippets("bash", `echo "$FORM_COMMENT"`, "lua", `local comment = os.getenv("FORM_COMMENT")`),
			SourceID:  "rapidforge-internal",
			QuickRef:  true,
		},
		{
			ID:        "url-param-vars",
			Title:     "URL_PARAM_{NAME}",
			Kind:      "env_var",
			Contexts:  []string{utils.WebhookEntity},
			Languages: []string{"bash", "lua"},
			Keywords:  []string{"query", "params", "url", "get"},
			Summary:   "Query parameters for GET-style webhook requests.",
			Content:   "RapidForge exposes query parameters as URL_PARAM_* values so you can branch on request input.",
			Snippets:  helperSnippets("bash", `echo "$URL_PARAM_ID"`, "lua", `local id = os.getenv("URL_PARAM_ID")`),
			SourceID:  "rapidforge-internal",
			QuickRef:  true,
		},
		{
			ID:        "header-vars",
			Title:     "HEADER_{HEADER_NAME}",
			Kind:      "env_var",
			Contexts:  []string{utils.WebhookEntity},
			Languages: []string{"bash", "lua"},
			Keywords:  []string{"headers", "request", "user agent", "auth"},
			Summary:   "Incoming webhook headers as environment variables.",
			Content:   "Headers are normalized into HEADER_* variables such as HEADER_USER_AGENT and HEADER_CONTENT_TYPE.",
			Snippets:  helperSnippets("bash", `echo "$HEADER_USER_AGENT"`, "lua", `local userAgent = os.getenv("HEADER_USER_AGENT")`),
			SourceID:  "rapidforge-internal",
			QuickRef:  true,
		},
		{
			ID:        "credential-vars",
			Title:     "CRED_{CREDENTIAL_NAME}",
			Kind:      "env_var",
			Contexts:  []string{"all"},
			Languages: []string{"bash", "lua"},
			Keywords:  []string{"credentials", "secret", "token", "oauth"},
			Summary:   "Saved credentials exposed as environment variables.",
			Content:   "Stored credentials are injected as CRED_* variables, for example CRED_GITHUB_OAUTH_TOKEN.",
			Snippets:  helperSnippets("bash", `echo "$CRED_GITHUB_OAUTH_TOKEN"`, "lua", `local token = os.getenv("CRED_GITHUB_OAUTH_TOKEN")`),
			SourceID:  "rapidforge-internal",
			QuickRef:  true,
		},
		{
			ID:        "kv-helpers",
			Title:     "KV Helpers (Bash)",
			Kind:      "helper_method",
			Contexts:  []string{"all"},
			Languages: []string{"bash"},
			Keywords:  []string{"kv", "key value", "storage", "sqlite"},
			Summary:   "Read and write small persistent values from Bash scripts.",
			Content:   "Use the built-in kv_get, kv_set, kv_del, and kv_list helpers for small shared state across webhook and periodic-task runs.",
			Snippets: helperSnippets(
				"bash", `kv_get KEY
kv_set KEY VALUE
kv_del KEY
kv_list`,
			),
			SourceID: "rapidforge-internal",
			QuickRef: true,
		},
		{
			ID:        "lua-kv-module",
			Title:     `Lua "kv" Module`,
			Kind:      "helper_method",
			Contexts:  []string{"all"},
			Languages: []string{"lua"},
			Keywords:  []string{"lua", "kv", "require", "storage", "keys"},
			Summary:   `Built-in Lua module for key-value storage.`,
			Content:   `RapidForge ships luarunner/libs/kv.lua, so Lua scripts can require("kv") and call kv.get, kv.set, kv.del, and kv.list.`,
			Snippets: helperSnippets(
				"lua", `local kv = require("kv")
local value, err = kv.get("KEY")
if value then
  print(value)
end

kv.set("KEY", "VALUE")
kv.del("KEY")
local keys = kv.list()`,
			),
			SourceID: "rapidforge-internal",
			QuickRef: true,
		},
		{
			ID:        `lua-http-module`,
			Title:     `Lua "http" Module`,
			Kind:      "helper_method",
			Contexts:  []string{"all"},
			Languages: []string{"lua"},
			Keywords:  []string{"lua", "http", "require", "curl", "get", "post", "put", "delete"},
			Summary:   `Built-in Lua HTTP helper backed by curl.`,
			Content:   `RapidForge ships luarunner/libs/http.lua with http.get, http.post, http.put, and http.delete. Each call returns response body and HTTP status code.`,
			Snippets: helperSnippets(
				"lua", `local http = require("http")

local body, status = http.get("https://example.com", {
  ["Accept"] = "application/json"
})

local postBody, postStatus = http.post(
  "https://example.com/api",
  os.getenv("PAYLOAD_DATA") or "{}",
  { ["Content-Type"] = "application/json" }
)`,
			),
			SourceID: "lua-reference",
			QuickRef: true,
		},
		{
			ID:        `lua-json-module`,
			Title:     `Lua "json" Module`,
			Kind:      "helper_method",
			Contexts:  []string{"all"},
			Languages: []string{"lua"},
			Keywords:  []string{"lua", "json", "require", "encode", "decode"},
			Summary:   `Built-in Lua JSON encode/decode helper.`,
			Content:   `RapidForge ships luarunner/libs/json.lua, so Lua scripts can require("json") and use json.encode(...) and json.decode(...).`,
			Snippets: helperSnippets(
				"lua", `local json = require("json")

local payload = os.getenv("PAYLOAD_DATA") or "{}"
local data = json.decode(payload)

local encoded = json.encode({
  ok = true,
  id = data and data.id
})`,
			),
			SourceID: "lua-reference",
			QuickRef: true,
		},
		{
			ID:        "bash-http",
			Title:     "HTTP Request in Bash",
			Kind:      "snippet",
			Contexts:  []string{"all"},
			Languages: []string{"bash"},
			Keywords:  []string{"bash", "curl", "http", "request"},
			Summary:   "Send an HTTP request from a Bash script.",
			Content:   "Use curl for outgoing calls from Bash-based webhook and periodic-task scripts.",
			Snippets: helperSnippets(
				"bash", `curl -sS -X POST "https://example.com/api" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD_DATA"`,
			),
			SourceID: "bash-reference",
		},
		{
			ID:        "lua-http",
			Title:     "HTTP Request in Lua",
			Kind:      "snippet",
			Contexts:  []string{"all"},
			Languages: []string{"lua"},
			Keywords:  []string{"lua", "http", "request"},
			Summary:   "Use the bundled http Lua library for outgoing requests.",
			Content:   "RapidForge includes an http helper in Lua scripts for making outbound calls without shelling out.",
			Snippets: helperSnippets(
				"lua", `local http = require("http")
local response, err = http.request("POST", "https://example.com/api", {
  headers = { ["Content-Type"] = "application/json" },
  body = os.getenv("PAYLOAD_DATA") or "{}"
})`,
			),
			SourceID: "lua-reference",
		},
		{
			ID:        "on-fail-webhook",
			Title:     "Webhook On-Fail Vars",
			Kind:      "env_var",
			Contexts:  []string{utils.WebhookEntity},
			Languages: []string{"bash", "lua"},
			Keywords:  []string{"on fail", "failure", "stderr", "webhook"},
			Summary:   "Variables available to webhook on-fail scripts.",
			Content:   "Webhook on-fail scripts can inspect FAILURE_EXIT_CODE, FAILURE_OUTPUT, FAILURE_ERROR, WEBHOOK_ID, and WEBHOOK_PATH.",
			Snippets:  helperSnippets("bash", `echo "$FAILURE_ERROR"`, "lua", `local errorText = os.getenv("FAILURE_ERROR")`),
			SourceID:  "rapidforge-internal",
		},
		{
			ID:        "on-fail-periodic",
			Title:     "Periodic Task On-Fail Vars",
			Kind:      "env_var",
			Contexts:  []string{utils.PeriodicTaskEntity},
			Languages: []string{"bash", "lua"},
			Keywords:  []string{"on fail", "failure", "stderr", "task"},
			Summary:   "Variables available to periodic-task on-fail scripts.",
			Content:   "Periodic-task on-fail scripts can inspect FAILURE_EXIT_CODE, FAILURE_OUTPUT, FAILURE_ERROR, and TASK_ID.",
			Snippets:  helperSnippets("bash", `echo "$FAILURE_EXIT_CODE"`, "lua", `local exitCode = os.getenv("FAILURE_EXIT_CODE")`),
			SourceID:  "rapidforge-internal",
		},
	}
}

func defaultCodeHelperSections() []codeHelperSectionSpec {
	return []codeHelperSectionSpec{
		{ID: "request-data", Title: "Request data", ItemIDs: []string{"payload-data", "form-vars", "url-param-vars", "header-vars", "credential-vars"}},
		{ID: "helpers", Title: "Helpers", ItemIDs: []string{"kv-helpers", "on-fail-webhook", "on-fail-periodic"}},
		{ID: "lua-modules", Title: "Lua modules", ItemIDs: []string{"lua-kv-module", "lua-http-module", "lua-json-module"}},
		{ID: "bash-recipes", Title: "Bash recipes", ItemIDs: []string{"bash-http"}},
	}
}

func defaultCodeHelperSources() []codeHelperSourceSpec {
	return []codeHelperSourceSpec{
		{ID: "rapidforge-internal", Label: "RapidForge Docs", Description: "RapidForge installation and configuration docs.", ExternalURLTemplate: "https://rapidforge.io/install-config/"},
		{ID: "bash-reference", Label: "Bash Reference", Description: "External Bash manual and shell examples.", ExternalURLTemplate: "https://www.gnu.org/software/bash/manual/bash.html"},
		{ID: "lua-reference", Label: "Lua Reference", Description: "External Lua reference manual.", ExternalURLTemplate: "https://www.lua.org/manual/5.4/"},
	}
}

func ignoredCodeHelperVariables() map[string]bool {
	return map[string]bool{
		"PAYLOAD_DATA":           true,
		"FORM_{NAME}":            true,
		"URL_PARAM_{NAME}":       true,
		"HEADER_{HEADER_NAME}":   true,
		"CRED_{CREDENTIAL_NAME}": true,
		"FAILURE_EXIT_CODE":      true,
		"FAILURE_OUTPUT":         true,
		"FAILURE_ERROR":          true,
		"WEBHOOK_ID":             true,
		"WEBHOOK_PATH":           true,
		"TASK_ID":                true,
	}
}

func buildCodeHelperVariableItem(variable string) codeHelperItemSpec {
	contexts := []string{"all"}
	if strings.HasPrefix(variable, "FORM_") || strings.HasPrefix(variable, "URL_PARAM_") || strings.HasPrefix(variable, "HEADER_") {
		contexts = []string{utils.WebhookEntity}
	}

	summary := "Custom environment variable available to this script."
	if strings.HasPrefix(variable, "CRED_") {
		summary = "Credential value injected into the script environment."
	}

	return codeHelperItemSpec{
		ID:        fmt.Sprintf("env-%s", strings.ToLower(strings.ReplaceAll(variable, "_", "-"))),
		Title:     variable,
		Kind:      "env_var",
		Contexts:  contexts,
		Languages: []string{"bash", "lua"},
		Keywords:  []string{"env", "custom", strings.ToLower(variable)},
		Summary:   summary,
		Content:   "RapidForge will inject this variable when the script executes.",
		Snippets: helperSnippets(
			"bash", fmt.Sprintf(`echo "$%s"`, variable),
			"lua", fmt.Sprintf(`local value = os.getenv("%s")`, variable),
		),
	}
}

func buildCodeHelperData(context string, variables []string) map[string]any {
	items := make([]map[string]any, 0, len(defaultCodeHelperItems())+len(variables))
	for _, item := range defaultCodeHelperItems() {
		items = append(items, item.toMap())
	}

	ignoredVars := ignoredCodeHelperVariables()
	for _, variable := range variables {
		if ignoredVars[variable] {
			continue
		}
		items = append(items, buildCodeHelperVariableItem(variable).toMap())
	}

	sections := make([]map[string]any, 0, len(defaultCodeHelperSections()))
	for _, section := range defaultCodeHelperSections() {
		sections = append(sections, section.toMap())
	}

	sources := make([]map[string]any, 0, len(defaultCodeHelperSources()))
	for _, source := range defaultCodeHelperSources() {
		sources = append(sources, source.toMap())
	}

	return map[string]any{
		"context":  context,
		"sections": sections,
		"items":    items,
		"sources":  sources,
	}
}
