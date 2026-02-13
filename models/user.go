package models

import (
	"errors"
	"os"
	"time"

	"github.com/rapidforge-io/rapidforge/config"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/utils"
	"golang.org/x/crypto/bcrypt"
)

func (s *Store) VerifyPassword(storedHash string, password string) bool {
	passwordWithKey := password + config.Get().AuthKey()

	err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(passwordWithKey))
	return err == nil
}

func (s *Store) InsertUser(user *User) error {
	if user.Username == "" {
		return errors.New("username is required")
	}

	passwordWithKey := user.PasswordHash + config.Get().AuthKey()
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(passwordWithKey), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	if user.Role == "" {
		user.Role = "admin"
	}

	query := `INSERT INTO users (username, password_hash, role, email)
              VALUES (?, ?, ?, ?)`

	_, err = s.db.Exec(query,
		user.Username,
		hashedPassword,
		user.Role,
		user.Email,
	)
	return err
}

func (s *Store) InsertUserOLD(user *User) error {
	passwordWithKey := user.PasswordHash + config.Get().AuthKey()

	if user.Username == "" {
		return errors.New("username is required")
	}

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

func (s *Store) UpdateUser(user *User) error {
	var passwordHash string
	if user.PasswordHash != "" {
		passwordWithKey := user.PasswordHash + config.Get().AuthKey()
		hash, err := bcrypt.GenerateFromPassword([]byte(passwordWithKey), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		passwordHash = string(hash)
	} else {
		err := s.db.QueryRow("SELECT password_hash FROM users WHERE id = ?", user.ID).Scan(&passwordHash)
		if err != nil {
			return err
		}
	}

	if user.Role == "" {
		user.Role = "admin"
	}

	_, err := s.db.Exec("UPDATE users SET username = ?, email = ?, password_hash = ?, role = ?, updated_at = ? WHERE id = ?",
		user.Username, user.Email, passwordHash, user.Role, time.Now().UTC(), user.ID)
	return err
}

func (s *Store) ListUsers() ([]User, error) {
	var users []User
	query := `SELECT id, username, email, settings, role FROM users`

	err := s.db.Select(&users, query)
	if err != nil {
		return nil, err
	}

	return users, nil
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

func (s *Store) UserExists() (bool, error) {
	var exists bool
	query := `SELECT EXISTS (SELECT 1 FROM users LIMIT 1)`

	err := s.db.Get(&exists, query)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func (s *Store) CreateAdminUserIfNoUserExists() (*User, error) {
	// In demo mode, always create/update the demo user
	if config.Get().IsDemoMode() {
		demoUser := &User{
			Username:     "test",
			PasswordHash: "test",
			Role:         AdminRole,
		}

		// Check if demo user already exists
		existingUser, _ := s.GetUserByUsername("test")
		if existingUser == nil {
			if err := s.InsertUser(demoUser); err != nil {
				return nil, err
			}
		} else {
			// Update existing user to ensure password is "test"
			demoUser.ID = existingUser.ID
			if err := s.UpdateUser(demoUser); err != nil {
				return nil, err
			}
		}
		return demoUser, nil
	}

	// Normal mode: create admin user if no users exist
	exists, err := s.UserExists()
	if err != nil {
		return nil, err
	}

	if !exists {
		randomPassword, err := utils.GenerateRandomString(8)
		if err != nil {
			rflog.Error("failed to generate random password", "err", err)
			os.Exit(1)
			return nil, err
		}

		adminUser := &User{
			Username:     "admin",
			PasswordHash: randomPassword,
			Role:         "admin",
		}

		err = s.InsertUser(adminUser)
		if err != nil {
			return nil, err
		}

		return adminUser, nil
	}

	return nil, nil
}

func (s *Store) SearchUsers(query string) ([]User, error) {
	var users []User
	searchQuery := `SELECT id, username, password_hash, email, settings, role, created_at, updated_at FROM users WHERE username LIKE ? OR email LIKE ?`
	searchTerm := "%" + query + "%"
	err := s.db.Select(&users, searchQuery, searchTerm, searchTerm)
	if err != nil {
		return nil, err
	}
	return users, nil
}
