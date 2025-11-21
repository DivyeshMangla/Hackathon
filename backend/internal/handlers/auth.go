package handlers

import (
	"database/sql"
	"errors"
	"time"

	"github.com/divyeshmangla/hackathon/internal/db"
	"github.com/divyeshmangla/hackathon/internal/encrypt"
	"github.com/divyeshmangla/hackathon/internal/models"
	"github.com/divyeshmangla/hackathon/internal/token"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type SignupRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Token string       `json:"token"`
	User  *models.User `json:"user"`
}

func Signup(c *fiber.Ctx) error {
	var req SignupRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	if req.Email == "" || req.Password == "" {
		return fiber.NewError(fiber.StatusBadRequest, "email and password are required")
	}

	// Check if user already exists
	_, err := db.GetUserByEmail(c.Context(), req.Email)
	if err == nil {
		return fiber.NewError(fiber.StatusConflict, "user already exists")
	}

	if !errors.Is(err, sql.ErrNoRows) {
		return fiber.NewError(fiber.StatusInternalServerError, "database error")
	}

	// Hash password
	hashedPassword, err := encrypt.Hash(req.Password)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to hash password")
	}

	// Create user
	user := &models.User{
		ID:        uuid.New(),
		Email:     req.Email,
		Password:  hashedPassword,
		CreatedAt: time.Now(),
	}

	if err := db.CreateUser(c.Context(), user); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to create user")
	}

	// Generate token
	tokenStr, err := token.Generate(user.ID.String())
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to generate token")
	}

	// Clear password before returning
	user.Password = ""

	return c.Status(fiber.StatusCreated).JSON(AuthResponse{
		Token: tokenStr,
		User:  user,
	})
}

func Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	if req.Email == "" || req.Password == "" {
		return fiber.NewError(fiber.StatusBadRequest, "email and password are required")
	}

	// Get user by email
	user, err := db.GetUserByEmail(c.Context(), req.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(fiber.StatusUnauthorized, "invalid credentials")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "database error")
	}

	// Check password
	if err := encrypt.Check(user.Password, req.Password); err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid credentials")
	}

	// Generate token
	tokenStr, err := token.Generate(user.ID.String())
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to generate token")
	}

	// Clear password before returning
	user.Password = ""

	return c.JSON(AuthResponse{
		Token: tokenStr,
		User:  user,
	})
}

func Me(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)

	user, err := db.GetUserByID(c.Context(), userID)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(fiber.StatusNotFound, "user not found")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "database error")
	}

	// Clear password before returning
	user.Password = ""

	return c.JSON(user)
}
