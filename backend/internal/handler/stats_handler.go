package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"shortly/internal/service"
)

type StatsHandler struct {
	service *service.LinkService
}

func NewStatsHandler(s *service.LinkService) *StatsHandler {
	return &StatsHandler{service: s}
}

func (h *StatsHandler) GetStats(c *gin.Context) {
	stats, err := h.service.GetStats(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch stats"})
		return
	}
	c.JSON(http.StatusOK, stats)
}
