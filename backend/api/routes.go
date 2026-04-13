// Route registration for the Dojo backend.

package api

import (
	"github.com/gin-gonic/gin"

	"interview-dojo-api/storage"
)

// RegisterRoutes wires REST + WebSocket endpoints for the Dojo app.
func RegisterRoutes(r *gin.Engine, store storage.SessionStore) {
	h := newInterviewHandler(store)

	// Legacy/simple endpoint.
	r.GET("/api/question", getQuestion)

	// Interview flow endpoints.
	r.POST("/api/interview/session", h.createSession)
	r.GET("/api/interview/next-question", h.nextQuestion)
	r.POST("/api/interview/submit", h.submitAnswer)
	r.GET("/api/interview/history", h.getHistory)

	// Real-time WebSocket interview.
	r.GET("/api/ws", handleWebSocket)
}

