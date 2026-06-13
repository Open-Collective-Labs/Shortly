package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"shortly/internal/service"
)

type LinkHandler struct {
	service *service.LinkService
	baseURL string
}

func NewLinkHandler(s *service.LinkService, baseURL string) *LinkHandler {
	return &LinkHandler{service: s, baseURL: baseURL}
}

type createLinkRequest struct {
	URL       string  `json:"url" binding:"required"`
	ExpiresAt *string `json:"expires_at,omitempty"`
}

func (h *LinkHandler) Create(c *gin.Context) {
	var req createLinkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	link, err := h.service.CreateLink(c.Request.Context(), service.CreateLinkInput{
		OriginalURL: req.URL,
	})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":           link.ID,
		"code":         link.Code,
		"short_url":    h.baseURL + "/" + link.Code,
		"original_url": link.OriginalURL,
		"created_at":   link.CreatedAt,
	})
}

func (h *LinkHandler) List(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	links, err := h.service.ListLinks(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list links"})
		return
	}
	c.JSON(http.StatusOK, links)
}

func (h *LinkHandler) Get(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	link, err := h.service.GetLink(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "link not found"})
		return
	}
	c.JSON(http.StatusOK, link)
}

func (h *LinkHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.service.DeleteLink(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete link"})
		return
	}
	c.Status(http.StatusNoContent)
}
