package config

import (
	"context"
	"crypto/tls"
	"encoding/pem"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/rapidforge-io/rapidforge/utils"
	"github.com/sethvargo/go-envconfig"
)

type Config struct {
	Env               string `env:"RF_ENV,default=production"`
	DatabaseUrl       string `env:"RF_DATABASE_URL, default=rapidforge.sqlite3"`
	KVUrl             string `env:"RF_KV_URL, default=rapidforgekv.sqlite3"`
	ErrorReport       string `env:"RF_ERROR_REPORT"`
	Domain            string `env:"RF_DOMAIN, default=localhost"`
	Port              string `env:"RF_PORT, default=:4000"`
	PemData           string `env:"TLS_CERT"`
	Cloud             bool
	TokenExpiry       time.Duration
	LoadBalancer      bool
	FECacheBuster     string
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
		log.Fatal("failed to generate secret key", "err", err)
	}
	c.AuthSecretKey = secretKey
	c.LoadBalancer = getEnvAsBool("RF_LB", true)
	c.Cloud = getEnvAsBool("RF_CLOUD", false)
	c.TokenExpiry = time.Hour * 24
	c.FECacheBuster, _ = utils.GenerateRandomString(10)

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

func CredentialCallbackUrl() string {
	return BaseUrl() + "/credentials/callback"
}

func (c Config) TLSCert() *tls.Certificate {
	if c.PemData == "" {
		return nil
	}

	// Parse the PEM data
	certBlock, rest := pem.Decode([]byte(c.PemData))
	if certBlock == nil || certBlock.Type != "CERTIFICATE" {
		log.Fatalf("Failed to decode PEM block containing the certificate")
	}

	keyBlock, _ := pem.Decode(rest)
	if keyBlock == nil || keyBlock.Type != "PRIVATE KEY" {
		log.Fatalf("Failed to decode PEM block containing the private key")
	}

	cert, err := tls.X509KeyPair(pem.EncodeToMemory(certBlock), pem.EncodeToMemory(keyBlock))
	if err != nil {
		log.Fatalf("Failed to create TLS certificate: %v", err)
	}

	return &cert
}

func getEnvAsBool(name string, defaultVal bool) bool {
	valStr := os.Getenv(name)
	if valStr == "" {
		return defaultVal
	}
	val, err := strconv.ParseBool(valStr)
	if err != nil {
		return defaultVal
	}
	return val
}

func httpProtocol() string {
	if c.Env == "development" || c.Domain == "localhost" {
		return "http://"
	}
	return "https://"
}

func BaseUrl() string {
	if c.Port == ":80" || c.Port == ":443" || (c.Domain != "localhost" && c.LoadBalancer) {
		return httpProtocol() + c.Domain
	} else {

		return httpProtocol() + c.Domain + c.Port
	}
}
