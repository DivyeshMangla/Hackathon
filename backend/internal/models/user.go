package models

import "github.com/google/uuid"

type Users struct {
	ID       uuid.UUID
	Email    string
	Password string
}
