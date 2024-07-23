package services

import (
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/rapidforge-io/rapidforge/config"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/models"
)

type LoginService struct {
	*Service
	attempts map[string]int
	mu       sync.Mutex
}

var ErrTooManyAttempts = errors.New("Too many failed login attempts")
var ErrInvalidUsernameOrPassword = errors.New("Invalid username or password")

func (s *LoginService) Login(username, password string) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	rflog.Info("login", "username", username, "password", password)

	if s.attempts[username] >= config.Get().LoginAttemptCount {
		return "", ErrTooManyAttempts
	}

	user, err := s.store.GetUserByUsername(username)

	if err != nil {
		return "", ErrInvalidUsernameOrPassword
	}

	success := s.store.VerifyPassword(user.PasswordHash, password)

	if !success {
		s.attempts[username]++
		return "", ErrInvalidUsernameOrPassword
	}

	// reset the login attempts on successful login
	s.attempts[username] = 0

	token, err := generateJWT(user)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *LoginService) LoginWithToken(tokenString string) (*models.User, error) {
	userID, err := verifyJWT(tokenString)
	if err != nil {
		return nil, err
	}

	var user *models.User
	user, err = s.store.GetUserByID(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid token")
	}

	return user, nil
}

func verifyJWT(tokenString string) (int64, error) {
	claims := &jwt.MapClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {

		if token.Method != jwt.SigningMethodHS256 {
			return nil, fmt.Errorf("invalid signing method")
		} else {
			return config.Get().JWTSecretKey(), nil
		}
	})

	if err != nil {
		return 0, err
	}

	if !token.Valid {
		return 0, fmt.Errorf("invalid token")
	}

	userID, ok := (*claims)["user_id"].(float64)
	if !ok {
		return 0, fmt.Errorf("invalid token claims")
	}

	return int64(userID), nil
}

func generateJWT(user *models.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString(config.Get().JWTSecretKey())
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
