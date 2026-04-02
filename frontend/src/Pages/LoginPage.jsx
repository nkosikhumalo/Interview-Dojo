// Login page for Interview Dojo — branded sign-in UI.
// Wire `onSignIn` / `onGuestContinue` from the router or parent when auth exists.

import { useState } from 'react'
import './LoginPage.css'

export default function LoginPage({
  onSignIn,
  onGuestContinue,
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (typeof onSignIn === 'function') {
      setBusy(true)
      Promise.resolve(onSignIn({ email, password })).finally(() => setBusy(false))
      return
    }
    setBusy(true)
    window.setTimeout(() => setBusy(false), 600)
  }

  function handleGuest() {
    if (typeof onGuestContinue === 'function') onGuestContinue()
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

          <p className="login-page__footer">
            No backend auth yet — this screen is ready for your API. Hook up{' '}
            <code style={{ fontSize: '0.85em' }}>onSignIn</code> when you ship
            it.
          </p>
        </div>
      </div>
    </div>
  )
}
