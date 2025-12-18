"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GameState } from "@/lib/types"

interface GameControlsProps {
  gameState: GameState
  onStartGame: () => void
  onPauseGame: () => void
  onResetGame: () => void
  onNextRound?: () => void
  isLoopRunning: boolean
}

export function GameControls({ gameState, onStartGame, onPauseGame, onResetGame, onNextRound, isLoopRunning }: GameControlsProps) {
  const roundMinutes = Math.floor(gameState.roundTimeRemaining / 60)
  const roundSeconds = gameState.roundTimeRemaining % 60

  return (
    <Card className="bg-[#1a1f2e]/80 backdrop-blur-xl border-ecell-blue/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-xl">🎮</span>
          Game Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Indicator */}
        <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
          <span className="text-sm text-muted-foreground">Game Status</span>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${gameState.status === "active"
                ? "bg-neon-green animate-pulse"
                : gameState.status === "paused" || gameState.status === "ended"
                  ? "bg-neon-red"
                  : "bg-neon-blue"
                }`}
            />
            <span className="font-bold text-foreground uppercase">{gameState.status}</span>
          </div>
        </div>

        {/* Round Indicator */}
        <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
          <span className="text-sm text-muted-foreground">Current Round</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-ecell-orange text-lg">
              Round {gameState.currentRound} / 3
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {gameState.status !== "active" ? (
            <Button
              onClick={onStartGame}
              className="bg-neon-green/20 text-neon-green border border-neon-green hover:bg-neon-green/30 glow-green"
            >
              {gameState.status === "lobby" ? "Start Game" : "Resume"}
            </Button>
          ) : (
            <Button
              onClick={onPauseGame}
              className="bg-neon-gold/20 text-neon-gold border border-neon-gold hover:bg-neon-gold/30"
            >
              Pause Game
            </Button>
          )}

          <Button
            onClick={onResetGame}
            variant="outline"
            className="border-neon-red/50 text-neon-red hover:bg-neon-red/10 bg-transparent"
          >
            Reset Game
          </Button>
        </div>

        {/* Next Round Button */}
        {gameState.currentRound < 3 && gameState.status === "paused" && onNextRound && (
          <Button
            onClick={onNextRound}
            className="w-full bg-ecell-orange/20 text-ecell-orange border border-ecell-orange hover:bg-ecell-orange/30"
          >
            Start Round {gameState.currentRound + 1}
          </Button>
        )}

        {/* Timer Info */}
        <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Round Time Remaining</span>
            <span className="font-mono font-bold text-foreground">
              {roundMinutes}:{roundSeconds.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Time Remaining</span>
            <span className="font-mono font-bold text-foreground">
              {Math.floor(gameState.timeRemaining / 60)}:{(gameState.timeRemaining % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Game Loop</span>
            <span className={`font-bold ${isLoopRunning ? "text-neon-green" : "text-muted-foreground"}`}>
              {isLoopRunning ? "Running" : "Stopped"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
