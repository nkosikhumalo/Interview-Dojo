// A standalone component that handles a countdown timer.

import { useEffect, useState } from 'react'

export default function Timer({ seconds = 60, running = false, onDone }) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (!running) return
    setRemaining(seconds)

    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id)
          if (typeof onDone === 'function') onDone()
          return 0
        }
        return r - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [running, seconds, onDone])

  return (
    <div style={{ fontWeight: 700 }}>
      Time: {remaining}s
    </div>
  )
}