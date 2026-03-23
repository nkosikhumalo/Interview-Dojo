// A React hook that integrates browser Web Speech API for voice-to-text.
// This powers the "talk to the AI" user experience by producing interim/final
// transcripts from live microphone input.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export default function useSpeechToText({ lang = 'en-US', onFinal } = {}) {
  const recognitionRef = useRef(null)
  const [supported, setSupported] = useState(true)
  const [listening, setListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')

  const SpeechRecognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null

  const canUse = useMemo(() => Boolean(SpeechRecognition), [SpeechRecognition])

  useEffect(() => {
    setSupported(canUse)
  }, [canUse])

  useEffect(() => {
    if (!canUse) return

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = lang
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onerror = () => {
      // Keeping this hook light: UI can display fallback behavior based on state.
      setListening(false)
    }

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result?.[0]?.transcript || ''
        if (result.isFinal) final += text
        else interim += text
      }

      const cleanedInterim = interim.trim()
      const cleanedFinal = final.trim()

      setInterimTranscript(cleanedInterim)

      if (cleanedFinal) {
        setFinalTranscript(cleanedFinal)
        setInterimTranscript('')
        if (typeof onFinal === 'function') onFinal(cleanedFinal)
      }
    }

    return () => {
      recognitionRef.current = null
      try {
        recognition.stop()
      } catch {
        // Ignore.
      }
    }
  }, [canUse, lang, onFinal])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      setFinalTranscript('')
      recognitionRef.current.start()
    } catch {
      // Can throw if start is called twice quickly.
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch {
      // Ignore.
    }
  }, [])

  return {
    supported,
    listening,
    interimTranscript,
    finalTranscript,
    startListening,
    stopListening,
  }
}

