package models

import (
	"time"

	"github.com/rapidforge-io/rapidforge/config"
	"golang.org/x/crypto/bcrypt"
)

func (s *Store) VerifyPassword(storedHash string, password string) bool {
	passwordWithKey := password + config.Get().AuthKey()

	err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(passwordWithKey))
	return err == nil
}

func (s *Store) InsertUser(user *User) error {
	passwordWithKey := user.PasswordHash + config.Get().AuthKey()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(passwordWithKey), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	query := `INSERT INTO users (username, password_hash, role)
	          VALUES (?, ?, ?)`

	if user.Role == "" {
		user.Role = "admin"
	}

	_, err = s.db.Exec(query,
		user.Username,
		hashedPassword,
		user.Role,
	)

	return err
}

func (s *Store) GetUserByID(id int64) (*User, error) {
	var user User
	query := `SELECT id, username, password_hash, email, settings, role, created_at, updated_at
	          FROM users WHERE id = ?`

	err := s.db.Get(&user, query, id)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *Store) GetUserByUsername(username string) (*User, error) {
	var user User
	query := `SELECT id, username, password_hash, email, settings, role, created_at, updated_at
	          FROM users WHERE username = ?`

	err := s.db.Get(&user, query, username)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *Store) DeleteUser(userID int64) error {
	query := `DELETE FROM users WHERE id = ?`

	_, err := s.db.Exec(query, userID)
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) UpdateUserPassword(userID int64, newPassword string) error {
	passwordWithKey := newPassword + config.Get().AuthKey()

	// Generate the hashed password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(passwordWithKey), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	query := `UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`

	updatedAt := time.Now().UTC()

	_, err = s.db.Exec(query, string(hashedPassword), updatedAt, userID)
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) UserExists() (bool, error) {
	var exists bool
	query := `SELECT EXISTS (SELECT 1 FROM users LIMIT 1)`

	err := s.db.Get(&exists, query)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func (s *Store) CreateAdminUserIfNoUserExists() error {
	exists, err := s.UserExists()
	if err != nil {
		return err
	}

	if !exists {
		adminUser := &User{
			Username:     "admin",
			PasswordHash: "admin123",
			Role:         "admin",
		}

		err = s.InsertUser(adminUser)
		if err != nil {
			return err
		}
	}

	return nil
}
