"use client"

import type { GameState } from "@/lib/types"

interface GameStatusBarProps {
  gameState: GameState
}

export function GameStatusBar({ gameState }: GameStatusBarProps) {
  const minutes = Math.floor(gameState.roundTimeRemaining / 60)
  const seconds = gameState.roundTimeRemaining % 60

  const statusColors: Record<string, string> = {
    lobby: "text-neon-blue",
    active: "text-neon-green",
    paused: "text-neon-red",
    ended: "text-neon-gold",
  }

  return (
    <div className="flex items-center justify-between bg-card/50 border border-border rounded-lg px-4 py-2">
      <div className="flex items-center gap-4">
        <div>
          <span className="text-xs text-muted-foreground mr-2">STATUS:</span>
          <span className={`font-bold uppercase ${statusColors[gameState.status] || "text-foreground"}`}>
            {gameState.status}
          </span>
        </div>
        <div className="border-l border-border pl-4">
          <span className="text-xs text-muted-foreground mr-2">ROUND:</span>
          <span className="font-bold text-ecell-orange">
            {gameState.currentRound}/3
          </span>
        </div>
      </div>

      <div className="text-right">
        <span className="text-xs text-muted-foreground mr-2">ROUND TIME:</span>
        <span
          className={`font-mono font-bold ${gameState.roundTimeRemaining < 60 ? "text-neon-red animate-pulse" : "text-foreground"}`}
        >
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}
