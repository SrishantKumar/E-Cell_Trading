"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Player, Team } from "@/lib/types"

export function usePlayer() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Check for existing session on mount
  useEffect(() => {
    const storedId = typeof window !== "undefined" ? localStorage.getItem("ecell_player_id") : null
    if (storedId) {
      setPlayerId(storedId)
    } else {
      setLoading(false)
    }
  }, [])

  // Listen to player updates
  useEffect(() => {
    if (!playerId) return

    const fetchPlayer = async () => {
      const { data, error } = await supabase.from("teams").select("*").eq("id", playerId).single()

      if (error) {
        console.error("[v0] Error fetching player:", error)
        localStorage.removeItem("ecell_player_id")
        setPlayerId(null)
        setLoading(false)
        return
      }

      if (data) {
        setPlayer(teamToPlayer(data as Team))
      }
      setLoading(false)
    }

    fetchPlayer()

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`team_${playerId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams", filter: `id=eq.${playerId}` },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setPlayer(null)
            setPlayerId(null)
            localStorage.removeItem("ecell_player_id")
          } else {
            setPlayer(teamToPlayer(payload.new as Team))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, playerId])

  // Check for frozen status and auto-unfreeze
  useEffect(() => {
    if (player?.isFrozen && player.frozenUntil < Date.now()) {
      supabase.from("teams").update({ is_frozen: false, frozen_until: null }).eq("id", player.id)
    }
  }, [player, supabase])

  const joinGame = useCallback(
    async (teamName: string) => {
      try {
        console.log("[v0] Attempting to join game with team name:", teamName)
        console.log("[v0] Supabase client initialized:", !!supabase)

        const { data, error } = await supabase
          .from("teams")
          .insert({
            name: teamName,
            cash: 10000,
            shares_owned: 0,
            net_worth: 10000,
            is_frozen: false,
          })
          .select()
          .single()

        if (error) {
          console.error("[v0] Error joining game - Full error:", error)
          console.error("[v0] Error message:", error.message)
          console.error("[v0] Error details:", error.details)
          console.error("[v0] Error hint:", error.hint)
          console.error("[v0] Error code:", error.code)
          throw error
        }

        if (data) {
          console.log("[v0] Successfully joined game:", data)
          localStorage.setItem("ecell_player_id", data.id)
          setPlayerId(data.id)
          setPlayer(teamToPlayer(data as Team))
          return data.id
        }
      } catch (error) {
        console.error("[v0] Error joining game - Caught error:", error)
        console.error("[v0] Error type:", typeof error)
        console.error("[v0] Error stringified:", JSON.stringify(error, null, 2))
        throw error
      }
    },
    [supabase],
  )

  const buyStock = useCallback(
    async (price: number, quantity = 1) => {
      if (!player || !playerId) return false

      const totalCost = price * quantity
      if (player.cash < totalCost || player.isFrozen) return false

      const newCash = player.cash - totalCost
      const newStocks = player.stocks + quantity
      const newNetWorth = newCash + newStocks * price

      const { error } = await supabase
        .from("teams")
        .update({
          cash: newCash,
          shares_owned: newStocks,
          net_worth: newNetWorth,
        })
        .eq("id", playerId)

      if (error) {
        console.error("[v0] Error buying stock:", error)
        return false
      }
      return true
    },
    [player, playerId, supabase],
  )

  const sellStock = useCallback(
    async (price: number, quantity = 1) => {
      if (!player || !playerId) return false

      if (player.stocks < quantity || player.isFrozen) return false

      const newCash = player.cash + price * quantity
      const newStocks = player.stocks - quantity
      const newNetWorth = newCash + newStocks * price

      const { error } = await supabase
        .from("teams")
        .update({
          cash: newCash,
          shares_owned: newStocks,
          net_worth: newNetWorth,
        })
        .eq("id", playerId)

      if (error) {
        console.error("[v0] Error selling stock:", error)
        return false
      }
      return true
    },
    [player, playerId, supabase],
  )

  const updateNetWorth = useCallback(
    async (currentPrice: number) => {
      if (!player || !playerId) return

      const newNetWorth = player.cash + player.stocks * currentPrice

      await supabase.from("teams").update({ net_worth: newNetWorth }).eq("id", playerId)
    },
    [player, playerId, supabase],
  )

  return {
    player,
    playerId,
    joinGame,
    buyStock,
    sellStock,
    updateNetWorth,
    loading,
  }
}

// Helper to convert Team (Supabase) to Player (UI)
function teamToPlayer(team: Team): Player {
  return {
    id: team.id,
    name: team.name,
    cash: Number(team.cash),
    stocks: team.shares_owned,
    netWorth: Number(team.net_worth),
    isFrozen: team.is_frozen,
    frozenUntil: team.frozen_until ? new Date(team.frozen_until).getTime() : 0,
  }
}
