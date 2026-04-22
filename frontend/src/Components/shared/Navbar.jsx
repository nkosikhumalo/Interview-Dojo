import { useNavigate, useLocation } from 'react-router-dom'
import '../../styles/Navbar.css'

const allLinks = [
  {
    path: '/setup',
    label: 'Setup',
    requiresAccount: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    path: '/interview',
    label: 'Interview',
    requiresAccount: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
      </svg>
    ),
  },
  {
    path: '/history',
    label: 'History',
    requiresAccount: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    path: '/api-providers',
    label: 'API Keys',
    requiresAccount: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
  },
  {
    path: '/pricing',
    label: 'Plans',
    requiresAccount: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
]

function isGuest() {
  return (
    Boolean(sessionStorage.getItem('dojo_guest')) &&
    !localStorage.getItem('dojo_token') &&
    !sessionStorage.getItem('dojo_token')
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const guest = isGuest()
  const links = allLinks.filter(l => !l.requiresAccount || !guest)

  function handleLogout() {
    sessionStorage.removeItem('dojo_guest')
    sessionStorage.removeItem('dojo_token')
    localStorage.removeItem('dojo_token')
    localStorage.removeItem('dojo_remembered_email')
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">

        <button className="navbar__brand" onClick={() => navigate('/setup')}>
          <img src="/favicon.png" alt="Interview Dojo" className="navbar__logo" />
          <span className="navbar__title">Interview Dojo</span>
        </button>

        <nav className="navbar__nav" aria-label="Main navigation">
          {links.map(({ path, label, icon }) => (
            <button
              key={path}
              className={`navbar__link${pathname === path ? ' navbar__link--active' : ''}`}
              onClick={() => navigate(path)}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="navbar__right">
          {guest && (
            <button className="navbar__signup-cta" onClick={() => navigate('/login')}>
              Sign up free
            </button>
          )}
          <button className="navbar__logout" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>{guest ? 'Exit' : 'Logout'}</span>
          </button>
        </div>

      </div>
    </header>
  )
}
