"use client"

import type { Player } from "@/lib/types"

interface MiniLeaderboardProps {
  players: Player[]
  currentPlayerId: string | null
}

export function MiniLeaderboard({ players, currentPlayerId }: MiniLeaderboardProps) {
  const topPlayers = players.slice(0, 5)
  const currentPlayerRank = players.findIndex((p) => p.id === currentPlayerId) + 1

  return (
    <div className="bg-[#1a1f2e]/80 backdrop-blur-xl border border-ecell-blue/30 rounded-lg p-4">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Leaderboard</h3>

      <div className="space-y-2">
        {topPlayers.map((player, index) => {
          const isCurrentPlayer = player.id === currentPlayerId
          const rankColors = ["text-neon-gold", "text-muted-foreground", "text-orange-600"]

          return (
            <div
              key={player.id}
              className={`flex items-center justify-between py-1 px-2 rounded ${isCurrentPlayer ? "bg-neon-green/10 border border-neon-green/30" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-bold w-6 ${rankColors[index] || "text-muted-foreground"}`}>#{index + 1}</span>
                <span className={`text-sm ${isCurrentPlayer ? "text-neon-green font-bold" : "text-foreground"}`}>
                  {player.name}
                  {player.isFrozen && <span className="ml-1 text-neon-blue">❄</span>}
                </span>
              </div>
              <span className="text-sm font-mono text-muted-foreground">₹{player.netWorth.toFixed(0)}</span>
            </div>
          )
        })}
      </div>

      {currentPlayerRank > 5 && (
        <div className="mt-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between py-1 px-2 bg-neon-green/10 rounded border border-neon-green/30">
            <div className="flex items-center gap-2">
              <span className="font-bold w-6 text-muted-foreground">#{currentPlayerRank}</span>
              <span className="text-sm text-neon-green font-bold">You</span>
            </div>
            <span className="text-sm font-mono text-muted-foreground">
              ₹{players.find((p) => p.id === currentPlayerId)?.netWorth.toFixed(0)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
