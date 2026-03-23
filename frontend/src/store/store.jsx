// # Global state for the Dojo interview flow
// Uses React Context + useReducer so pages/components can share:
// - job description
// - session id
// - current question
// - transcript + feedback

import { createContext, useContext, useReducer } from 'react'

const InterviewContext = createContext(null)

const initialState = {
  jobDescription: '',
  sessionId: null,
  currentQuestion: null,
  interimTranscript: '',
  finalTranscript: '',
  feedback: null,
  status: 'setup', // 'setup' | 'interview'
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_JOB_DESCRIPTION':
      return { ...state, jobDescription: action.jobDescription }
    case 'START_SESSION':
      return {
        ...state,
        sessionId: action.sessionId,
        status: 'interview',
        feedback: null,
        interimTranscript: '',
        finalTranscript: '',
      }
    case 'SET_QUESTION':
      return {
        ...state,
        currentQuestion: action.question,
        feedback: null,
        interimTranscript: '',
        finalTranscript: '',
      }
    case 'SET_INTERIM_TRANSCRIPT':
      return { ...state, interimTranscript: action.transcript }
    case 'SET_FINAL_TRANSCRIPT':
      return { ...state, finalTranscript: action.transcript }
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.feedback }
    case 'CLEAR_FEEDBACK':
      return { ...state, feedback: null }
    default:
      return state
  }
}

export function InterviewProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <InterviewContext.Provider value={{ state, dispatch }}>
      {children}
    </InterviewContext.Provider>
  )
}

export function useInterviewStore() {
  const ctx = useContext(InterviewContext)
  if (!ctx) throw new Error('useInterviewStore must be used inside provider')
  return ctx
}
