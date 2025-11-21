package encrypt

import "golang.org/x/crypto/bcrypt"

// Hash generates a bcrypt hash of the given raw string.
func Hash(raw string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(raw), bcrypt.DefaultCost)
	return string(bytes), err
}

// Check checks if the hashed password matches the raw password.
func Check(hashed, raw string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(raw))
}
