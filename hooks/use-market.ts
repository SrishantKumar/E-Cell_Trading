"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Market, MarketState, PricePoint, MarketTrend } from "@/lib/types"

const DEFAULT_MARKET: Market = {
  currentPrice: 100,
  priceHistory: [{ time: 0, price: 100 }],
  marketTrend: "bull",
  crashTurnsRemaining: 0,
}

export function useMarket() {
  const [market, setMarket] = useState<Market>(DEFAULT_MARKET)
  const [loading, setLoading] = useState(true)
  const [crashTurns, setCrashTurns] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchMarket = async () => {
      const { data, error } = await supabase.from("market_state").select("*").eq("id", 1).single()

      if (error) {
        console.error("[v0] Error fetching market:", error)
        setLoading(false)
        return
      }

      if (data) {
        const priceHistory = Array.isArray(data.price_history) ? data.price_history : []
        setMarket({
          currentPrice: Number(data.current_price),
          priceHistory: priceHistory as PricePoint[],
          marketTrend: data.market_trend as MarketTrend,
          crashTurnsRemaining: crashTurns,
        })
      }
      setLoading(false)
    }

    fetchMarket()

    // Subscribe to realtime changes with error handling and reconnection
    const channel = supabase
      .channel("market_changes", {
        config: {
          broadcast: { self: true },
          presence: { key: "" },
        },
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "market_state" }, (payload) => {
        const data = payload.new as MarketState
        const priceHistory = Array.isArray(data.price_history) ? data.price_history : []
        setMarket((prev) => ({
          currentPrice: Number(data.current_price),
          priceHistory: priceHistory as PricePoint[],
          marketTrend: data.market_trend as MarketTrend,
          crashTurnsRemaining: prev.crashTurnsRemaining,
        }))
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[Market] Realtime connected")
        } else if (status === "CHANNEL_ERROR") {
          console.error("[Market] Realtime error, reconnecting...")
          // Retry connection after 2 seconds
          setTimeout(() => {
            channel.subscribe()
          }, 2000)
        } else if (status === "TIMED_OUT") {
          console.error("[Market] Connection timed out, reconnecting...")
          setTimeout(() => {
            channel.subscribe()
          }, 2000)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, crashTurns])

  const updatePrice = useCallback(
    async (newPrice: number, timeIndex: number) => {
      const newPricePoint: PricePoint = { time: timeIndex, price: newPrice }
      const updatedHistory = [...market.priceHistory, newPricePoint].slice(-50)

      const newCrashTurns = Math.max(0, crashTurns - 1)
      setCrashTurns(newCrashTurns)

      const { error } = await supabase
        .from("market_state")
        .update({
          current_price: newPrice,
          price_history: updatedHistory,
          market_trend: newCrashTurns > 0 ? "crash" : market.marketTrend === "crash" ? "bull" : market.marketTrend,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1)

      if (error) {
        console.error("[v0] Error updating price:", error)
      }
    },
    [supabase, market.priceHistory, market.marketTrend, crashTurns],
  )

  const triggerCrash = useCallback(async () => {
    setCrashTurns(5)
    const { error } = await supabase
      .from("market_state")
      .update({
        market_trend: "crash",
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)

    if (error) {
      console.error("[v0] Error triggering crash:", error)
    }
  }, [supabase])

  const setMarketTrend = useCallback(
    async (trend: MarketTrend) => {
      const { error } = await supabase
        .from("market_state")
        .update({
          market_trend: trend,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1)

      if (error) {
        console.error("[v0] Error setting market trend:", error)
      }
    },
    [supabase],
  )

  return { market, updatePrice, triggerCrash, setMarketTrend, loading }
}
