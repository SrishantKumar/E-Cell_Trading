"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Player, Team } from "@/lib/types"

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from("teams").select("*").order("net_worth", { ascending: false })

      if (error) {
        console.error("[v0] Error fetching players:", error)
        console.error("[v0] Error message:", error.message)
        console.error("[v0] Error details:", error.details)
        console.error("[v0] Error hint:", error.hint)
        console.error("[v0] Error code:", error.code)
        setLoading(false)
        return
      }

      if (data) {
        setPlayers(data.map(teamToPlayer))
      }
      setLoading(false)
    }

    fetchPlayers()

    // Subscribe to realtime changes
    const channel = supabase
      .channel("teams_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "teams" }, () => {
        // Refetch all players to ensure correct ordering
        fetchPlayers()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const freezePlayer = useCallback(
    async (targetId: string, duration = 30000) => {
      const frozenUntil = new Date(Date.now() + duration).toISOString()
      const { error } = await supabase
        .from("teams")
        .update({ is_frozen: true, frozen_until: frozenUntil })
        .eq("id", targetId)

      if (error) {
        console.error("[v0] Error freezing player:", error)
      }
    },
    [supabase],
  )

  const giveStimulusToAll = useCallback(
    async (amount: number) => {
      // Get all players
      const { data: teams, error: fetchError } = await supabase.from("teams").select("*")

      if (fetchError || !teams) {
        console.error("[v0] Error fetching teams for stimulus:", fetchError)
        return
      }

      // Update each player
      for (const team of teams) {
        await supabase
          .from("teams")
          .update({
            cash: Number(team.cash) + amount,
            net_worth: Number(team.net_worth) + amount,
          })
          .eq("id", team.id)
      }
    },
    [supabase],
  )

  const updateAllNetWorths = useCallback(
    async (currentPrice: number) => {
      const { data: teams, error: fetchError } = await supabase.from("teams").select("*")

      if (fetchError || !teams) {
        console.error("[v0] Error fetching teams for net worth update:", fetchError)
        return
      }

      for (const team of teams) {
        const netWorth = Number(team.cash) + team.shares_owned * currentPrice
        await supabase.from("teams").update({ net_worth: netWorth }).eq("id", team.id)
      }
    },
    [supabase],
  )

  return { players, freezePlayer, giveStimulusToAll, updateAllNetWorths, loading }
}

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
