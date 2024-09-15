package utils

import (
	"bytes"
	"crypto/rand"
	"database/sql"
	"embed"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/adhocore/gronx"
	"github.com/go-playground/validator"
)

// Define a custom type for restricted strings
type AlertType string

// Define constants for allowed values
const (
	Info    AlertType = "primary"
	Success AlertType = "success"
	Error   AlertType = "danger"
	Warning AlertType = "warning"
)

const (
	BlockEntity        string = "blocks"
	WebhookEntity      string = "webhooks"
	PageEntity         string = "pages"
	PeriodicTaskEntity string = "periodic_tasks"
)

func FormatDateTime(datetime time.Time) string {
	return datetime.Format(time.RFC822)
}

func GenerateHTML(tmpl string, data any) (string, error) {
	funcMap := template.FuncMap{
		"defaultString": DefaultHtml,
	}

	t, err := template.New("template").Funcs(funcMap).Parse(tmpl)
	if err != nil {
		return "", err
	}

	var result string
	writer := &strings.Builder{}
	err = t.Execute(writer, data)
	if err != nil {
		return "", err
	}
	result = writer.String()

	return result, nil
}

func PrintBanner(viewsFS embed.FS, data any) {
	t, err := template.New("banner.html").ParseFS(viewsFS, "views/banner.html")
	if err != nil {
		return
	}

	var result string
	writer := &strings.Builder{}
	err = t.Execute(writer, data)
	if err != nil {
		return
	}
	result = writer.String()
	fmt.Println(result)
}

func AlertBox(messageType AlertType, message string) string {
	alertTemplate := `
	    <div class="m-2">
        <sl-alert variant={{.messageType}} open closable duration="2000">
        	{{.message}}
        </sl-alert>
		</div>`
	t, _ := template.New("alertBox").Parse(alertTemplate)

	data := map[string]any{
		"messageType": messageType,
		"message":     message,
	}

	var out bytes.Buffer

	t.Execute(&out, data)

	return out.String()
}

func IsCronValid(fl validator.FieldLevel) bool {
	cron := fl.Field().String()
	return gronx.New().IsValid(cron)
}

func ToastHeader(message string) (string, string) {
	t := map[string]any{"toastEvent": map[string]string{"message": message}}

	jsonMessage, _ := json.Marshal(t)

	return "HX-Trigger", string(jsonMessage)
}

// defaultString returns the default string if the input is empty.
func DefaultHtml(input any, defaultValue string) template.HTML {
	switch v := input.(type) {
	case string:
		if v == "" {
			return template.HTML(defaultValue)
		} else {
			return template.HTML(v)
		}
	case sql.NullString:
		if v.Valid && v.String != "" {
			return template.HTML(v.String)
		} else {
			return template.HTML(defaultValue)
		}
	default:
		return template.HTML(defaultValue)
	}
}

func DefaultString(input any, defaultValue string) string {
	switch v := input.(type) {
	case string:
		if v == "" {
			return defaultValue
		} else {
			return v
		}
	case sql.NullString:
		if v.Valid && v.String != "" {
			return v.String
		} else {
			return defaultValue
		}
	default:
		return defaultValue
	}
}

func ParseInt64(s string) int64 {
	i, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return 0
	}
	return i
}

func ParseInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return i
}

func ToMap(data any) map[string]any {
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

func GetFieldValue(input any, fieldName string) (any, error) {
	val := reflect.ValueOf(input)

	if val.Kind() != reflect.Struct {
		return nil, fmt.Errorf("input is not a struct")
	}

	// Get the field by name
	field := val.FieldByName(fieldName)

	if !field.IsValid() {
		return nil, fmt.Errorf("field '%s' not found in struct", fieldName)
	}

	return field.String(), nil
}

// transformToMaps is the generic function to transform any slice to []map[string]any
func TransformToMaps[T any](items []T, typeName string) []map[string]any {
	var mapBlocks []map[string]any

	for _, item := range items {
		mapBlock := ToMap(item)
		mapBlock["Badges"] = []string{}
		mapBlock["Type"] = typeName

		if typeName == WebhookEntity {
			httpMethod, err := GetFieldValue(item, "HttpMethod")
			if err != nil {
				// for circler dependency we can't use rflog
				log.Fatalln("failed to get http method", err)
			} else {
				mapBlock["Badges"] = []string{"Hook", httpMethod.(string)}
			}
		} else if typeName == PageEntity {
			mapBlock["Badges"] = []string{"Page"}
		} else if typeName == PeriodicTaskEntity {
			mapBlock["Badges"] = []string{"Periodic Task"}
		}
		mapBlocks = append(mapBlocks, mapBlock)
	}

	return mapBlocks
}

// GenerateRandomString creates a random string of a specified length
func GenerateRandomString(length int) (string, error) {
	randomBytes := make([]byte, length)

	if _, err := rand.Read(randomBytes); err != nil {
		return "", err
	}

	return hex.EncodeToString(randomBytes), nil
}

// Add this to merge maps
// func (s *Settings) Merge(other *Settings) error {
// 	s.mux.Lock()
// 	defer s.mux.Unlock()

// 	bytes, err := json.Marshal(other)
// 	if err != nil {
// 		return err
// 	}

// 	return json.Unmarshal(bytes, s)
// }

// MergeMaps merges two maps. Values from map2 will overwrite values from map1 if keys are the same.
func MergeMaps[K comparable, V any](map1, map2 map[K]V) map[K]V {

	mergedMap := make(map[K]V)

	for key, value := range map1 {
		mergedMap[key] = value
	}

	for key, value := range map2 {
		mergedMap[key] = value
	}

	return mergedMap
}
