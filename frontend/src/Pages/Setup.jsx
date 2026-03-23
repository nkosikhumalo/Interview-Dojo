// Setup page for the Dojo app.
// Lets the user enter a job description/target role to tailor interview prompts.

import { useEffect, useMemo, useState } from 'react'
import { useInterviewStore } from '../store/store'
import { createInterviewSession, fetchNextQuestion } from '../services/api'
import JobDescriptionInput from '../Components/JobDescriptionInput'
import Navbar from '../Components/shared/Navbar'
import { PrimaryButton } from '../Components/ui/inputs'

export default function Setup() {
  const { state, dispatch } = useInterviewStore()
  const [localJobDescription, setLocalJobDescription] = useState(
    state.jobDescription || ''
  )
  const [jobTitle, setJobTitle] = useState('')

  useEffect(() => {
    const context = localJobDescription.trim() ? localJobDescription : jobTitle
    dispatch({ type: 'SET_JOB_DESCRIPTION', jobDescription: context })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localJobDescription, jobTitle])

  const canStart = useMemo(() => {
    return localJobDescription.trim().length > 20 || jobTitle.trim().length > 2
  }, [localJobDescription, jobTitle])

  async function handleStart() {
    const context = localJobDescription.trim() ? localJobDescription : jobTitle
    const { sessionId } = await createInterviewSession(context)

    dispatch({ type: 'START_SESSION', sessionId })

    const question = await fetchNextQuestion(sessionId)
    dispatch({ type: 'SET_QUESTION', question })
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 20 }}>
      <Navbar />
      <h2 style={{ marginTop: 0 }}>Enter the job you are interviewing for</h2>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>
          Job Title (optional)
        </label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g., Frontend Engineer"
          style={{
            width: '100%',
            borderRadius: 10,
            padding: 12,
            border: '1px solid #ddd',
          }}
        />
      </div>

      <JobDescriptionInput
        value={localJobDescription}
        onChange={setLocalJobDescription}
      />

      <div style={{ marginTop: 16 }}>
        <PrimaryButton onClick={handleStart} disabled={!canStart}>
          Start Interview
        </PrimaryButton>
      </div>
    </div>
  )
}

