package repository

import (
	"context"

	"shortly/internal/model"
)

type LinkRepository interface {
	Create(ctx context.Context, link *model.Link) error
	GetByCode(ctx context.Context, code string) (*model.Link, error)
	GetByID(ctx context.Context, id int64) (*model.Link, error)
	List(ctx context.Context, limit, offset int) ([]model.Link, error)
	Delete(ctx context.Context, id int64) error
	IncrementClicks(ctx context.Context, code string) error
	GetStats(ctx context.Context) (*model.Stats, error)
	CodeExists(ctx context.Context, code string) (bool, error)
}
