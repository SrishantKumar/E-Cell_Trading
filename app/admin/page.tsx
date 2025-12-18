"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useGameState } from "@/hooks/use-game-state"
import { useMarket } from "@/hooks/use-market"
import { usePlayers } from "@/hooks/use-players"
import { useNews } from "@/hooks/use-news"
import { useGameLoop } from "@/hooks/use-game-loop"
import { GameControls } from "@/components/admin/game-controls"
import { GodModePanel } from "@/components/admin/god-mode-panel"
import { LiveLeaderboard } from "@/components/admin/live-leaderboard"
import { MarketStats } from "@/components/admin/market-stats"
import { PriceChart } from "@/components/game/price-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLogin } from "@/components/admin/admin-login"
import type { News } from "@/lib/types"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { gameState, updateGameState, loading: gameLoading } = useGameState()
  const { market, triggerCrash, setMarketTrend, loading: marketLoading } = useMarket()
  const { players, freezePlayer, giveStimulusToAll } = usePlayers()
  const { sendNews } = useNews()
  const [isLoopRunning, setIsLoopRunning] = useState(false)
  const supabase = createClient()

  const {
    startGameLoop,
    stopGameLoop,
    triggerCrash: triggerCrashLoop,
  } = useGameLoop({
    isAdmin: true,
  })

  // Manual game loop management
  const startLoop = useCallback(() => {
    setIsLoopRunning(true)
    startGameLoop()
  }, [startGameLoop])

  const stopLoop = useCallback(() => {
    stopGameLoop()
    setIsLoopRunning(false)
  }, [stopGameLoop])

  // Auto-manage loop based on game state
  useEffect(() => {
    if (gameState.status === "active" && !isLoopRunning) {
      startLoop()
    } else if (gameState.status !== "active" && isLoopRunning) {
      stopLoop()
    }
  }, [gameState.status, isLoopRunning, startLoop, stopLoop])

  // Cleanup on unmount
  useEffect(() => {
    return () => stopLoop()
  }, [stopLoop])

  const handleStartGame = async () => {
    await supabase
      .from("market_state")
      .update({
        game_status: "active",
        game_started_at: new Date().toISOString(),
        round_started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)
  }

  const handlePauseGame = async () => {
    await updateGameState({ status: "paused" })
    stopLoop()
  }

  const handleResetGame = async () => {
    stopLoop()

    // Reset market state
    await supabase
      .from("market_state")
      .update({
        current_price: 100,
        price_history: [{ time: 0, price: 100 }],
        market_trend: "bull",
        game_status: "lobby",
        game_started_at: null,
        current_round: 1,
        round_duration_seconds: 300,
        round_started_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)

    // Delete all teams
    await supabase.from("teams").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    // Delete all news
    await supabase.from("news_events").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  }

  const handleNextRound = async () => {
    const nextRound = gameState.currentRound + 1
    if (nextRound > 3) return

    // Start next round
    await supabase
      .from("market_state")
      .update({
        current_round: nextRound,
        round_started_at: new Date().toISOString(),
        game_status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)

    sendNews(`Round ${nextRound} has started! Good luck traders! 🚀`, "BOOST")
  }

  const handleSendNews = (headline: string, effect: News["effect"]) => {
    sendNews(headline, effect)
  }

  const handleStimulusCheck = () => {
    giveStimulusToAll(500)
    sendNews("Government announces $500 stimulus for all traders!", "BOOST")
  }

  const handleTriggerCrash = () => {
    triggerCrash()
    triggerCrashLoop()
    sendNews("MARKET CRASH! Prices plummeting!", "DROP")
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={() => setIsAuthenticated(true)} />
  }

  if (gameLoading || marketLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse text-ecell-purple">Loading Mission Control...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      {/* Modern Header with Gradient */}
      <div className="border-b border-ecell-blue/20 bg-gradient-to-r from-[#0f1419] via-[#1a1f2e] to-[#0f1419]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ecell-blue via-ecell-purple to-ecell-blue uppercase tracking-widest">
              MISSION CONTROL
            </h1>
            <p className="text-white/50 text-sm tracking-wider uppercase">
              E-Cell Trading Arena - Admin Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <GameControls
              gameState={gameState}
              onStartGame={handleStartGame}
              onPauseGame={handlePauseGame}
              onResetGame={handleResetGame}
              onNextRound={handleNextRound}
              isLoopRunning={isLoopRunning}
            />
            <GodModePanel
              onTriggerCrash={handleTriggerCrash}
              onStimulusCheck={handleStimulusCheck}
              onSendNews={handleSendNews}
              onSetMarketTrend={setMarketTrend}
            />
          </div>

          {/* Center Column - Chart & Stats */}
          <div className="space-y-6">
            <Card className="bg-[#1a1f2e]/80 backdrop-blur-xl border-ecell-blue/30 shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-xl">📈</span>
                  Live Market
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PriceChart priceHistory={market.priceHistory} currentPrice={market.currentPrice} />
              </CardContent>
            </Card>
            <MarketStats market={market} />
          </div>

          {/* Right Column - Leaderboard */}
          <div>
            <LiveLeaderboard players={players} onFreezePlayer={freezePlayer} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-center gap-3 text-white/30 text-sm">
            <span className="text-ecell-blue">🎯</span>
            <span className="font-semibold">E-CELL NITA</span>
            <span className="text-white/10">|</span>
            <a
              href="https://www.ecellnita.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ecell-blue transition-colors"
            >
              www.ecellnita.com
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
