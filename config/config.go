package config

import (
	"context"
	"log"
	"time"

	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/utils"
	"github.com/sethvargo/go-envconfig"
)

type Config struct {
	Env               string `env:"RF_ENV,default=development"`
	AdminUsername     string `env:"RF_ADMIN_USERNAME, default=admin"`
	AdminPassword     string `env:"RF_ADMIN_PASSWORD, default=1234"`
	DatabaseUrl       string `env:"RF_DATABASE_URL, default=rapidforge.sqlite3"`
	Domain            string `env:"RF_DOMAIN, default=localhost"`
	Port              string `env:"RF_PORT, default=4000"`
	Timeout           time.Duration
	AuthSecretKey     string
	AuthDuration      time.Duration
	LoginAttemptCount int
}

var c Config

func load() {
	ctx := context.Background()
	if err := envconfig.Process(ctx, &c); err != nil {
		log.Fatal(err)
	}
	c.Timeout = 30 * time.Second
	secretKey, err := utils.GenerateRandomString(32)
	if err != nil {
		rflog.Error("failed to generate secret key", "err", err)
	}
	c.AuthSecretKey = secretKey

	c.AuthDuration = 1 * time.Hour
	c.LoginAttemptCount = 5
}

func init() {
	load()
}

func SetEnv(envName string) {
	c.Env = envName
}

func (c Config) AuthKey() string {
	return c.AuthSecretKey[0:10]
}

func (c Config) JWTSecretKey() []byte {
	return []byte(c.AuthSecretKey)
}

func SetAuthSecretKey(key string) {
	c.AuthSecretKey = key
}

func Get() Config {
	return c
}

func BaseUrl() string {
	return "http://" + c.Domain + ":" + c.Port
}
