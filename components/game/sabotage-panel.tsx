"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Player } from "@/lib/types"

interface SabotagePanelProps {
  players: Player[]
  currentPlayerId: string | null
  cash: number
  onBlizzard: (targetId: string) => Promise<void>
}

const BLIZZARD_COST = 5000

export function SabotagePanel({ players, currentPlayerId, cash, onBlizzard }: SabotagePanelProps) {
  const [selectedTarget, setSelectedTarget] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const otherPlayers = players.filter((p) => p.id !== currentPlayerId && !p.isFrozen)
  const canAfford = cash >= BLIZZARD_COST

  const handleBlizzard = async () => {
    if (!selectedTarget || !canAfford || loading) return

    setLoading(true)
    try {
      await onBlizzard(selectedTarget)
      setSelectedTarget("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-[#1a1f2e]/80 backdrop-blur-xl border-ecell-blue/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-sm uppercase tracking-wider flex items-center gap-2">
          <span>⚡</span>
          Sabotage Shop
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-secondary/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-foreground">Hack Attack</span>
            <span className={`text-sm font-bold ${canAfford ? "text-ecell-success" : "text-ecell-danger"}`}>
              ₹{BLIZZARD_COST.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Freeze a competitor for 30 seconds!</p>

          <div className="flex gap-2">
            <Select value={selectedTarget} onValueChange={setSelectedTarget} disabled={!canAfford}>
              <SelectTrigger className="flex-1 bg-secondary border-border text-sm">
                <SelectValue placeholder="Select target..." />
              </SelectTrigger>
              <SelectContent>
                {otherPlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
                {otherPlayers.length === 0 && (
                  <SelectItem value="none" disabled>
                    No targets available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <Button
              onClick={handleBlizzard}
              disabled={!selectedTarget || !canAfford || loading}
              className="bg-ecell-purple/20 text-ecell-purple border border-ecell-purple hover:bg-ecell-purple/30 disabled:opacity-30"
            >
              {loading ? "..." : "⚡"}
            </Button>
          </div>
        </div>

        {!canAfford && (
          <p className="text-xs text-ecell-danger text-center">Need ₹{(BLIZZARD_COST - cash).toLocaleString()} more!</p>
        )}
      </CardContent>
    </Card>
  )
}
