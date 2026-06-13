package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"shortly/internal/service"
)

type RedirectHandler struct {
	service *service.LinkService
}

func NewRedirectHandler(s *service.LinkService) *RedirectHandler {
	return &RedirectHandler{service: s}
}

func (h *RedirectHandler) Redirect(c *gin.Context) {
	code := c.Param("code")

	link, err := h.service.ResolveCode(c.Request.Context(), code)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "link not found"})
		case errors.Is(err, service.ErrLinkExpired):
			c.JSON(http.StatusGone, gin.H{"error": "link has expired"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong"})
		}
		return
	}

	c.Redirect(http.StatusFound, link.OriginalURL)
}
