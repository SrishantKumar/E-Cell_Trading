"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Player } from "@/lib/types"

interface LiveLeaderboardProps {
  players: Player[]
  onFreezePlayer: (playerId: string) => void
}

interface RankedPlayer extends Player {
  previousRank: number
  currentRank: number
}

export function LiveLeaderboard({ players, onFreezePlayer }: LiveLeaderboardProps) {
  const [rankedPlayers, setRankedPlayers] = useState<RankedPlayer[]>([])

  useEffect(() => {
    setRankedPlayers((prev) => {
      const prevRanks = new Map(prev.map((p) => [p.id, p.currentRank]))

      return players.map((player, index) => ({
        ...player,
        previousRank: prevRanks.get(player.id) ?? index + 1,
        currentRank: index + 1,
      }))
    })
  }, [players])

  const getRankChange = (player: RankedPlayer) => {
    const change = player.previousRank - player.currentRank
    if (change > 0) return { icon: "▲", color: "text-neon-green", change }
    if (change < 0) return { icon: "▼", color: "text-neon-red", change: Math.abs(change) }
    return { icon: "—", color: "text-muted-foreground", change: 0 }
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "text-neon-gold"
    if (rank === 2) return "text-gray-300"
    if (rank === 3) return "text-orange-600"
    return "text-muted-foreground"
  }

  return (
    <Card className="bg-[#1a1f2e]/80 backdrop-blur-xl border-ecell-blue/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            Live Leaderboard
          </span>
          <span className="text-sm text-white/50">{players.length} players</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {rankedPlayers.map((player) => {
            const rankChange = getRankChange(player)
            const profit = player.netWorth - 10000
            const isProfit = profit >= 0

            return (
              <div
                key={player.id}
                className="flex items-center justify-between bg-secondary/30 rounded-lg p-3 transition-all duration-500"
                style={{
                  transform: `translateY(0)`,
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="flex items-center gap-1 w-16">
                    <span className={`font-bold text-lg ${getMedalColor(player.currentRank)}`}>
                      #{player.currentRank}
                    </span>
                    <span className={`text-xs ${rankChange.color}`}>
                      {rankChange.icon}
                      {rankChange.change > 0 && rankChange.change}
                    </span>
                  </div>

                  {/* Player Info */}
                  <div>
                    <p className="font-bold text-foreground flex items-center gap-2">
                      {player.name}
                      {player.isFrozen && <span className="text-neon-blue text-sm">❄ Frozen</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cash: ₹{player.cash.toFixed(0)} | Stocks: {player.stocks}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Net Worth */}
                  <div className="text-right">
                    <p className={`font-bold text-lg ${isProfit ? "text-neon-green" : "text-neon-red"}`}>
                      ₹{player.netWorth.toFixed(0)}
                    </p>
                    <p className={`text-xs ${isProfit ? "text-neon-green/70" : "text-neon-red/70"}`}>
                      {isProfit ? "+" : ""}
                      {((profit / 10000) * 100).toFixed(1)}%
                    </p>
                  </div>

                  {/* Freeze Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFreezePlayer(player.id)}
                    disabled={player.isFrozen}
                    className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 disabled:opacity-30"
                  >
                    ❄
                  </Button>
                </div>
              </div>
            )
          })}

          {players.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No players have joined yet...</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
