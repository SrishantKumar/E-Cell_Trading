export type GameStatus = "lobby" | "active" | "paused" | "ended"
export type MarketTrend = "bull" | "bear" | "crash" | "spike"

export interface PricePoint {
  time: number
  price: number
}

export interface MarketState {
  id: number
  current_price: number
  price_history: PricePoint[]
  market_trend: MarketTrend
  game_status: GameStatus
  game_started_at: string | null
  game_duration_seconds: number
  current_round: number // 1, 2, or 3
  round_duration_seconds: number // 300 (5 minutes per round)
  round_started_at: string | null
  updated_at: string
}

export interface Team {
  id: string
  name: string
  cash: number
  shares_owned: number
  net_worth: number
  is_frozen: boolean
  frozen_until: string | null
  created_at: string
}

export interface NewsEvent {
  id: string
  headline: string
  impact_multiplier: number
  is_active: boolean
  created_at: string
}

// Alias for backwards compatibility with existing components
export interface Player {
  id: string
  name: string
  cash: number
  stocks: number
  netWorth: number
  isFrozen: boolean
  frozenUntil: number
}

export interface GameState {
  status: GameStatus
  timeRemaining: number
  currentRound: number
  roundTimeRemaining: number
}

export interface Market {
  currentPrice: number
  priceHistory: PricePoint[]
  marketTrend: MarketTrend
  crashTurnsRemaining: number
}

export interface News {
  headline: string
  effect: "BOOST" | "DROP" | "NEUTRAL"
  timestamp: number
}
