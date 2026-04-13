// Main interview page for the Dojo app.

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterviewStore } from '../store/store'
import Navbar from '../Components/shared/Navbar'
import Transcript from '../Components/Transcript'
import Timer from '../Components/Timer'
import SkillTag from '../Components/SkillTag'
import FeedbackModal from '../Components/FeedbackModal'
import { submitAnswer } from '../services/api'
import { PrimaryButton } from '../Components/ui/inputs'

export default function Interview() {
  const { state, dispatch } = useInterviewStore()
  const navigate = useNavigate()
  const [timerRunning, setTimerRunning] = useState(true)

  const question = state.currentQuestion
  const jobDescription = state.jobDescription

  const canSubmit = useMemo(
    () => state.finalTranscript.trim().length > 0,
    [state.finalTranscript]
  )

  async function handleSubmit() {
    if (!state.sessionId || !question) return

    const result = await submitAnswer({
      sessionId: state.sessionId,
      questionId: question.id,
      transcript: state.finalTranscript,
    })

    dispatch({ type: 'SET_FEEDBACK', feedback: result.feedback })

    if (result.nextQuestion) {
      dispatch({ type: 'SET_QUESTION', question: result.nextQuestion })
    }
  }

  function handleNewInterview() {
    dispatch({ type: 'RESET' })
    navigate('/setup')
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 20 }}>
      <Navbar title="Dojo Interview" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {question?.category ? <SkillTag label={question.category} /> : null}
          <SkillTag label="AI interviewer" />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => navigate('/history')} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}>
            History
          </button>
          <button type="button" onClick={handleNewInterview} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}>
            New Interview
          </button>
        </div>
      </div>

      <h2 style={{ marginTop: 16 }}>{question ? question.text : '...'}</h2>

      <Timer seconds={60} running={timerRunning} onDone={() => setTimerRunning(false)} />

      <Transcript
        onFinalTranscript={(finalText) => {
          dispatch({ type: 'SET_FINAL_TRANSCRIPT', transcript: finalText })
        }}
        setInterimText={(t) => {
          dispatch({ type: 'SET_INTERIM_TRANSCRIPT', transcript: t })
        }}
      />

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <PrimaryButton onClick={handleSubmit} disabled={!canSubmit}>
          Submit Answer
        </PrimaryButton>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'CLEAR_FEEDBACK' })
            dispatch({ type: 'SET_FINAL_TRANSCRIPT', transcript: '' })
          }}
        >
          Clear
        </button>
      </div>

      {jobDescription?.trim() ? (
        <details style={{ marginTop: 16 }}>
          <summary>Job description (tailoring context)</summary>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              background: '#fafafa',
              border: '1px solid #eee',
              borderRadius: 10,
              padding: 12,
              marginTop: 8,
            }}
          >
            {jobDescription}
          </pre>
        </details>
      ) : null}

      <FeedbackModal
        feedback={state.feedback}
        onClose={() => dispatch({ type: 'CLEAR_FEEDBACK' })}
      />
    </div>
  )
}

