import { createContext, useContext, useReducer } from 'react'

const InterviewContext = createContext(null)

const initialState = {
  jobTitle: '',
  jobDescription: '',
  sessionId: null,
  questions: [],        // all AI-generated questions for this session
  questionIndex: 0,     // which question we're on
  currentQuestion: null,
  interimTranscript: '',
  finalTranscript: '',
  evaluation: null,     // rich AI evaluation result
  status: 'setup',
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_JOB_DESCRIPTION':
      return { ...state, jobDescription: action.jobDescription }
    case 'SET_JOB_TITLE':
      return { ...state, jobTitle: action.jobTitle }
    case 'START_SESSION':
      return {
        ...state,
        sessionId: action.sessionId,
        questions: action.questions,
        questionIndex: 0,
        currentQuestion: action.questions[0] ?? null,
        status: 'interview',
        evaluation: null,
        interimTranscript: '',
        finalTranscript: '',
      }
    case 'NEXT_QUESTION': {
      const nextIndex = state.questionIndex + 1
      const nextQ = state.questions[nextIndex] ?? null
      return {
        ...state,
        questionIndex: nextIndex,
        currentQuestion: nextQ,
        evaluation: null,
        interimTranscript: '',
        finalTranscript: '',
      }
    }
    case 'SET_INTERIM_TRANSCRIPT':
      return { ...state, interimTranscript: action.transcript }
    case 'SET_FINAL_TRANSCRIPT':
      return { ...state, finalTranscript: action.transcript }
    case 'SET_EVALUATION':
      return { ...state, evaluation: action.evaluation }
    case 'CLEAR_EVALUATION':
      return { ...state, evaluation: null }
    case 'RESET':
      return { ...initialState }
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
