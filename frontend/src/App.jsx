// Root React app for the Dojo interview project.
// Uses React Router to handle login, setup, and interview views.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { InterviewProvider } from './store/store'
import LoginPage from './Pages/LoginPage'
import Setup from './Pages/Setup'
import Interview from './Pages/Interview'
import History from './Pages/History'

function PrivateRoute({ children }) {
  const isLoggedIn = Boolean(sessionStorage.getItem('dojo_guest') || localStorage.getItem('dojo_token'))
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <InterviewProvider>
        <Routes>
          <Route path="/login" element={<LoginPage onGuestContinue={() => {
            sessionStorage.setItem('dojo_guest', '1')
            window.location.href = '/setup'
          }} />} />
          <Route path="/setup" element={<PrivateRoute><Setup /></PrivateRoute>} />
          <Route path="/interview" element={<PrivateRoute><Interview /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </InterviewProvider>
    </BrowserRouter>
  )
}
