import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiLogin, apiSignup } from '../services/api'
import './LoginPage.css'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// ── Social provider buttons config ──────────────────────────────────────────
const PROVIDERS = [
  {
    id: 'google',
    label: 'Continue with Google',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
  {
    id: 'microsoft',
    label: 'Continue with Microsoft',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <rect x="1" y="1" width="10" height="10" fill="#F25022" />
        <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
        <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
        <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
      </svg>
    ),
  },
]

// ── Shared brand header ──────────────────────────────────────────────────────
function Brand() {
  return (
    <div className="lp-brand">
      <img className="lp-logo" src="/favicon.png" alt="" width={48} height={48} />
      <div>
        <h2 className="lp-brand__name">Interview Dojo</h2>
        <span className="lp-brand__sub">Master the art of the interview</span>
      </div>
    </div>
  )
}

// ── Social buttons ───────────────────────────────────────────────────────────
function SocialButtons() {
  function handleProvider(id) {
    // Redirect to backend OAuth handler — it will redirect to the provider
    // and then back to /auth/callback with a JWT token.
    window.location.href = `${API}/auth/${id}`
  }
  return (
    <div className="lp-social">
      {PROVIDERS.map(p => (
        <button key={p.id} type="button" className="lp-social__btn" onClick={() => handleProvider(p.id)}>
          {p.icon}
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function LoginPage({ onSignIn }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // view: 'login' | 'signup' | 'forgot' | 'forgot-sent'
  const [view, setView] = useState('login')

  // login fields
  const [email, setEmail] = useState(() => localStorage.getItem('dojo_remembered_email') || '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem('dojo_remembered_email')))
  const [busy, setBusy] = useState(false)
  const [loginError, setLoginError] = useState(searchParams.get('error') || '')

  // signup fields
  const [suName, setSuName] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suConfirm, setSuConfirm] = useState('')
  const [suBusy, setSuBusy] = useState(false)
  const [suError, setSuError] = useState('')

  // forgot fields
  const [fgEmail, setFgEmail] = useState('')
  const [fgBusy, setFgBusy] = useState(false)
  const [fgError, setFgError] = useState('')

  // ── handlers ──
  function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    if (!email || !password) { setLoginError('Please fill in all fields.'); return }
    setBusy(true)
    apiLogin(email, password)
      .then((data) => {
        // Remember me: persist token + email so next visit auto-fills
        if (remember) {
          localStorage.setItem('dojo_token', data.token)
          localStorage.setItem('dojo_remembered_email', email)
        } else {
          // Not remembered: use sessionStorage so it clears when browser closes
          sessionStorage.setItem('dojo_token', data.token)
          localStorage.removeItem('dojo_token')
          localStorage.removeItem('dojo_remembered_email')
        }
        navigate('/setup')
      })
      .catch((err) => {
        setLoginError(err.response?.data?.error || 'Invalid email or password.')
      })
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
      .then((data) => {
        localStorage.setItem('dojo_token', data.token)
        navigate('/setup')
      })
      .catch((err) => {
        setSuError(err.response?.data?.error || 'Failed to create account.')
      })
      .finally(() => setSuBusy(false))
  }

  function handleForgot(e) {
    e.preventDefault()
    setFgError('')
    if (!fgEmail || !/\S+@\S+\.\S+/.test(fgEmail)) { setFgError('Please enter a valid email address.'); return }
    setFgBusy(true)
    // Stub — wire real password reset API here
    setTimeout(() => {
      setFgBusy(false)
      setView('forgot-sent')
    }, 900)
  }

  function handleGuest() {
    sessionStorage.setItem('dojo_guest', '1')
    navigate('/setup')
  }

  // ── pitch sidebar ──
  const pitch = (
    <div className="lp-pitch">
      <h1>
        Enter the Dojo.{' '}
        <span style={{ color: 'var(--accent)' }}>Train with AI.</span>
      </h1>
      <p>
        Practice interviews tailored to your target role. Get real-time voice
        transcription, STAR scoring, and actionable feedback — all in one place.
      </p>
      <div className="lp-pitch__badges">
        <span>Voice-to-text</span>
        <span>STAR grading</span>
        <span>AI feedback</span>
        <span>BYOK-ready</span>
      </div>
    </div>
  )

  // ── LOGIN view ──────────────────────────────────────────────────────────────
  if (view === 'login') return (
    <div className="lp-page">
      <div className="lp-mesh" aria-hidden />
      <div className="lp-grid">
        {pitch}
        <div className="lp-card">
          <div className="lp-belt" aria-hidden />
          <Brand />

          <SocialButtons action="Sign in" />
          <div className="lp-divider">or sign in with email</div>

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
            <button type="button" className="lp-link" onClick={() => setView('signup')}>
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  )

  // ── SIGNUP view ─────────────────────────────────────────────────────────────
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

          <p className="lp-switch">
            Already have an account?{' '}
            <button type="button" className="lp-link" onClick={() => setView('login')}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )

  // ── FORGOT PASSWORD view ────────────────────────────────────────────────────
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                onChange={e => { setFgEmail(e.target.value); setFgError('') }}
                autoFocus />
            </div>

            {fgError && <p className="lp-error">{fgError}</p>}

            <button className="lp-submit" type="submit" disabled={fgBusy}>
              {fgBusy
                ? <><span className="lp-spinner" />Sending reset link…</>
                : 'Send reset link'
              }
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

  // ── FORGOT SENT view ────────────────────────────────────────────────────────
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
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3>Check your inbox</h3>
            <p>
              We sent a password reset link to{' '}
              <strong>{fgEmail}</strong>.
              Check your spam folder if you don't see it within a minute.
            </p>
            <div className="lp-sent__actions">
              <button className="lp-submit" type="button"
                onClick={() => { setFgEmail(''); setView('forgot') }}>
                Try a different email
              </button>
              <button type="button" className="lp-guest"
                onClick={() => setView('login')}>
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
