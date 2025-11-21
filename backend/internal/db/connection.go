package db

import (
	"database/sql"
	"log"

	"github.com/divyeshmangla/hackathon/internal/config"
	_ "github.com/jackc/pgx/v5/stdlib"
)

var DB *sql.DB

func Connect() {
	d, err := sql.Open("pgx", config.C.DatabaseURL)
	if err != nil {
		log.Fatalf("[db] failed to connect: %v", err)
	}

	if err := d.Ping(); err != nil {
		log.Fatalf("[db] database ping failed: %v", err)
	}

	DB = d
	log.Println("[db] connected")
}
