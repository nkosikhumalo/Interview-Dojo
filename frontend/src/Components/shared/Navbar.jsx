// Shared navigation bar.

import { useNavigate } from 'react-router-dom'

export default function Navbar({ title = 'Interview Dojo' }) {
  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem('dojo_guest')
    localStorage.removeItem('dojo_token')
    navigate('/login')
  }

  return (
    <header
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid #eee',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 22, cursor: 'pointer' }} onClick={() => navigate('/setup')}>
        {title}
      </h1>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button type="button" onClick={() => navigate('/setup')} style={navBtn}>Setup</button>
        <button type="button" onClick={() => navigate('/history')} style={navBtn}>History</button>
        <button type="button" onClick={handleLogout} style={{ ...navBtn, color: '#dc2626' }}>Logout</button>
      </nav>
    </header>
  )
}

const navBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--text-h)',
  padding: '4px 8px',
  borderRadius: 6,
}
