package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"shortly/internal/config"
	"shortly/internal/db"
	"shortly/internal/handler"
	"shortly/internal/middleware"
	"shortly/internal/repository"
	"shortly/internal/repository/postgres"
	"shortly/internal/repository/sqlite"
	"shortly/internal/service"
)

func main() {
	cfg := config.Load()

	conn, err := db.New(cfg.DBDriver, cfg.DBDSN)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer conn.Close()

	var linkRepo repository.LinkRepository
	switch cfg.DBDriver {
	case "postgres":
		linkRepo = postgres.NewLinkRepository(conn)
	case "sqlite":
		linkRepo = sqlite.NewLinkRepository(conn)
	default:
		log.Fatalf("unsupported DB_DRIVER: %s", cfg.DBDriver)
	}

	linkService := service.NewLinkService(linkRepo, cfg.BaseHost)

	linkHandler := handler.NewLinkHandler(linkService, cfg.BaseURL)
	redirectHandler := handler.NewRedirectHandler(linkService)
	statsHandler := handler.NewStatsHandler(linkService)

	r := gin.Default()

	api := r.Group("/api")
	api.Use(middleware.RateLimit(cfg.RateLimitRPS, cfg.RateLimitBurst))
	{
		api.POST("/links", linkHandler.Create)
		api.GET("/links", linkHandler.List)
		api.GET("/links/:id", linkHandler.Get)
		api.DELETE("/links/:id", linkHandler.Delete)
		api.GET("/stats", statsHandler.GetStats)
	}

	r.GET("/:code", middleware.RateLimit(20, 40), redirectHandler.Redirect)

	log.Printf("server running on port %s (db driver: %s)", cfg.Port, cfg.DBDriver)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
