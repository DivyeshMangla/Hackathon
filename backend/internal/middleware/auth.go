package middleware

import (
	"strings"

	"github.com/divyeshmangla/hackathon/internal/token"
	"github.com/gofiber/fiber/v2"
)

func Auth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")

		// Expect "Bearer <token>"
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return fiber.NewError(fiber.StatusUnauthorized, "missing or invalid Authorization header")
		}

		// Extract the actual token
		jwtStr := strings.TrimPrefix(authHeader, "Bearer ")

		// Verify token
		userID, err := token.Verify(jwtStr)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, "invalid or expired token")
		}

		// Attach user ID to request context
		c.Locals("user_id", userID)

		return c.Next()
	}
}
