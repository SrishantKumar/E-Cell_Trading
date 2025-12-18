"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { GameState, MarketState } from "@/lib/types"

const DEFAULT_GAME_STATE: GameState = {
  status: "lobby",
  timeRemaining: 900,
  currentRound: 1,
  roundTimeRemaining: 300,
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Calculate time remaining based on game start time
  const calculateTimeRemaining = useCallback((marketState: MarketState): number => {
    if (marketState.game_status !== "active" || !marketState.game_started_at) {
      return marketState.game_duration_seconds
    }
    const startTime = new Date(marketState.game_started_at).getTime()
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    return Math.max(0, marketState.game_duration_seconds - elapsed)
  }, [])

  // Calculate round time remaining
  const calculateRoundTimeRemaining = useCallback((marketState: MarketState): number => {
    if (marketState.game_status !== "active" || !marketState.round_started_at) {
      return marketState.round_duration_seconds || 300
    }
    const roundStartTime = new Date(marketState.round_started_at).getTime()
    const elapsed = Math.floor((Date.now() - roundStartTime) / 1000)
    return Math.max(0, (marketState.round_duration_seconds || 300) - elapsed)
  }, [])

  useEffect(() => {
    // Initial fetch
    const fetchGameState = async () => {
      const { data, error } = await supabase.from("market_state").select("*").eq("id", 1).single()

      if (error) {
        console.error("[v0] Error fetching game state:", error)
        setLoading(false)
        return
      }

      if (data) {
        setGameState({
          status: data.game_status,
          timeRemaining: calculateTimeRemaining(data as MarketState),
          currentRound: data.current_round || 1,
          roundTimeRemaining: calculateRoundTimeRemaining(data as MarketState),
        })
      }
      setLoading(false)
    }

    fetchGameState()

    // Subscribe to realtime changes with error handling
    const channel = supabase
      .channel("market_state_changes", {
        config: {
          broadcast: { self: true },
          presence: { key: "" },
        },
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "market_state" }, (payload) => {
        const data = payload.new as MarketState
        setGameState({
          status: data.game_status,
          timeRemaining: calculateTimeRemaining(data),
          currentRound: data.current_round || 1,
          roundTimeRemaining: calculateRoundTimeRemaining(data),
        })
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[GameState] Realtime connected")
        } else if (status === "CHANNEL_ERROR") {
          console.error("[GameState] Realtime error, reconnecting...")
          setTimeout(() => {
            channel.subscribe()
          }, 2000)
        } else if (status === "TIMED_OUT") {
          console.error("[GameState] Connection timed out, reconnecting...")
          setTimeout(() => {
            channel.subscribe()
          }, 2000)
        }
      })

    // Timer for countdown
    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.status === "active" && prev.timeRemaining > 0) {
          return { ...prev, timeRemaining: prev.timeRemaining - 1 }
        }
        return prev
      })
    }, 1000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(timer)
    }
  }, [supabase, calculateTimeRemaining, calculateRoundTimeRemaining])

  const updateGameState = useCallback(
    async (updates: Partial<{ status: GameState["status"] }>) => {
      const updateData: Record<string, unknown> = {
        game_status: updates.status,
        updated_at: new Date().toISOString(),
      }

      if (updates.status === "active") {
        updateData.game_started_at = new Date().toISOString()
      }

      const { error } = await supabase.from("market_state").update(updateData).eq("id", 1)

      if (error) {
        console.error("[v0] Error updating game state:", error)
      }
    },
    [supabase],
  )

  return { gameState, updateGameState, loading }
}
