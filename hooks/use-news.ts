"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { News, NewsEvent } from "@/lib/types"

export function useNews() {
  const [news, setNews] = useState<News | null>(null)
  const [showNews, setShowNews] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchLatestNews = async () => {
      const { data, error } = await supabase
        .from("news_events")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (!error && data) {
        setNews(newsEventToNews(data as NewsEvent))
        const createdAt = new Date(data.created_at).getTime()
        if (createdAt > Date.now() - 5000) {
          setShowNews(true)
          setTimeout(() => setShowNews(false), 5000)
        }
      }
    }

    fetchLatestNews()

    // Subscribe to realtime changes
    const channel = supabase
      .channel("news_changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "news_events" }, (payload) => {
        const data = payload.new as NewsEvent
        if (data.is_active) {
          setNews(newsEventToNews(data))
          setShowNews(true)
          setTimeout(() => setShowNews(false), 5000)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const sendNews = useCallback(
    async (headline: string, effect: News["effect"]) => {
      // Deactivate all previous news
      await supabase.from("news_events").update({ is_active: false }).eq("is_active", true)

      // Insert new news
      const impactMultiplier = effect === "BOOST" ? 1.2 : effect === "DROP" ? 0.8 : 1.0

      const { error } = await supabase.from("news_events").insert({
        headline,
        impact_multiplier: impactMultiplier,
        is_active: true,
      })

      if (error) {
        console.error("[v0] Error sending news:", error)
      }
    },
    [supabase],
  )

  return { news, showNews, sendNews, setShowNews }
}

function newsEventToNews(event: NewsEvent): News {
  const effect: News["effect"] =
    event.impact_multiplier > 1 ? "BOOST" : event.impact_multiplier < 1 ? "DROP" : "NEUTRAL"
  return {
    headline: event.headline,
    effect,
    timestamp: new Date(event.created_at).getTime(),
  }
}
