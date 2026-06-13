package config

import (
	"net/url"
	"os"
)

type Config struct {
	Port           string
	DBDriver       string
	DBDSN          string
	BaseURL        string
	BaseHost       string
	RateLimitRPS   float64
	RateLimitBurst int
}

func Load() Config {
	baseURL := getEnv("BASE_URL", "http://localhost:8080")

	return Config{
		Port:           getEnv("PORT", "8080"),
		DBDriver:       getEnv("DB_DRIVER", "sqlite"),
		DBDSN:          getEnv("DB_DSN", "shortly.db"),
		BaseURL:        baseURL,
		BaseHost:       extractHost(baseURL),
		RateLimitRPS:   2,
		RateLimitBurst: 10,
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func extractHost(rawURL string) string {
	u, err := url.Parse(rawURL)
	if err != nil {
		return ""
	}
	return u.Host
}
