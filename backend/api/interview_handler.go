// HTTP handlers for the Dojo interview flow:
// - creating sessions
// - fetching the next question
// - submitting an answer for feedback

package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"interview-dojo-api/interview"
	"interview-dojo-api/models"
	"interview-dojo-api/storage"
)

type interviewHandler struct {
	store storage.SessionStore
}

func newInterviewHandler(store storage.SessionStore) *interviewHandler {
	return &interviewHandler{store: store}
}

func (h *interviewHandler) createSession(c *gin.Context) {
	var req models.CreateSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	session := h.store.Create(req.JobDescription)
	c.JSON(http.StatusOK, models.CreateSessionResponse{SessionID: session.ID})
}

func (h *interviewHandler) nextQuestion(c *gin.Context) {
	sessionID := c.Query("sessionId")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing sessionId"})
		return
	}

	session, ok := h.store.Get(sessionID)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "session not found"})
		return
	}

	q := interview.NextQuestion(session.JobDescription)
	h.store.UpdateQuestion(sessionID, q)

	c.JSON(http.StatusOK, q)
}

func (h *interviewHandler) submitAnswer(c *gin.Context) {
	var req models.SubmitAnswerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	session, ok := h.store.Get(req.SessionID)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "session not found"})
		return
	}

	feedback := interview.ScoreFeedback(req.Transcript)

	nextQ := interview.NextQuestion(session.JobDescription)
	h.store.UpdateQuestion(req.SessionID, nextQ)

	c.JSON(http.StatusOK, models.SubmitAnswerResponse{
		Feedback:    feedback,
		NextQuestion: nextQ,
	})
}

