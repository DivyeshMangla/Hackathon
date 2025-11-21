package token

import (
	"time"

	"github.com/divyeshmangla/hackathon/internal/config"
	"github.com/golang-jwt/jwt/v5"
)

// Generate generates a JWT token for the given user ID.
func Generate(userID string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString([]byte(config.C.JWTSecret))
}

func Verify(tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.C.JWTSecret), nil
	})

	if err != nil || !token.Valid {
		return "", err
	}

	claims := token.Claims.(jwt.MapClaims)

	userID, ok := claims["user_id"].(string)

	if !ok {
		return "", jwt.ErrInvalidKey
	}

	return userID, nil
}
