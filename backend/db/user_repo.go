package db

import (
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"
	"interview-dojo-api/models"
)

// ErrNotFound is returned when a record doesn't exist.
var ErrNotFound = errors.New("not found")

type UserRepo struct {
	db *sqlx.DB
}

func NewUserRepo(db *sqlx.DB) *UserRepo {
	return &UserRepo{db: db}
}

// GetByEmail returns a user by email, or ErrNotFound.
func (r *UserRepo) GetByEmail(email string) (*models.User, error) {
	var u models.User
	err := r.db.Get(&u, `SELECT * FROM users WHERE email = $1`, email)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrNotFound
	}
	return &u, err
}

// GetByID returns a user by primary key.
func (r *UserRepo) GetByID(id string) (*models.User, error) {
	var u models.User
	err := r.db.Get(&u, `SELECT * FROM users WHERE id = $1`, id)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrNotFound
	}
	return &u, err
}

// CreateEmail inserts a new email/password user and returns the created row.
func (r *UserRepo) CreateEmail(email, name, passwordHash string) (*models.User, error) {
	var u models.User
	err := r.db.Get(&u, `
		INSERT INTO users (email, name, password_hash, provider)
		VALUES ($1, $2, $3, 'email')
		RETURNING *`,
		email, name, passwordHash,
	)
	return &u, err
}

// UpsertOAuth inserts or updates an OAuth user and returns the row.
// If a user with the same email already exists, we update their name and provider info.
func (r *UserRepo) UpsertOAuth(email, name, provider, providerID string) (*models.User, error) {
	var u models.User
	err := r.db.Get(&u, `
		INSERT INTO users (email, name, provider, provider_id)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (email) DO UPDATE
			SET name        = EXCLUDED.name,
			    provider    = EXCLUDED.provider,
			    provider_id = EXCLUDED.provider_id,
			    updated_at  = NOW()
		RETURNING *`,
		email, name, provider, providerID,
	)
	return &u, err
}
