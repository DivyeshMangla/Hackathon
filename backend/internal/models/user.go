package models

import (
	"github.com/google/uuid"
	"time"
)

type User struct {
	ID        uuid.UUID `json:"id" db:"id"`
	Email     string    `json:"email" db:"email"`
	Password  string    `json:"-" db:"password"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type UserProfile struct {
	ID          uuid.UUID `json:"id"`
	RollNumber  string    `db:"roll_number"`
	Phone       string    `db:"phone"`
	CollegeName string    `db:"college_name"`
	CollegeYear int       `db:"college_year"`
	Branch      string    `db:"branch"`
}

type Team struct {
	ID        uuid.UUID `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type TeamMember struct {
	TeamID   uuid.UUID `json:"team_id" db:"team_id"`
	UserID   uuid.UUID `json:"user_id" db:"user_id"`
	IsLeader bool      `json:"is_leader" db:"is_leader"`
	JoinedAt time.Time `json:"joined_at" db:"joined_at"`
}
