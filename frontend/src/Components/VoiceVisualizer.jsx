import { useEffect, useRef } from 'react'
import '../styles/VoiceVisualizer.css'

export default function VoiceVisualizer({ isActive = false }) {
    const barsRef = useRef([])
    const animRef = useRef(null)

    useEffect(() => {
        const bars = barsRef.current

        function animate() {
            bars.forEach((bar) => {
                if (!bar) return
                const height = isActive
                    ? 20 + Math.random() * 55
                    : 6 + Math.random() * 6
                bar.style.height = `${height}px`
            })
            animRef.current = setTimeout(animate, isActive ? 80 : 500)
        }

        animate()
        return () => clearTimeout(animRef.current)
    }, [isActive])

    return (
        <div className={`voice-viz${isActive ? ' voice-viz--active' : ''}`}>
            <div className="voice-viz__ring voice-viz__ring--outer" />
            <div className="voice-viz__ring voice-viz__ring--inner" />

            <div className="voice-viz__core">
                <div className="voice-viz__bars">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className="voice-viz__bar"
                            ref={(el) => { barsRef.current[i] = el }}
                        />
                    ))}
                </div>
            </div>

            <p className="voice-viz__label">
                {isActive ? 'Listening...' : 'Ready'}
            </p>
        </div>
    )
}
