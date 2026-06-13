package models

import "time"

type Link struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Code      string    `gorm:"uniqueIndex;size:16" json:"code"`
	URL       string    `gorm:"size:2048;not null" json:"url"`
	Clicks    uint      `gorm:"default:0" json:"clicks"`
	ExpiresAt *time.Time `json:"expires_at,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}
