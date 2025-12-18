"use client"

import { useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { MarketState, MarketTrend } from "@/lib/types"

interface UseGameLoopProps {
  isAdmin: boolean
  onTick?: (price: number) => void
}

export function useGameLoop({ isAdmin, onTick }: UseGameLoopProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const tickCountRef = useRef(0)
  const crashTurnsRef = useRef(0)
  const supabase = createClient()

  const calculateNewPrice = useCallback(async () => {
    // Fetch current market state
    const { data: marketData, error: marketError } = await supabase
      .from("market_state")
      .select("*")
      .eq("id", 1)
      .single()

    if (marketError || !marketData) {
      console.error("[v0] Error fetching market state:", marketError)
      return
    }

    const market = marketData as MarketState

    if (market.game_status !== "active") return

    let volatility = 0.05
    let bias = 0

    // Adjust based on market trend - MUCH STRONGER EFFECTS
    if (crashTurnsRef.current > 0) {
      // Triggered crash - MASSIVE drop (15-20% per tick)
      bias = -0.18
      volatility = 0.02
      crashTurnsRef.current -= 1
    } else if (market.market_trend === "crash") {
      // Natural crash - very strong drop (12-15% per tick)
      bias = -0.14
      volatility = 0.03
    } else if (market.market_trend === "bull") {
      // Bull market - moderate gains (3-5% per tick)
      bias = 0.04
      volatility = 0.02
    } else if (market.market_trend === "bear") {
      // Bear market - strong drop (8-12% per tick)
      bias = -0.10
      volatility = 0.03
    } else if (market.market_trend === "spike") {
      // Spike - strong gains (10-15% per tick)
      bias = 0.12
      volatility = 0.04
    }

    // Calculate price change
    const currentPrice = Number(market.current_price)
    const randomFactor = (Math.random() - 0.5) * 2 * volatility
    const priceChange = currentPrice * (randomFactor + bias)
    const newPrice = Math.max(1, Math.round((currentPrice + priceChange) * 100) / 100)

    tickCountRef.current += 1

    const priceHistory = Array.isArray(market.price_history) ? market.price_history : []
    const newPricePoint = { time: tickCountRef.current, price: newPrice }
    const updatedHistory = [...priceHistory, newPricePoint].slice(-50)

    // Determine new trend
    let newTrend: MarketTrend = market.market_trend
    if (crashTurnsRef.current <= 0 && market.market_trend === "crash") {
      newTrend = "bull"
    }

    // Update market
    const { error: updateError } = await supabase
      .from("market_state")
      .update({
        current_price: newPrice,
        price_history: updatedHistory,
        market_trend: newTrend,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)

    if (updateError) {
      console.error("[v0] Error updating market:", updateError)
    }

    // Update all team net worths
    const { data: teams } = await supabase.from("teams").select("*")
    if (teams) {
      for (const team of teams) {
        const netWorth = Number(team.cash) + team.shares_owned * newPrice
        await supabase.from("teams").update({ net_worth: netWorth }).eq("id", team.id)

        // Check if player should be unfrozen
        if (team.is_frozen && team.frozen_until) {
          const frozenUntilTime = new Date(team.frozen_until).getTime()
          if (frozenUntilTime < Date.now()) {
            console.log(`[GameLoop] Unfreezing player ${team.name} (${team.id})`)
            await supabase
              .from("teams")
              .update({ is_frozen: false, frozen_until: null })
              .eq("id", team.id)
          }
        }
      }
    }

    // Check for round end
    if (market.round_started_at && market.current_round) {
      const roundStartTime = new Date(market.round_started_at).getTime()
      const roundElapsed = Math.floor((Date.now() - roundStartTime) / 1000)
      const roundDuration = market.round_duration_seconds || 300

      if (roundElapsed >= roundDuration && market.game_status === "active") {
        console.log(`[GameLoop] Round ${market.current_round} ended`)

        if (market.current_round < 3) {
          // Pause for next round
          await supabase.from("market_state").update({
            game_status: "paused"
          }).eq("id", 1)
        } else {
          // Game ended after round 3
          await supabase.from("market_state").update({
            game_status: "ended"
          }).eq("id", 1)
        }
      }
    }

    // Check for total game end (fallback)
    if (market.game_started_at) {
      const startTime = new Date(market.game_started_at).getTime()
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      if (elapsed >= market.game_duration_seconds) {
        await supabase.from("market_state").update({ game_status: "ended" }).eq("id", 1)
      }
    }

    onTick?.(newPrice)
  }, [supabase, onTick])

  const startGameLoop = useCallback(() => {
    if (!isAdmin || intervalRef.current) return

    intervalRef.current = setInterval(calculateNewPrice, 2000)
  }, [isAdmin, calculateNewPrice])

  const stopGameLoop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const triggerCrash = useCallback(() => {
    crashTurnsRef.current = 5
  }, [])

  useEffect(() => {
    return () => stopGameLoop()
  }, [stopGameLoop])

  return { startGameLoop, stopGameLoop, triggerCrash }
}
