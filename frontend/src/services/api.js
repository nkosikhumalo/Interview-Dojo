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

export function fetchHistory(sessionId) {
  return axios
    .get(`${API_BASE_URL}/api/interview/history`, { params: { sessionId } })
    .then((res) => res.data)
}

// WebSocket client for live interview mode.
// Returns a controller object with send() and close().
export function createLiveSession({ onQuestion, onFeedback, onError }) {
  const wsBase = API_BASE_URL.replace(/^http/, 'ws')
  const ws = new WebSocket(`${wsBase}/api/ws`)

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      const payload = JSON.parse(msg.payload ?? '{}')
      if (msg.type === 'question') onQuestion?.(payload)
      else if (msg.type === 'feedback') onFeedback?.(payload)
      else if (msg.type === 'error') onError?.(payload)
    } catch {
      // ignore malformed frames
    }
  }

  ws.onerror = () => onError?.({ message: 'WebSocket connection error' })

  return {
    start(jobDescription) {
      ws.send(JSON.stringify({ type: 'start', payload: JSON.stringify({ jobDescription }) }))
    },
    sendTranscript(text) {
      ws.send(JSON.stringify({ type: 'transcript', payload: JSON.stringify({ text }) }))
    },
    next() {
      ws.send(JSON.stringify({ type: 'next', payload: '{}' }))
    },
    close() {
      ws.close()
    },
  }
}
