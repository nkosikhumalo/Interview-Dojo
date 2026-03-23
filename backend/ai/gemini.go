// Google Gemini API integration stub.
// Add Google AI SDK calls here when you are ready to connect the provider.

package ai

import "interview-dojo-api/models"

type GeminiClient struct{}

func NewGeminiClient() Client {
	// TODO: create Gemini client based on BYOK/API key stored by the user.
	return &GeminiClient{}
}

func (c *GeminiClient) GenerateFeedback(jobDescription string, question models.Question, transcript string) (models.Feedback, error) {
	return models.Feedback{
		Score:       0,
		Summary:     "Gemini integration not implemented yet.",
		FillerWords: map[string]int{},
		Star:        "Needs work",
	}, nil
}

