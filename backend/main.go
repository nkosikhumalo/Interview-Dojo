package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"interview-dojo-api/api"
	"interview-dojo-api/storage"
)

func main() {
	// Root server entrypoint for the Dojo backend.
	// Responsibilities:
	// - configure Gin + CORS
	// - initialize storage/session layer
	// - register API routes
	r := gin.Default()

	// Configure CORS so the React dev server can access the API.
	r.Use(cors.Default())

	// Initialize storage/session layer.
	store := storage.NewInMemorySessionStore()

	// Register all REST endpoints.
	api.RegisterRoutes(r, store)

	r.Run(":8080")
}
