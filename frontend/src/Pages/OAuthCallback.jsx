// Handles the redirect back from the backend after OAuth.
// The backend sends: /auth/callback?token=JWT&name=DisplayName
// We store the token and navigate to /setup.

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OAuthCallback() {
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        const error = params.get('error')

        if (token) {
            localStorage.setItem('dojo_token', token)
            navigate('/setup', { replace: true })
        } else {
            const msg = error ? `OAuth error: ${error.replace(/_/g, ' ')}` : 'Sign-in failed.'
            navigate(`/login?error=${encodeURIComponent(msg)}`, { replace: true })
        }
    }, [navigate])

    return (
        <div style={{
            minHeight: '100svh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
            color: 'var(--text)',
        }}>
            <div style={{
                width: 40, height: 40,
                border: '3px solid var(--border)',
                borderTopColor: 'var(--accent)',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
            }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Completing sign-in…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
