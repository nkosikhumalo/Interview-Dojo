package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Question represents the structure of our interview data
// The `json:"..."` tags tell Go how to format this for React
type Question struct {
	ID       int    `json:"id"`
	Text     string `json:"text"`
	Category string `json:"category"`
}

func main() {
	// 1. Initialize the Gin router
	r := gin.Default()

	// 2. Configure CORS so your React app (on port 5173) can access the API
	// Without this, the browser will block your requests for security!
	r.Use(cors.Default())

	// 3. Our "Database" (just a slice for now)
	questions := []Question{
		{ID: 1, Text: "What is a Goroutine?", Category: "Go"},
		{ID: 2, Text: "Explain the difference between an Interface and an Abstract Class.", Category: "General OOP"},
		{ID: 3, Text: "How does the Virtual DOM work in React?", Category: "Frontend"},
	}

	// 4. Define the API route
	r.GET("/api/question", func(c *gin.Context) {
		// For now, we'll just return the first question
		// Later we can add logic to pick a random one!
		c.JSON(http.StatusOK, questions[0])
	})

	// 5. Start the server on port 8080
	r.Run(":8080")
}
