package config

import "os"

type Config struct {
	Port     string
	DBDriver string
	DBDSN    string
	BaseURL  string
}

func Load() Config {
	return Config{
		Port:     getEnv("PORT", "8080"),
		DBDriver: getEnv("DB_DRIVER", "sqlite"),
		DBDSN:    getEnv("DB_DSN", "shortly.db"),
		BaseURL:  getEnv("BASE_URL", "http://localhost:8080"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
