// Shared navigation UI (Navbar, etc.).
// Keep this file focused on layout components, not interview logic.

export default function Navbar({ title = 'Interview Dojo' }) {
  return (
    <header
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid #eee',
        marginBottom: 24,
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
      </div>
    </header>
  )
}
