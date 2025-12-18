"use client"

import { useEffect, useState } from "react"
import type { News } from "@/lib/types"

interface NewsTickerProps {
  news: News | null
  show: boolean
}

export function NewsTicker({ news, show }: NewsTickerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [show, news?.timestamp])

  if (!visible || !news) return null

  const effectColor =
    news.effect === "BOOST"
      ? "bg-neon-green/20 border-neon-green"
      : news.effect === "DROP"
        ? "bg-neon-red/20 border-neon-red"
        : "bg-neon-blue/20 border-neon-blue"

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 border-b-2 ${effectColor} animate-frost`}>
      <div className="overflow-hidden py-2">
        <div className="animate-ticker whitespace-nowrap">
          <span className="text-sm font-bold uppercase tracking-wider px-4">
            BREAKING NEWS: {news.headline} • BREAKING NEWS: {news.headline} • BREAKING NEWS: {news.headline}
          </span>
        </div>
      </div>
    </div>
  )
}
