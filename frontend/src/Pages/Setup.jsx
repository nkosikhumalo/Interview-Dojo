import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterviewStore } from '../store/store'
import { generateQuestions, getQuota } from '../services/api'
import Navbar from '../Components/shared/Navbar'
import '../styles/Setup.css'

const MIN_CHARS = 50
const MIN_WORDS = 8

function validate(desc) {
  const t = desc.trim()
  if (!t) return 'Job description is required.'
  if (t.split(/\s+/).filter(Boolean).length < MIN_WORDS)
    return 'Please enter a real job description — at least 8 words.'
  if (t.length < MIN_CHARS)
    return `Too short. Add ${MIN_CHARS - t.length} more characters.`
  return null
}

export default function Setup() {
  const { dispatch } = useInterviewStore()
  const navigate = useNavigate()
  const [jobTitle, setJobTitle] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [error, setError] = useState(null)
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [loadingStep, setLoadingStep] = useState(0)
  const [quota, setQuota] = useState(null)

  useEffect(() => {
    const hasToken = localStorage.getItem('dojo_token') || sessionStorage.getItem('dojo_token')
    if (hasToken) {
      getQuota().then(setQuota).catch(() => { })
    }
  }, [])

  // Admins and paid plans bypass quota
  const isAdmin = quota?.limit === -1

  const descError = touched ? validate(jobDesc) : null
  const isReady = !validate(jobDesc)

  // Cycle through messages while waiting so the user knows it's working
  const LOADING_MSGS = [
    'Reading job description...',
    'Identifying key skills...',
    'Crafting tailored questions...',
    'Almost ready...',
  ]

  async function handleStart() {
    setTouched(true)
    const err = validate(jobDesc)
    if (err) { setError(err); return }
    setError(null)
    setLoading(true)
    setLoadingStep(0)
    setLoadingMsg(LOADING_MSGS[0])

    // Cycle messages every 4s so the user sees progress
    let step = 0
    const msgInterval = setInterval(() => {
      step = Math.min(step + 1, LOADING_MSGS.length - 1)
      setLoadingStep(step)
      setLoadingMsg(LOADING_MSGS[step])
    }, 4000)

    try {
      dispatch({ type: 'SET_JOB_TITLE', jobTitle: jobTitle.trim() })
      dispatch({ type: 'SET_JOB_DESCRIPTION', jobDescription: jobDesc.trim() })

      const data = await generateQuestions(null, jobTitle.trim(), jobDesc.trim())

      dispatch({
        type: 'START_SESSION',
        sessionId: data.sessionId,
        questions: data.questions,
      })

      navigate('/interview')
    } catch (e) {
      if (e.response?.status === 402) {
        const code = e.response?.data?.code
        if (code === 'TRIAL_EXHAUSTED' || code === 'TRIAL_INVALID') {
          navigate('/login?trialEnded=1')
          return
        }
        navigate('/pricing')
        return
      }
      const msg = e.response?.data?.error || e.message || 'Failed to start. Try again.'
      setError(msg)
    } finally {
      clearInterval(msgInterval)
      setLoading(false)
      setLoadingMsg('')
      setLoadingStep(0)
    }
  }

  return (
    <div className="setup-page">
      <Navbar />
      <div className="setup-mesh" aria-hidden />
      <div className="setup-body">
        <div className="setup-card">
          <div className="setup-card__belt" aria-hidden />

          <div className="setup-field">
            <label htmlFor="job-title">
              Job Title <span className="setup-optional">(optional)</span>
            </label>
            <input
              id="job-title"
              type="text"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Frontend Engineer"
            />
          </div>

          <div className="setup-field">
            <label htmlFor="job-desc">
              Job Description <span className="setup-required">*</span>
            </label>
            <textarea
              id="job-desc"
              className={descError || error ? 'has-error' : ''}
              value={jobDesc}
              onChange={e => { setJobDesc(e.target.value); if (error) setError(null) }}
              onBlur={() => setTouched(true)}
              rows={12}
              placeholder="Paste the full job description here — responsibilities, required skills, tech stack, team info. The more detail you provide, the better your interview questions will be."
            />
            <div className="setup-field__footer">
              {(descError || error) ? (
                <span className="setup-field__error">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {descError || error}
                </span>
              ) : (
                <span className="setup-field__hint">
                  {jobDesc.length >= MIN_CHARS ? '✓ Looks good' : `${MIN_CHARS - jobDesc.length} more characters needed`}
                </span>
              )}
              <span className="setup-field__count">{jobDesc.length} chars</span>
            </div>
          </div>

          {quota && quota.plan === 'free' && !isAdmin && (
            <div className={`setup-quota ${quota.exceeded ? 'setup-quota--exceeded' : quota.remaining === 1 ? 'setup-quota--warning' : ''}`}>
              {quota.exceeded ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>
                    You have used all {quota.limit} free sessions.{' '}
                    <button className="setup-quota__link" onClick={() => navigate('/pricing')}>Upgrade to continue</button>
                    {' '}or{' '}
                    <button className="setup-quota__link" onClick={() => navigate('/api-providers')}>add your own API key</button>.
                  </span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>
                    {quota.remaining} of {quota.limit} free session{quota.limit !== 1 ? 's' : ''} remaining.{' '}
                    {quota.remaining === 1 && (
                      <button className="setup-quota__link" onClick={() => navigate('/pricing')}>View plans</button>
                    )}
                  </span>
                </>
              )}
            </div>
          )}

          <button className="setup-submit" onClick={handleStart} disabled={!isReady || loading || (quota?.exceeded && !isAdmin)}>
            {loading ? (
              <>
                <span className="setup-spinner" />
                {loadingMsg}
                <span className="setup-loading-dots">
                  <span /><span /><span />
                </span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Generate Interview Questions
              </>
            )}
          </button>

          <div className="setup-tips">
            <strong>Tips for better questions</strong>
            <ul>
              <li>Include the tech stack (React, Node.js, PostgreSQL, etc.)</li>
              <li>Mention seniority level and key responsibilities</li>
              <li>Add required skills or certifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
