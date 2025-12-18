"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface TradingDeckProps {
  currentPrice: number
  cash: number
  stocks: number
  isFrozen: boolean
  onBuy: (quantity: number) => Promise<boolean>
  onSell: (quantity: number) => Promise<boolean>
}

export function TradingDeck({ currentPrice, cash, stocks, isFrozen, onBuy, onSell }: TradingDeckProps) {
  const [loading, setLoading] = useState(false)
  const canBuy = cash >= currentPrice && !isFrozen
  const canSell = stocks > 0 && !isFrozen

  const handleBuy = async () => {
    if (!canBuy || loading) return
    setLoading(true)
    await onBuy(1)
    setLoading(false)
  }

  const handleSell = async () => {
    if (!canSell || loading) return
    setLoading(true)
    await onSell(1)
    setLoading(false)
  }

  const maxBuyable = Math.floor(cash / currentPrice)

  return (
    <div className="space-y-4">
      {/* Current Price Display */}
      <div className="text-center py-4 bg-secondary/50 rounded-lg">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Price</p>
        <p className="text-4xl font-bold text-foreground">₹{currentPrice.toFixed(2)}</p>
      </div>

      {/* Trading Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handleBuy}
          disabled={!canBuy || loading}
          className="h-20 text-xl font-bold bg-ecell-success/20 text-ecell-success border-2 border-ecell-success hover:bg-ecell-success/30 disabled:opacity-30 disabled:cursor-not-allowed glow-green"
        >
          <div className="flex flex-col items-center">
            <span>BUY</span>
            <span className="text-xs opacity-70">Max: {maxBuyable}</span>
          </div>
        </Button>

        <Button
          onClick={handleSell}
          disabled={!canSell || loading}
          className="h-20 text-xl font-bold bg-ecell-danger/20 text-ecell-danger border-2 border-ecell-danger hover:bg-ecell-danger/30 disabled:opacity-30 disabled:cursor-not-allowed glow-red"
        >
          <div className="flex flex-col items-center">
            <span>SELL</span>
            <span className="text-xs opacity-70">Own: {stocks}</span>
          </div>
        </Button>
      </div>

      {/* Quick Trade Buttons */}
      <div className="space-y-2">
        {/* Quick Buy Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 5, 10, "MAX"].map((amount) => {
            const qty = amount === "MAX" ? maxBuyable : (amount as number)
            const canQuickBuy = cash >= currentPrice * qty && !isFrozen

            return (
              <Button
                key={`buy-${amount}`}
                variant="outline"
                size="sm"
                disabled={!canQuickBuy || loading}
                onClick={async () => {
                  if (!canQuickBuy || loading) return
                  setLoading(true)
                  await onBuy(qty)
                  setLoading(false)
                }}
                className="text-xs border-ecell-success/30 text-ecell-success/70 hover:bg-ecell-success/10"
              >
                +{amount}
              </Button>
            )
          })}
        </div>

        {/* Quick Sell Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 5, 10, "MAX"].map((amount) => {
            const qty = amount === "MAX" ? stocks : Math.min(amount as number, stocks)
            const canQuickSell = stocks >= qty && qty > 0 && !isFrozen

            return (
              <Button
                key={`sell-${amount}`}
                variant="outline"
                size="sm"
                disabled={!canQuickSell || loading}
                onClick={async () => {
                  if (!canQuickSell || loading) return
                  setLoading(true)
                  await onSell(qty)
                  setLoading(false)
                }}
                className="text-xs border-ecell-danger/30 text-ecell-danger/70 hover:bg-ecell-danger/10"
              >
                -{amount}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
