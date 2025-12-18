"use client"

import { useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useGameState } from "@/hooks/use-game-state"
import { useMarket } from "@/hooks/use-market"
import { usePlayer } from "@/hooks/use-player"
import { usePlayers } from "@/hooks/use-players"
import { useNews } from "@/hooks/use-news"
import { PriceChart } from "@/components/game/price-chart"
import { TradingDeck } from "@/components/game/trading-deck"
import { PortfolioHeader } from "@/components/game/portfolio-header"
import { NewsTicker } from "@/components/game/news-ticker"
import { GameStatusBar } from "@/components/game/game-status-bar"
import { JoinGameForm } from "@/components/game/join-game-form"
import { FrozenOverlay } from "@/components/game/frozen-overlay"
import { MiniLeaderboard } from "@/components/game/mini-leaderboard"
import { SabotagePanel } from "@/components/game/sabotage-panel"
import { WinnerAnnouncement } from "@/components/game/winner-announcement"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BLIZZARD_COST = 5000

export default function PlayPage() {
  const { gameState, loading: gameLoading } = useGameState()
  const { market, loading: marketLoading } = useMarket()
  const { player, playerId, joinGame, buyStock, sellStock, updateNetWorth, loading: playerLoading } = usePlayer()
  const { players } = usePlayers()
  const { news, showNews } = useNews()
  const supabase = createClient()

  // Update net worth when price changes
  useEffect(() => {
    if (player && market.currentPrice) {
      updateNetWorth(market.currentPrice)
    }
  }, [market.currentPrice, player, updateNetWorth])

  const handleBuy = async (quantity: number) => {
    return buyStock(market.currentPrice, quantity)
  }

  const handleSell = async (quantity: number) => {
    return sellStock(market.currentPrice, quantity)
  }

  const handleBlizzard = useCallback(
    async (targetId: string) => {
      if (!player || !playerId || player.cash < BLIZZARD_COST) return

      // Deduct cost from attacker
      const newCash = player.cash - BLIZZARD_COST
      await supabase
        .from("teams")
        .update({
          cash: newCash,
          net_worth: newCash + player.stocks * market.currentPrice,
        })
        .eq("id", playerId)

      // Freeze target for 30 seconds
      const frozenUntil = new Date(Date.now() + 30000).toISOString()
      await supabase.from("teams").update({ is_frozen: true, frozen_until: frozenUntil }).eq("id", targetId)
    },
    [player, playerId, supabase, market.currentPrice],
  )

  // Show loading state
  if (gameLoading || marketLoading || playerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center" suppressHydrationWarning>
          <div className="text-4xl animate-pulse text-neon-green" suppressHydrationWarning>Loading...</div>
        </div>
      </div>
    )
  }

  // Show join form if not in game
  if (!player) {
    return <JoinGameForm onJoin={joinGame} />
  }

  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      {/* News Ticker */}
      <NewsTicker news={news} show={showNews} />

      {/* Frozen Overlay */}
      <FrozenOverlay isFrozen={player.isFrozen} frozenUntil={player.frozenUntil} />

      {/* Modern Header with Gradient */}
      <div className="border-b border-ecell-orange/20 bg-gradient-to-r from-[#0f1419] via-[#1a1f2e] to-[#0f1419]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ecell-orange via-ecell-purple to-ecell-orange uppercase tracking-widest">
              E-CELL TRADING ARENA
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Game Status */}
        <GameStatusBar gameState={gameState} />

        {/* Portfolio Header */}
        <PortfolioHeader
          teamName={player.name}
          cash={player.cash}
          stocks={player.stocks}
          netWorth={player.netWorth}
          currentPrice={market.currentPrice}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart - Takes 2 columns on large screens */}
          <Card className="lg:col-span-2 bg-[#1a1f2e]/80 backdrop-blur-xl border-ecell-blue/30 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm uppercase tracking-wider">Market Price</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart priceHistory={market.priceHistory} currentPrice={market.currentPrice} />
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Trading Deck */}
            <Card className="bg-[#1a1f2e]/80 backdrop-blur-xl border-ecell-blue/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm uppercase tracking-wider">Trade</CardTitle>
              </CardHeader>
              <CardContent>
                <TradingDeck
                  currentPrice={market.currentPrice}
                  cash={player.cash}
                  stocks={player.stocks}
                  isFrozen={player.isFrozen}
                  onBuy={handleBuy}
                  onSell={handleSell}
                />
              </CardContent>
            </Card>

            {/* Sabotage Panel */}
            <SabotagePanel
              players={players}
              currentPlayerId={playerId}
              cash={player.cash}
              onBlizzard={handleBlizzard}
            />

            {/* Mini Leaderboard */}
            <MiniLeaderboard players={players} currentPlayerId={playerId} />
          </div>
        </div>

        {/* Waiting for game message */}
        {gameState.status === "lobby" && (
          <Card className="bg-ecell-blue/10 backdrop-blur-xl border-ecell-blue/30">
            <CardContent className="py-6 text-center">
              <p className="text-ecell-blue font-bold text-lg">Waiting for the game to start...</p>
              <p className="text-sm text-white/50 mt-1">The admin will begin the game shortly.</p>
            </CardContent>
          </Card>
        )}

        {/* Game Over message */}
        {(gameState.status === "paused" || gameState.status === "ended") && gameState.timeRemaining <= 0 && (
          <Card className="bg-ecell-orange/10 backdrop-blur-xl border-ecell-orange/30">
            <CardContent className="py-8 text-center">
              <p className="text-ecell-orange font-bold text-3xl mb-3">GAME OVER!</p>
              <p className="text-white text-lg">
                Final Net Worth: <span className="text-ecell-success font-bold">₹{player.netWorth.toFixed(2)}</span>
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Winner Announcement - Shows when Round 3 ends */}
      <WinnerAnnouncement
        players={players}
        show={gameState.status === "ended" && gameState.currentRound === 3}
      />
    </main>
  )
}
