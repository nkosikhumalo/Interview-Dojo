// Login page placeholder.
// The current Dojo scaffold does not require authentication, but the login
// page is kept to support future "user profiles" and session history.

import Navbar from '../Components/shared/Navbar'

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 20 }}>
      <Navbar title="Login" />
      <p>Authentication is not implemented in this scaffold yet.</p>
    </div>
  )
}

