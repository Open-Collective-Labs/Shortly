package model

import "time"

type Link struct {
	ID            int64      `json:"id"`
	Code          string     `json:"code"`
	OriginalURL   string     `json:"original_url"`
	Clicks        int64      `json:"clicks"`
	CreatedAt     time.Time  `json:"created_at"`
	LastClickedAt *time.Time `json:"last_clicked_at,omitempty"`
	ExpiresAt     *time.Time `json:"expires_at,omitempty"`
}

type Stats struct {
	TotalLinks    int64   `json:"total_links"`
	TotalClicks   int64   `json:"total_clicks"`
	AverageClicks float64 `json:"average_clicks"`
}
