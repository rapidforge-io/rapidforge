package models

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	rflog "github.com/rapidforge-io/rapidforge/logger"
	"golang.org/x/oauth2"
)

type Credential struct {
	ID            int64          `db:"id"`
	Type          string         `db:"type"`
	Name          string         `db:"name"`
	OauthUrl      sql.NullString `db:"oauth_url"`
	OauthTokenUrl sql.NullString `db:"oauth_token_url"`
	GrantType     string         `db:"grant_type"`
	Scope         sql.NullString `db:"scope"`
	Value         sql.NullString `db:"value"`
	ClientID      sql.NullString `db:"client_id"`
	ClientSecret  sql.NullString `db:"client_secret"`
	Token         sql.NullString `db:"token"`
	RefreshToken  sql.NullString `db:"refresh_token"`
	Expiry        sql.NullString `db:"expiry"`
	UpdatedAt     time.Time      `db:"updated_at"`
}

type CredentialFormData struct {
	Name         string `form:"name"`
	Type         string `form:"type"`
	Value        string `form:"value"`
	OauthUrl     string `form:"oauth_url"`
	TokenUrl     string `form:"token_url"`
	Scope        string `form:"scope"`
	ClientID     string `form:"client_id"`
	ClientSecret string `form:"client_secret"`
	Token        string `form:"token"`
	RefreshToken string `form:"refresh_token"`
	Expiry       string `form:"expiry"`
}

const (
	GrantTypeClientCredentials = "client_credentials"
	GrantTypeAuthorizationCode = "authorization_code"
	GrantTypeRefreshToken      = "refresh_token"
	CredentialTypeOAuth        = "oauth"
	CredentialTypeText         = "text"
)

func (s *Store) ListCredentials() (*[]Credential, error) {
	var credentials []Credential

	query := `SELECT id, type, name, oauth_url, oauth_token_url, grant_type,
	                 scope, value, client_id, client_secret,
	                 token, refresh_token, expiry, updated_at
	          FROM credentials`

	err := s.db.Select(&credentials, query)
	if err != nil {
		return nil, err
	}
	return &credentials, nil
}

func (s *Store) ListCredentialsForEnv() (map[string]string, error) {
	credentials, err := s.ListCredentials()
	if err != nil {
		return nil, err
	}

	envVariables := map[string]string{}

	for _, credential := range *credentials {
		formattedName := strings.ToUpper(credential.Name)
		key := fmt.Sprintf("CRED_%s", formattedName)

		if credential.Type == CredentialTypeOAuth {
			envVariables[key] = credential.Token.String
		} else {
			envVariables[key] = credential.Value.String
		}
	}

	return envVariables, nil
}

func (s *Store) SearchCredentials(query string) ([]Credential, error) {
	var credentials []Credential
	searchQuery := `SELECT id, type, name, oauth_url, oauth_token_url, grant_type, scope, value, client_id, client_secret, token, refresh_token, expiry, updated_at FROM credentials WHERE name LIKE ?`
	searchTerm := "%" + query + "%"
	err := s.db.Select(&credentials, searchQuery, searchTerm)
	if err != nil {
		return nil, err
	}
	return credentials, nil
}

func (s *Store) ListExpiredCredentials() ([]Credential, error) {
	query := `SELECT id, type, name, oauth_url, oauth_token_url, grant_type,
		             scope, value, client_id, client_secret, token, refresh_token, expiry, updated_at
		FROM credentials
		WHERE refresh_token IS NULL AND refresh_token <> '' AND expiry IS NOT NULL AND datetime(expiry) <= datetime('now')`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var credentials []Credential
	for rows.Next() {
		var credential Credential
		err := rows.Scan(&credential.ID, &credential.Type, &credential.Name, &credential.OauthUrl, &credential.OauthTokenUrl, &credential.GrantType, &credential.Scope, &credential.Value, &credential.ClientID, &credential.ClientSecret, &credential.Token, &credential.RefreshToken, &credential.Expiry, &credential.UpdatedAt)
		if err != nil {
			return nil, err
		}
		credentials = append(credentials, credential)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return credentials, nil
}

func (c *Credential) refreshToken() error {
	oauthConfig := &oauth2.Config{
		ClientID:     c.ClientID.String,
		ClientSecret: c.ClientSecret.String,
		Endpoint: oauth2.Endpoint{
			TokenURL: c.OauthTokenUrl.String,
		},
	}

	token := &oauth2.Token{
		RefreshToken: c.RefreshToken.String,
	}

	tokenSource := oauthConfig.TokenSource(context.Background(), token)
	newToken, err := tokenSource.Token()
	if err != nil {
		return fmt.Errorf("failed to refresh token: %w", err)
	}

	c.RefreshToken = sql.NullString{String: newToken.RefreshToken, Valid: true}
	c.Token = sql.NullString{String: newToken.AccessToken, Valid: true}
	c.Expiry = sql.NullString{String: newToken.Expiry.Format(time.RFC3339), Valid: true}

	return nil
}

func (s *Store) RefreshTokens() error {
	credentials, err := s.ListExpiredCredentials()
	if err != nil {
		return err
	}

	for _, credential := range credentials {
		if credential.RefreshToken.Valid {
			err := credential.refreshToken()
			if err != nil {
				rflog.Error("refreshToken", "Error refreshing token for credential:", credential.Name, err)
			}
			err = s.UpdateCredential(&credential)
			if err != nil {
				rflog.Error("refreshToken update", "Error refreshing token for credential:", credential.Name, err)
			}
		}
	}

	return nil
}

func (s *Store) FetchCredentialByID(id int64) (*Credential, error) {
	var credential Credential

	query := `SELECT id, type, name, oauth_url, oauth_token_url, grant_type, scope, value,
	                 client_id, client_secret, token, refresh_token, expiry, updated_at
              FROM credentials
              WHERE id = ?`

	err := s.db.Get(&credential, query, id)
	if err != nil {
		return nil, err
	}
	return &credential, nil
}

func (s *Store) FetchCredentialByName(name string) (*Credential, error) {
	var credential Credential

	query := `SELECT id, type, name, oauth_url, oauth_token_url, grant_type, scope, value,
	                 client_id, client_secret, token, refresh_token, expiry, updated_at
              FROM credentials
              WHERE name = ?`

	err := s.db.Get(&credential, query, name)
	if err != nil {
		return nil, err
	}
	return &credential, nil
}

func (s *Store) UpdateCredential(credential *Credential) error {
	query := `UPDATE credentials
              SET type = ?, name = ?, oauth_url = ?, oauth_token_url = ?,
			      grant_type = ?, scope = ?, value = ?, client_id = ?,
				  client_secret = ?, token = ?, refresh_token = ?,
				  expiry = ?, updated_at = ?
              WHERE id = ?`

	credential.UpdatedAt = time.Now().UTC()

	rflog.Info("updating credential", "credential", credential)
	_, err := s.db.Exec(query, credential.Type, credential.Name, credential.OauthUrl,
		credential.OauthTokenUrl, credential.GrantType, credential.Scope,
		credential.Value, credential.ClientID, credential.ClientSecret,
		credential.Token, credential.RefreshToken, credential.Expiry,
		credential.UpdatedAt, credential.ID)
	if err != nil {
		return err
	}
	return nil
}

func (s *Store) InsertCredential(credential *Credential) error {
	query := `INSERT INTO credentials (type, name, oauth_url, oauth_token_url, grant_type, scope, value, client_id, client_secret, token, refresh_token, expiry)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	result, err := s.db.Exec(query, credential.Type, credential.Name, credential.OauthUrl, credential.OauthTokenUrl, credential.GrantType, credential.Scope, credential.Value, credential.ClientID, credential.ClientSecret,
		credential.Token, credential.RefreshToken, credential.Expiry)

	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	credential.ID = id
	return nil
}

func (s *Store) DeleteCredential(id int64) error {
	query := `DELETE FROM credentials WHERE id = ?`

	_, err := s.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}

func (s *Store) SaveToken(id int64, token *oauth2.Token) error {
	query := `UPDATE credentials
              SET token = ?, refresh_token = ?, expiry = ?, updated_at = ?
              WHERE id = ?`

	_, err := s.db.Exec(query, token.AccessToken, token.RefreshToken, token.Expiry.Format(time.RFC3339), time.Now().UTC(), id)
	if err != nil {
		return fmt.Errorf("failed to save token: %w", err)
	}
	return nil
}
