"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Market, MarketTrend } from "@/lib/types"

interface MarketStatsProps {
  market: Market
}

export function MarketStats({ market }: MarketStatsProps) {
  const startPrice = market.priceHistory[0]?.price ?? 100
  const change = market.currentPrice - startPrice
  const changePercent = ((change / startPrice) * 100).toFixed(2)
  const isUp = change >= 0

  const high = Math.max(...market.priceHistory.map((p) => p.price))
  const low = Math.min(...market.priceHistory.map((p) => p.price))

  const trendColors: Record<MarketTrend, string> = {
    bull: "text-neon-green",
    bear: "text-neon-red",
    crash: "text-neon-red animate-pulse",
    spike: "text-neon-green animate-pulse",
  }

  return (
    <Card className="bg-[#1a1f2e]/80 backdrop-blur-xl border-ecell-blue/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-xl">📊</span>
          Market Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Current Price */}
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground uppercase">Current Price</p>
            <p className={`text-2xl font-bold ${isUp ? "text-neon-green" : "text-neon-red"}`}>
              ₹{market.currentPrice.toFixed(2)}
            </p>
            <p className={`text-sm ${isUp ? "text-neon-green/70" : "text-neon-red/70"}`}>
              {isUp ? "+" : ""}
              {change.toFixed(2)} ({isUp ? "+" : ""}
              {changePercent}%)
            </p>
          </div>

          {/* Market Trend */}
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground uppercase">Market Trend</p>
            <p className={`text-2xl font-bold uppercase ${trendColors[market.marketTrend]}`}>{market.marketTrend}</p>
            {market.crashTurnsRemaining > 0 && (
              <p className="text-sm text-neon-red">{market.crashTurnsRemaining} turns left</p>
            )}
          </div>

          {/* Session High */}
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground uppercase">Session High</p>
            <p className="text-xl font-bold text-neon-green">₹{high.toFixed(2)}</p>
          </div>

          {/* Session Low */}
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground uppercase">Session Low</p>
            <p className="text-xl font-bold text-neon-red">₹{low.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
