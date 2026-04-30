import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiCheckCode, apiCompleteRegistration, apiResendVerification } from '../services/api'
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

const RESEND_COOLDOWN = 60

export default function VerifyEmail() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const email = searchParams.get('email') || ''

    // step: 'pin' | 'password'
    const [step, setStep] = useState('pin')

    // PIN
    const [digits, setDigits] = useState(['', '', '', '', '', ''])
    const [pinBusy, setPinBusy] = useState(false)
    const [pinError, setPinError] = useState('')
    const inputRefs = useRef([])

    // Password
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [pwBusy, setPwBusy] = useState(false)
    const [pwError, setPwError] = useState('')

    // Resend
    const [resendCooldown, setResendCooldown] = useState(0)
    const [resendMsg, setResendMsg] = useState('')

    useEffect(() => {
        if (!email) navigate('/login', { replace: true })
    }, [email, navigate])

    useEffect(() => {
        if (resendCooldown <= 0) return
        const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
        return () => clearTimeout(t)
    }, [resendCooldown])

    // ── PIN handlers ────────────────────────────────────────────────────────────

    function handleDigitChange(index, value) {
        const digit = value.replace(/\D/g, '').slice(-1)
        const next = [...digits]
        next[index] = digit
        setDigits(next)
        setPinError('')
        if (digit && index < 5) inputRefs.current[index + 1]?.focus()
    }

    function handleKeyDown(index, e) {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    function handlePaste(e) {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (!pasted) return
        const next = ['', '', '', '', '', '']
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
        setDigits(next)
        setPinError('')
        inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }

    function handlePinSubmit(e) {
        e.preventDefault()
        const code = digits.join('')
        if (code.length < 6) { setPinError('Please enter the full 6-digit code.'); return }
        setPinBusy(true)
        apiCheckCode(email, code)
            .then(() => setStep('password'))
            .catch((err) => {
                const msg = err.response?.data?.error || 'Incorrect code. Please try again.'
                const remaining = err.response?.data?.remaining
                setPinError(remaining !== undefined
                    ? `${msg} (${remaining} attempt${remaining !== 1 ? 's' : ''} left)`
                    : msg)
                setDigits(['', '', '', '', '', ''])
                inputRefs.current[0]?.focus()
            })
            .finally(() => setPinBusy(false))
    }

    // ── Password handlers ───────────────────────────────────────────────────────

    function handlePasswordSubmit(e) {
        e.preventDefault()
        setPwError('')
        if (!passwordValid(password)) { setPwError('Password does not meet the requirements below.'); return }
        if (password !== confirm) { setPwError('Passwords do not match.'); return }
        setPwBusy(true)
        apiCompleteRegistration(email, password)
            .then((data) => {
                localStorage.setItem('dojo_token', data.token)
                navigate('/setup', { replace: true })
            })
            .catch((err) => setPwError(err.response?.data?.error || 'Failed to create account. Please try again.'))
            .finally(() => setPwBusy(false))
    }

    // ── Resend ──────────────────────────────────────────────────────────────────

    function handleResend() {
        if (resendCooldown > 0) return
        setResendMsg('')
        setPinError('')
        apiResendVerification(email)
            .then(() => {
                setResendMsg('A new code has been sent.')
                setResendCooldown(RESEND_COOLDOWN)
                setDigits(['', '', '', '', '', ''])
                setStep('pin')
                inputRefs.current[0]?.focus()
            })
            .catch((err) => setPinError(err.response?.data?.error || 'Failed to resend. Please try again.'))
    }

    const pitch = (
        <div className="lp-pitch">
            <h1>Enter FoxVue. <span>Train with AI.</span></h1>
            <p>Practice interviews tailored to your target role. Get real-time voice transcription, STAR scoring, and actionable feedback.</p>
            <div className="lp-pitch__badges">
                <span>Voice-to-text</span><span>STAR grading</span><span>AI feedback</span><span>BYOK-ready</span>
            </div>
        </div>
    )

    // ── Step 1: PIN ─────────────────────────────────────────────────────────────

    if (step === 'pin') return (
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
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <div>
                            <h3>Enter your verification code</h3>
                            <p>Sent to <strong>{email}</strong></p>
                        </div>
                    </div>

                    <form onSubmit={handlePinSubmit} noValidate>
                        <div className="ve-digits" onPaste={handlePaste}>
                            {digits.map((d, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputRefs.current[i] = el)}
                                    className="ve-digit"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={d}
                                    autoFocus={i === 0}
                                    disabled={pinBusy}
                                    onChange={(e) => handleDigitChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    aria-label={`Digit ${i + 1}`}
                                />
                            ))}
                        </div>
                        {pinError && <p className="lp-error">{pinError}</p>}
                        {resendMsg && <p className="lp-success">{resendMsg}</p>}
                        <button className="lp-submit" type="submit"
                            disabled={pinBusy || digits.join('').length < 6}>
                            {pinBusy ? <><span className="lp-spinner" />Verifying…</> : 'Verify code'}
                        </button>
                    </form>

                    <p className="lp-switch" style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                        Didn't receive it?{' '}
                        <button type="button" className="lp-link" onClick={handleResend} disabled={resendCooldown > 0}>
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                        </button>
                    </p>
                    <p className="lp-switch" style={{ textAlign: 'center' }}>
                        <button type="button" className="lp-link lp-link--back" onClick={() => navigate('/login')}>
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

    // ── Step 2: Create password ─────────────────────────────────────────────────

    return (
        <div className="lp-page">
            <div className="lp-mesh" aria-hidden />
            <div className="lp-grid">
                {pitch}
                <div className="lp-card">
                    <div className="lp-belt" aria-hidden />
                    <Brand />
                    <div className="lp-forgot-header">
                        <div className="lp-forgot-icon" style={{ color: '#4ade80' }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <div>
                            <h3>Create your password</h3>
                            <p>Email verified — set a strong password to finish.</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit} noValidate>
                        <div className="lp-field">
                            <label htmlFor="ve-pw">Password</label>
                            <input id="ve-pw" type="password" autoComplete="new-password"
                                placeholder="Min. 8 chars, uppercase, number, symbol"
                                value={password} autoFocus
                                onChange={e => { setPassword(e.target.value); setPwError('') }} />
                        </div>
                        <PasswordStrength password={password} />
                        <div className="lp-field">
                            <label htmlFor="ve-confirm">Confirm Password</label>
                            <input id="ve-confirm" type="password" autoComplete="new-password"
                                placeholder="••••••••" value={confirm}
                                onChange={e => { setConfirm(e.target.value); setPwError('') }} />
                        </div>
                        {pwError && <p className="lp-error">{pwError}</p>}
                        <button className="lp-submit" type="submit"
                            disabled={pwBusy || !passwordValid(password) || password !== confirm}>
                            {pwBusy ? <><span className="lp-spinner" />Creating account…</> : 'Create account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
