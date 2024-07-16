package models

import (
	"log"
	"strings"
)

type Setting struct {
	ID    int    `json:"id" db:"id"`
	Name  string `json:"name" db:"name"`
	Value string `json:"value" db:"value"`
}

func (s *Store) InsertSetting(key, value string) {
	key = strings.Trim(key, " ")
	insertSQL := `INSERT INTO settings (name, value) VALUES (?, ?)`
	_, err := s.db.Exec(insertSQL, key, value)
	if err != nil {
		log.Fatal(err)
	}
}

func (s *Store) UpdateConfigByKey(key, value string) {
	updateSQL := `UPDATE settings SET value = ? WHERE name = ?`
	_, err := s.db.Exec(updateSQL, value, key)
	if err != nil {
		log.Fatal(err)
	}
}

func (s *Store) GetConfigByKey(key string) (string, error) {
	var setting Setting
	querySQL := `SELECT value FROM settings WHERE name = ?`
	err := s.db.Get(&setting, querySQL, key)
	if err != nil {
		return "", err
	}
	return setting.Value, nil
}
