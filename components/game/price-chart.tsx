"use client"

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts"
import type { PricePoint } from "@/lib/types"

interface PriceChartProps {
  priceHistory: PricePoint[]
  currentPrice: number
}

export function PriceChart({ priceHistory, currentPrice }: PriceChartProps) {
  const startPrice = priceHistory[0]?.price ?? 100
  const isUp = currentPrice >= startPrice
  const strokeColor = isUp ? "oklch(0.7 0.2 150)" : "oklch(0.65 0.25 25)"

  // Calculate min/max for better chart scaling
  const prices = priceHistory.map((p) => p.price)
  const minPrice = Math.min(...prices) * 0.95
  const maxPrice = Math.max(...prices) * 1.05

  return (
    <div className="h-64 md:h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={priceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="time" stroke="#666" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis
            domain={[minPrice, maxPrice]}
            stroke="#666"
            tick={{ fill: "#666", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value.toFixed(0)}`}
          />
          <ReferenceLine y={startPrice} stroke="#444" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: strokeColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
