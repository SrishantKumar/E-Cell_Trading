"use client"

interface PortfolioHeaderProps {
  teamName: string
  cash: number
  stocks: number
  netWorth: number
  currentPrice: number
}

export function PortfolioHeader({ teamName, cash, stocks, netWorth, currentPrice }: PortfolioHeaderProps) {
  const stockValue = stocks * currentPrice
  const initialValue = 10000
  const profit = netWorth - initialValue
  const profitPercent = ((profit / initialValue) * 100).toFixed(1)
  const isProfit = profit >= 0

  return (
    <div className="bg-[#1a1f2e]/80 backdrop-blur-xl border border-ecell-blue/30 rounded-lg p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Team Name */}
        <div>
          <p className="text-xs text-white/50 uppercase tracking-wider">Team</p>
          <h1 className="text-3xl font-bold text-white">{teamName}</h1>
        </div>

        {/* Stats */}
        <div className="flex gap-6 md:gap-8">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Cash</p>
            <p className="text-xl font-bold text-ecell-orange">₹{cash.toFixed(0)}</p>
          </div>

          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">E-Coins</p>
            <p className="text-xl font-bold text-ecell-purple">
              {stocks} <span className="text-sm text-white/50">(₹{stockValue.toFixed(0)})</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Net Worth</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-white">₹{netWorth.toFixed(0)}</p>
              <p
                className={`text-sm font-bold ${isProfit ? "text-ecell-success text-glow-green" : "text-ecell-danger text-glow-red"}`}
              >
                {isProfit ? "+" : ""}
                {profitPercent}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
