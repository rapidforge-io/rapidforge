package services

import (
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/rapidforge-io/rapidforge/config"
	"github.com/rapidforge-io/rapidforge/models"
)

type loginAttempt struct {
	count     int
	firstFail time.Time
}

const loginAttemptWindow = 15 * time.Minute

type LoginService struct {
	*Service
	attempts map[string]*loginAttempt
	mu       sync.Mutex
}

var ErrTooManyAttempts = errors.New("Too many failed login attempts")
var ErrInvalidUsernameOrPassword = errors.New("Invalid username or password")

func (s *LoginService) ResetLoginAttempts(username string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	delete(s.attempts, username)
	return nil
}

func (s *LoginService) getAttempts(username string) *loginAttempt {
	a, exists := s.attempts[username]
	if !exists || time.Since(a.firstFail) > loginAttemptWindow {
		a = &loginAttempt{count: 0, firstFail: time.Now()}
		s.attempts[username] = a
	}
	return a
}

func (s *LoginService) Login(username, password string) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	username = strings.ReplaceAll(username, "\n", "")
	username = strings.TrimSpace(username)
	password = strings.ReplaceAll(password, "\n", "")

	attempt := s.getAttempts(username)
	if attempt.count >= config.Get().LoginAttemptCount {
		return "", ErrTooManyAttempts
	}

	user, err := s.store.GetUserByUsername(username)

	if err != nil {
		return "", ErrInvalidUsernameOrPassword
	}

	success := s.store.VerifyPassword(user.PasswordHash, password)

	if !success {
		attempt.count++
		return "", ErrInvalidUsernameOrPassword
	}

	// reset the login attempts on successful login
	delete(s.attempts, username)

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

	if exp, ok := (*claims)["exp"].(float64); ok {
		expirationTime := time.Unix(int64(exp), 0)
		if expirationTime.Before(time.Now()) {
			return 0, fmt.Errorf("token has expired")
		}
	} else {
		return 0, fmt.Errorf("expiration time not found in token")
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
		"exp":     time.Now().Add(config.Get().TokenExpiry).Unix(),
	})

	tokenString, err := token.SignedString(config.Get().JWTSecretKey())
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
