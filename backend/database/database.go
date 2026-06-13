package database

import (
	"fmt"
	"log"

	"shortly/backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Connect(driver, dsn string) *gorm.DB {
	var dial gorm.Dialector

	switch driver {
	case "postgres":
		dial = postgres.Open(dsn)
	default:
		dial = sqlite.Open(dsn)
	}

	db, err := gorm.Open(dial, &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to %s: %v", driver, err)
	}

	if err := db.AutoMigrate(&models.Link{}); err != nil {
		log.Fatalf("Failed to migrate: %v", err)
	}

	fmt.Printf("Connected to %s database\n", driver)
	return db
}
