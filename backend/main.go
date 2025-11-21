package main

import (
	"log"

	"github.com/divyeshmangla/hackathon/internal/config"
	"github.com/divyeshmangla/hackathon/internal/db"
	"github.com/divyeshmangla/hackathon/internal/handlers"
	"github.com/divyeshmangla/hackathon/internal/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// Load configuration
	config.Load()

	// Connect to database
	db.Connect()

	// Create Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error": err.Error(),
			})
		},
	})

	// Middleware
	app.Use(cors.New())
	app.Use(logger.New())

	// Routes
	api := app.Group("/api")

	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/signup", handlers.Signup)
	auth.Post("/login", handlers.Login)
	auth.Get("/me", middleware.Auth(), handlers.Me)

	// Start server
	log.Printf("Server starting on port %s", config.C.Port)
	log.Fatal(app.Listen(":" + config.C.Port))
}
