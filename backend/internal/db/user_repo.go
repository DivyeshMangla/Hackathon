package db

import (
	"context"
	"github.com/divyeshmangla/hackathon/internal/models"
)

func CreateUser(ctx context.Context, u *models.User) error {
	query := `
        INSERT INTO users (id, email, password, created_at)
        VALUES ($1, $2, $3, $4)
    `
	_, err := DB.ExecContext(ctx, query, u.ID, u.Email, u.Password, u.CreatedAt)
	return err
}

func GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	u := models.User{}
	query := `SELECT id, email, password, created_at FROM users WHERE email = $1`
	err := DB.QueryRowContext(ctx, query, email).Scan(
		&u.ID, &u.Email, &u.Password, &u.CreatedAt,
	)
	return &u, err
}

func GetUserByID(ctx context.Context, id string) (*models.User, error) {
	u := models.User{}
	query := `SELECT id, email, password, created_at FROM users WHERE id = $1`
	err := DB.QueryRowContext(ctx, query, id).Scan(
		&u.ID, &u.Email, &u.Password, &u.CreatedAt,
	)
	return &u, err
}
