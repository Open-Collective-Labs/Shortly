package main

import (
	"log"

	"shortly/backend/config"
	"shortly/backend/database"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	db := database.Connect(cfg.DBDriver, cfg.DBDSN)
	_ = db

	r := gin.Default()

	log.Printf("Server starting on :%s", cfg.Port)
	r.Run(":" + cfg.Port)
}
