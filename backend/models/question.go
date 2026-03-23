// Data models for interview questions.
// This file defines the JSON shapes exchanged between the React frontend and
// the Go backend.

package models

type Question struct {
	ID       int    `json:"id"`
	Text     string `json:"text"`
	Category string `json:"category"`
}

