// History page — shows all answered questions and feedback for the current session.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterviewStore } from '../store/store'
import { fetchHistory } from '../services/api'
import Navbar from '../Components/shared/Navbar'
import { PrimaryButton } from '../Components/ui/inputs'
import { formatDateTime } from '../utils/DateFormatting'

export default function History() {
    const { state } = useInterviewStore()
    const navigate = useNavigate()
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!state.sessionId) return
        setLoading(true)
        fetchHistory(state.sessionId)
            .then(setSummary)
            .catch(() => setError('Could not load history.'))
            .finally(() => setLoading(false))
    }, [state.sessionId])

    if (!state.sessionId) {
        return (
            <div style={{ maxWidth: 960, margin: '0 auto', padding: 20 }}>
                <Navbar />
                <p>No active session. Start an interview first.</p>
                <PrimaryButton onClick={() => navigate('/setup')}>Go to Setup</PrimaryButton>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 20 }}>
            <Navbar title="Session History" />

            {loading && <p>Loading…</p>}
            {error && <p style={{ color: '#dc2626' }}>{error}</p>}

            {summary && (
                <>
                    <p style={{ color: 'var(--text)', marginBottom: 4 }}>
                        Session started: {formatDateTime(summary.createdAt)}
                    </p>
                    {summary.jobDescription && (
                        <details style={{ marginBottom: 20 }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Job description</summary>
                            <pre style={{ whiteSpace: 'pre-wrap', background: '#fafafa', border: '1px solid #eee', borderRadius: 10, padding: 12, marginTop: 8 }}>
                                {summary.jobDescription}
                            </pre>
                        </details>
                    )}

                    {summary.history.length === 0 ? (
                        <p>No answers submitted yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {summary.history.map((entry, i) => (
                                <div key={i} style={cardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                                        <span style={{ fontWeight: 700, fontSize: 15 }}>Q{i + 1}: {entry.question.text}</span>
                                        <span style={scoreBadge(entry.feedback.score)}>{entry.feedback.score}/100</span>
                                    </div>

                                    <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text)' }}>
                                        {formatDateTime(entry.answeredAt)} · {entry.question.category} · STAR: {entry.feedback.star}
                                    </div>

                                    <p style={{ marginTop: 10, lineHeight: 1.5 }}>{entry.feedback.summary}</p>

                                    {entry.transcript && (
                                        <details style={{ marginTop: 8 }}>
                                            <summary style={{ cursor: 'pointer', fontSize: 13 }}>Your answer</summary>
                                            <p style={{ marginTop: 6, fontStyle: 'italic', color: 'var(--text)' }}>{entry.transcript}</p>
                                        </details>
                                    )}

                                    {Object.keys(entry.feedback.fillerWords || {}).some(k => entry.feedback.fillerWords[k] > 0) && (
                                        <div style={{ marginTop: 8, fontSize: 13 }}>
                                            <strong>Filler words: </strong>
                                            {Object.entries(entry.feedback.fillerWords)
                                                .filter(([, v]) => v > 0)
                                                .map(([w, c]) => `${w} (${c})`)
                                                .join(', ')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                        <PrimaryButton onClick={() => navigate('/interview')}>Back to Interview</PrimaryButton>
                        <button type="button" onClick={() => navigate('/setup')} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #ddd', cursor: 'pointer' }}>
                            New Session
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

const cardStyle = {
    background: 'var(--code-bg)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 16,
}

function scoreBadge(score) {
    const color = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626'
    return {
        fontWeight: 700,
        fontSize: 14,
        color,
        background: color + '18',
        padding: '2px 10px',
        borderRadius: 999,
        border: `1px solid ${color}44`,
    }
}
