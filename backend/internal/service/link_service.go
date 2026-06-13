package service

import (
	"context"
	"errors"
	"net/url"
	"time"

	"shortly/internal/model"
	"shortly/internal/repository"
)

var (
	ErrInvalidURL  = errors.New("invalid url")
	ErrLinkExpired = errors.New("link has expired")
	ErrNotFound    = errors.New("link not found")
)

type LinkService struct {
	repo repository.LinkRepository
}

func NewLinkService(repo repository.LinkRepository) *LinkService {
	return &LinkService{repo: repo}
}

type CreateLinkInput struct {
	OriginalURL string
	ExpiresAt   *time.Time
}

func (s *LinkService) CreateLink(ctx context.Context, input CreateLinkInput) (*model.Link, error) {
	parsed, err := url.ParseRequestURI(input.OriginalURL)
	if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") {
		return nil, ErrInvalidURL
	}

	code, err := s.generateUniqueCode(ctx)
	if err != nil {
		return nil, err
	}

	link := &model.Link{
		Code:        code,
		OriginalURL: input.OriginalURL,
		CreatedAt:   time.Now(),
		ExpiresAt:   input.ExpiresAt,
	}

	if err := s.repo.Create(ctx, link); err != nil {
		return nil, err
	}
	return link, nil
}

func (s *LinkService) generateUniqueCode(ctx context.Context) (string, error) {
	for attempts := 0; attempts < 5; attempts++ {
		code, err := GenerateCode(6)
		if err != nil {
			return "", err
		}
		exists, err := s.repo.CodeExists(ctx, code)
		if err != nil {
			return "", err
		}
		if !exists {
			return code, nil
		}
	}
	return "", errors.New("failed to generate unique code after 5 attempts")
}

func (s *LinkService) ResolveCode(ctx context.Context, code string) (*model.Link, error) {
	link, err := s.repo.GetByCode(ctx, code)
	if err != nil {
		return nil, err
	}
	if link == nil {
		return nil, ErrNotFound
	}
	if link.ExpiresAt != nil && link.ExpiresAt.Before(time.Now()) {
		return nil, ErrLinkExpired
	}
	if err := s.repo.IncrementClicks(ctx, code); err != nil {
		return nil, err
	}
	return link, nil
}

func (s *LinkService) ListLinks(ctx context.Context, limit, offset int) ([]model.Link, error) {
	return s.repo.List(ctx, limit, offset)
}

func (s *LinkService) GetLink(ctx context.Context, id int64) (*model.Link, error) {
	link, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if link == nil {
		return nil, ErrNotFound
	}
	return link, nil
}

func (s *LinkService) DeleteLink(ctx context.Context, id int64) error {
	return s.repo.Delete(ctx, id)
}

func (s *LinkService) GetStats(ctx context.Context) (*model.Stats, error) {
	return s.repo.GetStats(ctx)
}
