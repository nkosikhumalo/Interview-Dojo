import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiLogin, apiSignup, apiForgotPassword } from '../services/api'
import './LoginPage.css'

function Brand() {
  return (
    <div className="lp-brand">
      <img className="lp-logo" src="/favicon.png" alt="" width={44} height={44} />
      <div>
        <h2 className="lp-brand__name">FoxVue</h2>
        <span className="lp-brand__sub">Master the art of the interview</span>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [view, setView] = useState('login')

  // login
  const [email, setEmail] = useState(() => localStorage.getItem('dojo_remembered_email') || '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem('dojo_remembered_email')))
  const [busy, setBusy] = useState(false)
  const [loginError, setLoginError] = useState(searchParams.get('error') || '')

  // signup
  const [suName, setSuName] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suConfirm, setSuConfirm] = useState('')
  const [suBusy, setSuBusy] = useState(false)
  const [suError, setSuError] = useState('')

  // forgot
  const [fgEmail, setFgEmail] = useState('')
  const [fgBusy, setFgBusy] = useState(false)
  const [fgError, setFgError] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    if (!email || !password) { setLoginError('Please fill in all fields.'); return }
    setBusy(true)
    apiLogin(email, password)
      .then((data) => {
        if (remember) {
          localStorage.setItem('dojo_token', data.token)
          localStorage.setItem('dojo_remembered_email', email)
        } else {
          sessionStorage.setItem('dojo_token', data.token)
          localStorage.removeItem('dojo_token')
          localStorage.removeItem('dojo_remembered_email')
        }
        navigate('/setup')
      })
      .catch((err) => setLoginError(err.response?.data?.error || 'Wrong credentials! Please check your email and password.'))
      .finally(() => setBusy(false))
  }

  function handleSignup(e) {
    e.preventDefault()
    setSuError('')
    if (!suName || !suEmail || !suPassword || !suConfirm) { setSuError('All fields are required.'); return }
    if (suPassword.length < 8) { setSuError('Password must be at least 8 characters.'); return }
    if (suPassword !== suConfirm) { setSuError('Passwords do not match.'); return }
    setSuBusy(true)
    apiSignup(suName, suEmail, suPassword)
      .then((data) => { localStorage.setItem('dojo_token', data.token); navigate('/setup') })
      .catch((err) => setSuError(err.response?.data?.error || 'Failed to create account.'))
      .finally(() => setSuBusy(false))
  }

  function handleForgot(e) {
    e.preventDefault()
    setFgError('')
    if (!fgEmail || !/\S+@\S+\.\S+/.test(fgEmail)) { setFgError('Please enter a valid email address.'); return }
    setFgBusy(true)
    apiForgotPassword(fgEmail)
      .then(() => setView('forgot-sent'))
      .catch((err) => setFgError(err.response?.data?.error || 'Something went wrong. Please try again.'))
      .finally(() => setFgBusy(false))
  }

  function handleGuest() {
    sessionStorage.setItem('dojo_guest', '1')
    navigate('/setup')
  }

  const pitch = (
    <div className="lp-pitch">
      <h1>Enter FoxVue. <span>Train with AI.</span></h1>
      <p>Practice interviews tailored to your target role. Get real-time voice transcription, STAR scoring, and actionable feedback.</p>
      <div className="lp-pitch__badges">
        <span>Voice-to-text</span>
        <span>STAR grading</span>
        <span>AI feedback</span>
        <span>BYOK-ready</span>
      </div>
    </div>
  )

  if (view === 'login') return (
    <div className="lp-page">
      <div className="lp-mesh" aria-hidden />
      <div className="lp-grid">
        {pitch}
        <div className="lp-card">
          <div className="lp-belt" aria-hidden />
          <Brand />
          <form onSubmit={handleLogin} noValidate>
            <div className="lp-field">
              <label htmlFor="lp-email">Email</label>
              <input id="lp-email" type="email" autoComplete="email"
                placeholder="you@example.com" value={email}
                onChange={e => { setEmail(e.target.value); setLoginError('') }} />
            </div>
            <div className="lp-field">
              <label htmlFor="lp-pw">Password</label>
              <input id="lp-pw" type="password" autoComplete="current-password"
                placeholder="••••••••" value={password}
                onChange={e => { setPassword(e.target.value); setLoginError('') }} />
            </div>
            <div className="lp-row">
              <label className="lp-remember">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember me
              </label>
              <button type="button" className="lp-link" onClick={() => setView('forgot')}>
                Forgot password?
              </button>
            </div>
            {loginError && <p className="lp-error">{loginError}</p>}
            <button className="lp-submit" type="submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <div className="lp-divider">or</div>
          <button type="button" className="lp-guest" onClick={handleGuest}>
            Try for free — no account needed
          </button>
          <p className="lp-switch">
            Don't have an account?{' '}
            <button type="button" className="lp-link" onClick={() => setView('signup')}>Create account</button>
          </p>
        </div>
      </div>
    </div>
  )

  if (view === 'signup') return (
    <div className="lp-page">
      <div className="lp-mesh" aria-hidden />
      <div className="lp-grid">
        {pitch}
        <div className="lp-card">
          <div className="lp-belt" aria-hidden />
          <Brand />
          <form onSubmit={handleSignup} noValidate>
            <div className="lp-field">
              <label htmlFor="su-name">Full Name</label>
              <input id="su-name" type="text" autoComplete="name"
                placeholder="Alex Johnson" value={suName}
                onChange={e => { setSuName(e.target.value); setSuError('') }} />
            </div>
            <div className="lp-field">
              <label htmlFor="su-email">Email</label>
              <input id="su-email" type="email" autoComplete="email"
                placeholder="you@example.com" value={suEmail}
                onChange={e => { setSuEmail(e.target.value); setSuError('') }} />
            </div>
            <div className="lp-field">
              <label htmlFor="su-pw">Password</label>
              <input id="su-pw" type="password" autoComplete="new-password"
                placeholder="Min. 8 characters" value={suPassword}
                onChange={e => { setSuPassword(e.target.value); setSuError('') }} />
            </div>
            <div className="lp-field">
              <label htmlFor="su-confirm">Confirm Password</label>
              <input id="su-confirm" type="password" autoComplete="new-password"
                placeholder="••••••••" value={suConfirm}
                onChange={e => { setSuConfirm(e.target.value); setSuError('') }} />
            </div>
            {suError && <p className="lp-error">{suError}</p>}
            <button className="lp-submit" type="submit" disabled={suBusy}>
              {suBusy ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <div className="lp-divider">or</div>
          <button type="button" className="lp-guest" onClick={handleGuest}>
            Try for free — no account needed
          </button>
          <p className="lp-switch">
            Already have an account?{' '}
            <button type="button" className="lp-link" onClick={() => setView('login')}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  )

  if (view === 'forgot') return (
    <div className="lp-page">
      <div className="lp-mesh" aria-hidden />
      <div className="lp-grid">
        {pitch}
        <div className="lp-card">
          <div className="lp-belt" aria-hidden />
          <Brand />
          <div className="lp-forgot-header">
            <div className="lp-forgot-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h3>Reset your password</h3>
              <p>Enter your email and we'll send you a reset link.</p>
            </div>
          </div>
          <form onSubmit={handleForgot} noValidate>
            <div className="lp-field">
              <label htmlFor="fg-email">Email address</label>
              <input id="fg-email" type="email" autoComplete="email"
                placeholder="you@example.com" value={fgEmail}
                onChange={e => { setFgEmail(e.target.value); setFgError('') }} autoFocus />
            </div>
            {fgError && <p className="lp-error">{fgError}</p>}
            <button className="lp-submit" type="submit" disabled={fgBusy}>
              {fgBusy ? <><span className="lp-spinner" />Sending…</> : 'Send reset link'}
            </button>
          </form>
          <p className="lp-switch" style={{ marginTop: '1.25rem' }}>
            <button type="button" className="lp-link lp-link--back" onClick={() => setView('login')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )

  if (view === 'forgot-sent') return (
    <div className="lp-page">
      <div className="lp-mesh" aria-hidden />
      <div className="lp-grid">
        {pitch}
        <div className="lp-card">
          <div className="lp-belt" aria-hidden />
          <Brand />
          <div className="lp-sent">
            <div className="lp-sent__icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3>Check your inbox</h3>
            <p>We sent a reset link to <strong>{fgEmail}</strong>. Check your spam folder if you don't see it.</p>
            <div className="lp-sent__actions">
              <button className="lp-submit" type="button" onClick={() => { setFgEmail(''); setView('forgot') }}>
                Try a different email
              </button>
              <button type="button" className="lp-guest" onClick={() => setView('login')}>
                Back to sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return null
}
