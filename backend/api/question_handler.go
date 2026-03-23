// HTTP handlers related to interview questions.

package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"interview-dojo-api/interview"
	"interview-dojo-api/models"
)

func getQuestion(c *gin.Context) {
	// Optional query parameter: jobDescription.
	jobDescription := c.Query("jobDescription")

	q := interview.NextQuestion(jobDescription)
	if q == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no questions available"})
		return
	}

	// Ensure JSON fields match models.Question.
	c.JSON(http.StatusOK, models.Question{
		ID:       q.ID,
		Text:     q.Text,
		Category: q.Category,
	})
}

