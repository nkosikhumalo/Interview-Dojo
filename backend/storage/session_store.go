// Session storage layer for the Dojo interview flow.
// Currently uses an in-memory map (good for local development).
// Swap this for PostgreSQL in a production-ready version.

package storage

import (
	"crypto/rand"
	"encoding/hex"
	"sync"

	"interview-dojo-api/models"
)

type SessionStore interface {
	Create(jobDescription string) *models.Session
	Get(sessionID string) (*models.Session, bool)
	UpdateQuestion(sessionID string, q *models.Question) bool
}

type inMemorySessionStore struct {
	mu       sync.RWMutex
	sessions map[string]*models.Session
}

func NewInMemorySessionStore() SessionStore {
	return &inMemorySessionStore{
		sessions: make(map[string]*models.Session),
	}
}

func (s *inMemorySessionStore) Create(jobDescription string) *models.Session {
	s.mu.Lock()
	defer s.mu.Unlock()

	sessionID := newSessionID()
	session := &models.Session{
		ID:             sessionID,
		JobDescription: jobDescription,
	}
	s.sessions[sessionID] = session
	return session
}

func (s *inMemorySessionStore) Get(sessionID string) (*models.Session, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	session, ok := s.sessions[sessionID]
	return session, ok
}

func (s *inMemorySessionStore) UpdateQuestion(sessionID string, q *models.Question) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	session, ok := s.sessions[sessionID]
	if !ok {
		return false
	}
	session.CurrentQuestion = q
	return true
}

// newSessionID creates a simple unique session identifier.
// Replace with UUID libraries if desired.
func newSessionID() string {
	// Fast enough for local dev; uses crypto randomness.
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

