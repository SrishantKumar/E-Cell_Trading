"use client"

import { useEffect, useState } from "react"

interface FrozenOverlayProps {
  isFrozen: boolean
  frozenUntil: number
}

export function FrozenOverlay({ isFrozen, frozenUntil }: FrozenOverlayProps) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (!isFrozen) return

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((frozenUntil - Date.now()) / 1000))
      setTimeLeft(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 100)

    return () => clearInterval(interval)
  }, [isFrozen, frozenUntil])

  if (!isFrozen || timeLeft <= 0) return null

  return (
    <div className="fixed inset-0 z-40 pointer-events-auto">
      {/* Tech overlay */}
      <div className="absolute inset-0 bg-ecell-purple/20 backdrop-blur-sm" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Lightning bolts */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl animate-pulse text-ecell-purple"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 1}s`,
            }}
          >
            ⚡
          </div>
        ))}
      </div>

      {/* Frozen message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-card/90 border-2 border-ecell-purple rounded-lg p-8 shadow-2xl">
          <div className="text-6xl mb-4 animate-pulse">⚡</div>
          <h2 className="text-4xl font-bold text-ecell-purple mb-2">HACKED!</h2>
          <p className="text-xl text-foreground">You've been frozen by a competitor!</p>
          <p className="text-5xl font-mono font-bold text-ecell-purple mt-4">{timeLeft}s</p>
        </div>
      </div>
    </div>
  )
}
