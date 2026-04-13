// Login page for Interview Dojo — branded sign-in UI.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

export default function LoginPage({ onSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    if (typeof onSignIn === 'function') {
      Promise.resolve(onSignIn({ email, password }))
        .then(() => navigate('/setup'))
        .finally(() => setBusy(false))
      return
    }
    // Stub: store a token and proceed.
    localStorage.setItem('dojo_token', 'stub')
    navigate('/setup')
    setBusy(false)
  }

  function handleGuest() {
    sessionStorage.setItem('dojo_guest', '1')
    navigate('/setup')
  }

  return (
    <div className="login-page">
      <div className="login-page__mesh" aria-hidden />
      <div className="login-page__grid">
        <div className="login-page__pitch">
          <h1>
            Enter the Dojo.{' '}
            <span style={{ color: 'var(--accent)' }}>Train with AI.</span>
          </h1>
          <p>
            Sign in to sync your interview history, saved job descriptions, and
            personalized feedback across sessions.
          </p>
          <div className="login-page__badges">
            <span className="login-page__badge">Voice-to-text</span>
            <span className="login-page__badge">STAR grading</span>
            <span className="login-page__badge">BYOK-ready</span>
          </div>
        </div>

        <div className="login-page__card">
          <div className="login-page__belt" aria-hidden />
          <div className="login-page__brand">
            <img
              className="login-page__logo"
              src="/favicon.png"
              alt=""
              width={52}
              height={52}
            />
            <div className="login-page__brand-text">
              <h2>Interview Dojo</h2>
              <span>Master the art of the interview</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="login-page__field">
              <label className="login-page__label" htmlFor="dojo-email">
                Email
              </label>
              <input
                id="dojo-email"
                className="login-page__input"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="login-page__field">
              <label className="login-page__label" htmlFor="dojo-password">
                Password
              </label>
              <input
                id="dojo-password"
                className="login-page__input"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-page__row">
              <label className="login-page__remember">
                <input type="checkbox" name="remember" />
                Remember me
              </label>
              <a className="login-page__link" href="#forgot">
                Forgot password?
              </a>
            </div>

            <button
              className="login-page__submit"
              type="submit"
              disabled={busy}
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="login-page__divider">or</div>

          <button
            type="button"
            className="login-page__guest"
            onClick={handleGuest}
          >
            Continue without an account
          </button>
        </div>
      </div>
    </div>
  )
}
