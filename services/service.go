package services

import (
	"sync"
	"time"

	"github.com/rapidforge-io/rapidforge/models"
)

type Service struct {
	store *models.Store
}

var (
	once     sync.Once
	instance *Service
	LService *LoginService
)

func SetupService(s *models.Store) {
	once.Do(func() {
		instance = &Service{s}
		LService = &LoginService{Service: instance, attempts: map[string]int{}}
	})

	go func() {
		for range time.Tick(periodicTaskInterval) {
			instance.RunPeriodicPrograms()
		}
	}()
}
