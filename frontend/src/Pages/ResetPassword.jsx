import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiResetPassword } from '../services/api'
import '../Pages/LoginPage.css'

function PasswordStrength({ password }) {
    const checks = [
        { label: 'At least 8 characters', ok: password.length >= 8 },
        { label: 'One uppercase letter', ok: /[A-Z]/.test(password) },
        { label: 'One number', ok: /[0-9]/.test(password) },
        { label: 'One symbol (!@#$…)', ok: /[^A-Za-z0-9]/.test(password) },
    ]
    if (!password) return null
    return (
        <ul className="ve-strength">
            {checks.map((c) => (
                <li key={c.label} className={c.ok ? 've-strength--ok' : 've-strength--fail'}>
                    <span>{c.ok ? '✓' : '✗'}</span> {c.label}
                </li>
            ))}
        </ul>
    )
}

function passwordValid(pw) {
    return pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)
}

export default function ResetPassword() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') || ''

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        setError('')
        if (!token) { setError('Invalid or missing reset token.'); return }
        if (!passwordValid(password)) { setError('Password does not meet the requirements.'); return }
        if (password !== confirm) { setError('Passwords do not match.'); return }

        setBusy(true)
        apiResetPassword(token, password)
            .then(() => setDone(true))
            .catch((err) => setError(err.response?.data?.error || 'Reset failed. The link may have expired.'))
            .finally(() => setBusy(false))
    }

    return (
        <div className="lp-page">
            <div className="lp-mesh" aria-hidden />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, margin: 'auto' }}>
                <div className="lp-card">
                    <div className="lp-belt" aria-hidden />

                    <div className="lp-brand">
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--blue-dim)', border: '1px solid var(--blue-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)', flexShrink: 0 }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="lp-brand__name">FoxVue</h2>
                            <span className="lp-brand__sub">Set a new password</span>
                        </div>
                    </div>

                    {done ? (
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--green)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-h)' }}>Password updated</h3>
                            <p style={{ margin: '0 0 1.5rem', color: 'var(--text)', fontSize: '0.92rem' }}>
                                Your password has been changed. You can now sign in.
                            </p>
                            <button className="lp-submit" onClick={() => navigate('/login')}>
                                Go to Sign In
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>
                            {!token && (
                                <p className="lp-error">No reset token found. Please use the link from your email.</p>
                            )}

                            <div className="lp-field">
                                <label htmlFor="rp-pw">New Password</label>
                                <input
                                    id="rp-pw"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Min. 8 chars, uppercase, number, symbol"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError('') }}
                                />
                            </div>
                            <PasswordStrength password={password} />

                            <div className="lp-field">
                                <label htmlFor="rp-confirm">Confirm Password</label>
                                <input
                                    id="rp-confirm"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Repeat your new password"
                                    value={confirm}
                                    onChange={e => { setConfirm(e.target.value); setError('') }}
                                />
                            </div>

                            {error && <p className="lp-error">{error}</p>}

                            <button className="lp-submit" type="submit" disabled={busy || !token || !passwordValid(password) || password !== confirm}>
                                {busy ? <><span className="lp-spinner" />Updating...</> : 'Set New Password'}
                            </button>

                            <p className="lp-switch" style={{ marginTop: '1rem' }}>
                                <button type="button" className="lp-link lp-link--back" onClick={() => navigate('/login')}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                    Back to sign in
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
