package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	JWTSecret   string
	DatabaseURL string
	Port        string
}

var C Config // global config (read-only after Load)

func Load() {
	if err := godotenv.Load(); err != nil {
		log.Println("[config] .env file not found, relying on environment variables")
	}

	C = Config{
		JWTSecret:   getEnv("JWT_SECRET"),
		DatabaseURL: getEnv("DATABASE_URL"),
		Port:        getEnvOrDefault("PORT", "8080"),
	}

	log.Println("[config] configuration loaded successfully")
}

func getEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Fatalf("[config] missing required environment variable: %s", key)
	}
	return value
}

func getEnvOrDefault(key, def string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Printf("[config] %s not set, using default: %s", key, def)
		return def
	}
	return value
}
