package token

import (
	"github.com/golang-jwt/jwt/v5"
	"time"
)

// TODO: replace with env variable.
var secret = []byte("SECRET_KEY")

// Generate generates a JWT token for the given user ID.
func Generate(userID string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // 1-D expiry
		"at":      time.Now().Unix(),
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(secret)
}

func Verify(tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})

	if err != nil || !token.Valid {
		return "", err
	}

	claims := token.Claims.(jwt.MapClaims)
	userId, ok := claims["user_id"].(string)

	if !ok {
		return "", jwt.ErrInvalidKey
	}

	return userId, nil
}
