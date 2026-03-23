// Amazon Bedrock (Claude 3) integration stub.
// Add AWS SDK calls here when you are ready to connect BYOK keys.

package ai

import "interview-dojo-api/models"

type BedrockClient struct{}

func NewBedrockClient() Client {
	// TODO: read config + create AWS Bedrock runtime client.
	return &BedrockClient{}
}

func (c *BedrockClient) GenerateFeedback(jobDescription string, question models.Question, transcript string) (models.Feedback, error) {
	return models.Feedback{
		Score:       0,
		Summary:     "Bedrock integration not implemented yet.",
		FillerWords: map[string]int{},
		Star:        "Needs work",
	}, nil
}

