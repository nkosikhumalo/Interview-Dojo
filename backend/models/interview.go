// Interview request/response models and session entities.

package models

type CreateSessionRequest struct {
	JobDescription string `json:"jobDescription"`
}

type CreateSessionResponse struct {
	SessionID string `json:"sessionId"`
}

type NextQuestionRequest struct {
	SessionID string
}

type SubmitAnswerRequest struct {
	SessionID string `json:"sessionId"`
	QuestionID int   `json:"questionId"`
	Transcript string `json:"transcript"`
}

type Feedback struct {
	Score      int               `json:"score"`
	Summary    string            `json:"summary"`
	FillerWords map[string]int  `json:"fillerWords"`
	Star        string           `json:"star"`
}

type SubmitAnswerResponse struct {
	Feedback    Feedback  `json:"feedback"`
	NextQuestion *Question `json:"nextQuestion,omitempty"`
}

// Session holds interview context for the lifetime of the process.
// In production, this should be backed by a persistent DB (e.g., Postgres).
type Session struct {
	ID             string
	JobDescription string
	CurrentQuestion *Question
	// History can grow here (answers, timestamps, model outputs).
}

