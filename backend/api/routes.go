// Route registration for the Dojo backend.
// Keeps main.go small by grouping HTTP endpoint wiring in one place.

package api

import (
	"github.com/gin-gonic/gin"

	"interview-dojo-api/storage"
)

// RegisterRoutes wires REST endpoints for the Dojo app.
func RegisterRoutes(r *gin.Engine, store storage.SessionStore) {
	h := newInterviewHandler(store)

	// Legacy/simple endpoint (kept for backwards compatibility).
	r.GET("/api/question", getQuestion)

	// Interview flow endpoints.
	r.POST("/api/interview/session", h.createSession)
	r.GET("/api/interview/next-question", h.nextQuestion)
	r.POST("/api/interview/submit", h.submitAnswer)

	// Real-time mock interview placeholder.
	r.GET("/api/ws", notImplementedWebsocket)
}

