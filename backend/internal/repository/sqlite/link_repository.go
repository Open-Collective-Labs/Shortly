package sqlite

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"shortly/internal/model"
)

type LinkRepository struct {
	db *sql.DB
}

func NewLinkRepository(db *sql.DB) *LinkRepository {
	return &LinkRepository{db: db}
}

func (r *LinkRepository) Create(ctx context.Context, link *model.Link) error {
	query := `INSERT INTO links (code, original_url, created_at, expires_at)
	          VALUES (?, ?, ?, ?)`
	res, err := r.db.ExecContext(ctx, query, link.Code, link.OriginalURL, link.CreatedAt, link.ExpiresAt)
	if err != nil {
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	link.ID = id
	return nil
}

func (r *LinkRepository) GetByCode(ctx context.Context, code string) (*model.Link, error) {
	query := `SELECT id, code, original_url, clicks, created_at, last_clicked_at, expires_at
	          FROM links WHERE code = ?`
	return r.scanOne(r.db.QueryRowContext(ctx, query, code))
}

func (r *LinkRepository) GetByID(ctx context.Context, id int64) (*model.Link, error) {
	query := `SELECT id, code, original_url, clicks, created_at, last_clicked_at, expires_at
	          FROM links WHERE id = ?`
	return r.scanOne(r.db.QueryRowContext(ctx, query, id))
}

func (r *LinkRepository) List(ctx context.Context, limit, offset int) ([]model.Link, error) {
	query := `SELECT id, code, original_url, clicks, created_at, last_clicked_at, expires_at
	          FROM links ORDER BY created_at DESC LIMIT ? OFFSET ?`
	rows, err := r.db.QueryContext(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var links []model.Link
	for rows.Next() {
		var l model.Link
		if err := rows.Scan(&l.ID, &l.Code, &l.OriginalURL, &l.Clicks, &l.CreatedAt, &l.LastClickedAt, &l.ExpiresAt); err != nil {
			return nil, err
		}
		links = append(links, l)
	}
	return links, rows.Err()
}

func (r *LinkRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM links WHERE id = ?`, id)
	return err
}

func (r *LinkRepository) IncrementClicks(ctx context.Context, code string) error {
	query := `UPDATE links SET clicks = clicks + 1, last_clicked_at = ? WHERE code = ?`
	_, err := r.db.ExecContext(ctx, query, time.Now(), code)
	return err
}

func (r *LinkRepository) GetStats(ctx context.Context) (*model.Stats, error) {
	query := `SELECT COUNT(*), COALESCE(SUM(clicks), 0) FROM links`
	var stats model.Stats
	row := r.db.QueryRowContext(ctx, query)
	if err := row.Scan(&stats.TotalLinks, &stats.TotalClicks); err != nil {
		return nil, err
	}
	if stats.TotalLinks > 0 {
		stats.AverageClicks = float64(stats.TotalClicks) / float64(stats.TotalLinks)
	}
	return &stats, nil
}

func (r *LinkRepository) CodeExists(ctx context.Context, code string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM links WHERE code = ?)`
	err := r.db.QueryRowContext(ctx, query, code).Scan(&exists)
	return exists, err
}

func (r *LinkRepository) scanOne(row *sql.Row) (*model.Link, error) {
	var l model.Link
	err := row.Scan(&l.ID, &l.Code, &l.OriginalURL, &l.Clicks, &l.CreatedAt, &l.LastClickedAt, &l.ExpiresAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &l, nil
}
