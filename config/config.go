package config

import (
	"context"
	"log"
	"time"

	"github.com/sethvargo/go-envconfig"
)

type Config struct {
	Env           string `env:"RF_ENV,default=development"`
	AdminUsername string `env:"RF_ADMIN_USERNAME, default=admin"`
	AdminPassword string `env:"RF_ADMIN_PASSWORD, default=1234"`
	DatabaseUrl   string `env:"RF_DATABASE_URL, default=rapidforge.sqlite3"`
	Domain        string `env:"RF_DOMAIN, default=localhost"`
	Port          string `env:"RF_PORT, default=4000"`
	Timeout       time.Duration
}

var c Config

func load() {
	ctx := context.Background()
	if err := envconfig.Process(ctx, &c); err != nil {
		log.Fatal(err)
	}
	c.Timeout = 30 * time.Second
}

func init() {
	load()
}

func SetEnv(envName string) {
	c.Env = envName
}

func Get() Config {
	return c
}

func BaseUrl() string {
	return "http://" + c.Domain + ":" + c.Port
}
