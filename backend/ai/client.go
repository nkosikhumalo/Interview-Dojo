// AI client abstraction for the Dojo interview system.
// Intended to integrate LLM providers such as Amazon Bedrock (Claude 3) and
// Google Gemini. For now, this is a stub so the server compiles without
// credentials.

package ai

import "interview-dojo-api/models"

type Client interface {
	GenerateFeedback(jobDescription string, question models.Question, transcript string) (models.Feedback, error)
}

type StubClient struct{}

func NewStubClient() Client {
	return &StubClient{}
}

func (s *StubClient) GenerateFeedback(jobDescription string, question models.Question, transcript string) (models.Feedback, error) {
	// The real implementation should call an LLM and return a structured
	// feedback object. For local dev we rely on heuristic scoring instead.
	return models.Feedback{
		Score:       0,
		Summary:     "AI feedback is not wired yet; using heuristic scoring instead.",
		FillerWords: map[string]int{},
		Star:        "Needs work",
	}, nil
}

