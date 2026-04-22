// useMediaRecorder — browser-agnostic audio recording hook.
// Uses MediaRecorder API (supported in all modern browsers: Chrome, Firefox, Safari).
// Captures audio as a blob and calls onStop(blob) when recording ends.

import { useCallback, useRef, useState } from 'react'

export default function useMediaRecorder({ onStop } = {}) {
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])
    const streamRef = useRef(null)
    // Keep onStop ref fresh so the onstop handler always calls the latest version
    const onStopRef = useRef(onStop)
    onStopRef.current = onStop

    const [recording, setRecording] = useState(false)
    const [error, setError] = useState(null)

    function getBestMimeType() {
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/ogg;codecs=opus',
            'audio/ogg',
            'audio/mp4',
        ]
        for (const type of types) {
            if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) return type
        }
        return ''
    }

    const start = useCallback(async () => {
        setError(null)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            streamRef.current = stream
            chunksRef.current = []

            const mimeType = getBestMimeType()
            const options = mimeType ? { mimeType } : {}
            const recorder = new MediaRecorder(stream, options)
            mediaRecorderRef.current = recorder

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
            }

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' })
                chunksRef.current = []
                streamRef.current?.getTracks().forEach(t => t.stop())
                streamRef.current = null
                // Use ref so we always call the latest onStop without stale closure
                onStopRef.current?.(blob)
            }

            recorder.start(250)
            setRecording(true)
        } catch (err) {
            setError(
                err.name === 'NotAllowedError'
                    ? 'Microphone access denied. Please allow microphone access in your browser settings.'
                    : err.name === 'NotFoundError'
                        ? 'No microphone found. Please connect a microphone and try again.'
                        : `Could not start recording: ${err.message}`
            )
        }
    }, [])

    const stop = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
        }
        setRecording(false)
    }, [])

    return { recording, error, start, stop }
}
