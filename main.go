// main.go
package main

import (
	"context"
	"crypto/tls"
	"embed"
	"flag"
	"fmt"
	"net/http"
	"os"
	"runtime"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator"
	"github.com/honeybadger-io/honeybadger-go"
	"github.com/rapidforge-io/rapidforge/config"
	"github.com/rapidforge-io/rapidforge/database"
	"github.com/rapidforge-io/rapidforge/kv"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/models"
	"github.com/rapidforge-io/rapidforge/observability"
	"github.com/rapidforge-io/rapidforge/services"
	"github.com/rapidforge-io/rapidforge/utils"
)

//go:embed views/*.html
var viewsFS embed.FS

//go:embed static/*
var staticFS embed.FS

var (
	Version = "0.12.1"
	Package = "community"
)

// Runner defines the interface for script execution

func main() {
	fmt.Println("Debug: Command arguments:", os.Args)
	if len(os.Args) > 1 {
		handleCLI()
	} else {
		runServer()
	}
}

func handleCLI() {
	// Define subcommands
	setCmd := flag.NewFlagSet("set", flag.ExitOnError)
	getCmd := flag.NewFlagSet("get", flag.ExitOnError)
	delCmd := flag.NewFlagSet("del", flag.ExitOnError)
	listCmd := flag.NewFlagSet("list", flag.ExitOnError)
	sqlCmd := flag.NewFlagSet("sql", flag.ExitOnError)
	updateCmd := flag.NewFlagSet("update", flag.ExitOnError)

	setCmd.Usage = func() {
		fmt.Println(`
        Usage:
            ./rapidforge set --key <key> --value <value>

        Description:
            Sets the value for a given key.
        `)
	}

	getCmd.Usage = func() {
		fmt.Println(`
        Usage:
            ./rapidforge get -key <key>

        Description:
            Gets the value of a given key.
        `)
	}

	listCmd.Usage = func() {
		fmt.Println(`
        Usage:
            ./rapidforge list

        Description:
            Lists all keys in the store.
        `)
	}

	sqlCmd.Usage = func() {
		fmt.Println(`
      Usage:
        ./rapidforge sql <SQL query>

      Description:
          Executes a custom SQL query against the kv database.
      `)
	}

	delCmd.Usage = func() {
		fmt.Println(`
        Usage:
           ./rapidforge del --key <key>

        Description:
            Deletes a given key.
        `)
	}

	// Add usage info for update command
	updateCmd.Usage = func() {
		fmt.Println(`
        Usage:
            ./rapidforge update [--force]

        Description:
            Updates RapidForge to the latest version.
            --force: Force update even if already on latest version.
        `)
	}

	if len(os.Args) < 2 {
		fmt.Println("Expected 'set', 'get', 'del', or 'list' subcommands --help for list of all commands")
		os.Exit(1)
	}

	switch os.Args[1] {
	case "set":
		key := setCmd.String("key", "", "Key to set")
		value := setCmd.String("value", "", "Value to set")
		setCmd.Parse(os.Args[2:])
		if *key == "" || *value == "" {
			setCmd.PrintDefaults()
			os.Exit(1)
		}
		kv.Set(*key, *value)
	case "get":
		key := getCmd.String("key", "", "Key to get")
		getCmd.Parse(os.Args[2:])
		if *key == "" {
			getCmd.PrintDefaults()
			os.Exit(1)
		}
		kv.Get(*key)
	case "del":
		key := delCmd.String("key", "", "Key to delete")
		delCmd.Parse(os.Args[2:])
		if *key == "" {
			delCmd.PrintDefaults()
			os.Exit(1)
		}
		kv.Del(*key)
	case "list":
		kv.List()
	case "sql":
		sqlStmt := sqlCmd.String("query", "", "SQL query to execute")
		sqlCmd.Parse(os.Args[2:])
		if *sqlStmt == "" {
			sqlCmd.PrintDefaults()
			os.Exit(1)
		}
		kv.ExecuteSQL(*sqlStmt)
	case "update":
		force := updateCmd.Bool("force", false, "Force update even if on latest version")
		updateCmd.Parse(os.Args[2:])
		updateSelf(*force)
	case "help":
		displayHelp()
	default:
		displayHelp()
		// fmt.Println("Expected 'set', 'get', 'del', 'list', or 'sql' subcommands")
		os.Exit(1)
	}
}

func displayHelp() {
	helpText := `
Usage:
    ./rapidforge this will run server by default
    ./rapidforge <command> [options]

Available Commands:
    set     Set a key-value pair.
    get     Get the value of a key.
    del     Delete a key.
    list    List all keys.
    sql     Execute a custom SQL query.
    update  Update RapidForge to the latest version.
    help    Show this help message.

Use "rapidforge <command> -h" for more information about a command.
`
	fmt.Println(helpText)
}

func runServer() {
	if config.Get().Cloud {
		apiKey := os.Getenv("RF_HONEYBADGER_API_KEY")
		if apiKey != "" {
			honeybadger.Configure(honeybadger.Configuration{APIKey: apiKey})
			defer honeybadger.Monitor()
		}
	}

	dbCon := database.GetDbConn("")
	dbCon.RunMigrations()
	database.SetupKV()
	store := models.NewModel(dbCon)
	authSecret, _ := store.GetConfigByKey("authSecretKey")

	if len(authSecret) == 0 {
		authSecret = config.Get().AuthSecretKey
		store.InsertSetting("authSecretKey", authSecret)
	} else {
		config.SetAuthSecretKey(authSecret)
	}

	adminUser, err := store.CreateAdminUserIfNoUserExists()
	if err != nil {
		rflog.Error("failed to create admin user", err)
		os.Exit(1)
	}

	bannerData := map[string]any{
		"Version":       Version,
		"Package":       Package,
		"ARCH":          runtime.GOARCH,
		"Compiler":      runtime.Compiler,
		"Environment":   config.Get().Env,
		"Port":          config.Get().Port,
		"Domain":        config.Get().Domain,
		"AdminUserName": "******",
		"AdminPassword": "******",
	}

	if adminUser != nil {
		bannerData["AdminUserName"] = adminUser.Username
		bannerData["AdminPassword"] = adminUser.PasswordHash
	}

	utils.PrintBanner(viewsFS, bannerData)

	otelCfg, err := observability.LoadConfigFromEnv(context.Background(), Version)
	if err != nil {
		rflog.Error("failed to load OTEL config", err)
		os.Exit(1)
	}
	shutdownOTEL, err := observability.InitOTEL(context.Background(), otelCfg)
	if err != nil {
		rflog.Error("failed to initialize OpenTelemetry", err)
		os.Exit(1)
	}
	defer func() {
		if err := shutdownOTEL(context.Background()); err != nil {
			rflog.Error("failed to shutdown OpenTelemetry", err)
		}
	}()

	if config.Get().Env == "development" {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("cron", utils.IsCronValid)
	}

	r.HTMLRender = createMyRender(viewsFS)

	services.SetupService(store)
	setupRoutes(r, store, staticFS)
	go startTokenRefreshJob(store)
	go startEventCleanupJob(store)

	if config.Get().PemData != "" {

		tslCert := config.Get().TLSCert()

		if tslCert == nil {
			rflog.Error("Failed to load TLS certificate", "err:", err)
			os.Exit(1)
		}

		tlsConfig := &tls.Config{
			Certificates: []tls.Certificate{*tslCert},
		}
		server := &http.Server{
			Addr:      config.Get().Port,
			Handler:   r,
			TLSConfig: tlsConfig,
		}
		server.ListenAndServeTLS("", "")

	} else {
		err = r.Run(config.Get().Port)
	}

	if err != nil {
		rflog.Error("Failed to start server", "err:", err)
		os.Exit(1)
	}

	err = store.UnlockStalePeriodicTasks()
	if err != nil {
		rflog.Error("Failed to unlock stale periodic tasks at startup", err)
	}
}

func startEventCleanupJob(store *models.Store) {
	const timeC = 12 * time.Hour
	for range time.Tick(timeC) {
		_, err := store.RemoveEventsOlderThanAWeek()
		if err != nil {
			rflog.Error("Failed to remove events older than a week", "err:", err)
		}
	}
}

func startTokenRefreshJob(store *models.Store) {
	for range time.Tick(1 * time.Hour) {
		err := store.RefreshTokens()
		if err != nil {
			rflog.Error("Failed to refresh tokens", "err:", err)
		}
	}
}
