// Root React app for the Dojo interview project.
// Switches between Setup and Interview views based on global session state.

import { InterviewProvider, useInterviewStore } from './store/store'
import Setup from './Pages/Setup'
import Interview from './Pages/Interview'

function AppInner() {
  const { state } = useInterviewStore()
  return state.status === 'interview' ? <Interview /> : <Setup />
}

export default function App() {
  return (
    <InterviewProvider>
      <AppInner />
    </InterviewProvider>
  )
}