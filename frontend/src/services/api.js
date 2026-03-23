// # API client for the Dojo app
// Contains thin wrappers around HTTP calls to the Go (Gin) backend.

import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export function createInterviewSession(jobDescription) {
  return axios
    .post(`${API_BASE_URL}/api/interview/session`, { jobDescription })
    .then((res) => res.data)
}

export function fetchNextQuestion(sessionId) {
  return axios
    .get(`${API_BASE_URL}/api/interview/next-question`, {
      params: { sessionId },
    })
    .then((res) => res.data)
}

export function submitAnswer({ sessionId, questionId, transcript }) {
  return axios
    .post(`${API_BASE_URL}/api/interview/submit`, {
      sessionId,
      questionId,
      transcript,
    })
    .then((res) => res.data)
}