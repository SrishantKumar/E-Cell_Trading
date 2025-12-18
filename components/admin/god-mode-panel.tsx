"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MarketTrend } from "@/lib/types"

type NewsEffect = "BOOST" | "DROP" | "NEUTRAL"

interface GodModePanelProps {
  onTriggerCrash: () => void
  onStimulusCheck: () => void
  onSendNews: (headline: string, effect: NewsEffect) => void
  onSetMarketTrend: (trend: MarketTrend) => void
}

export function GodModePanel({ onTriggerCrash, onStimulusCheck, onSendNews, onSetMarketTrend }: GodModePanelProps) {
  const [newsHeadline, setNewsHeadline] = useState("")
  const [newsEffect, setNewsEffect] = useState<NewsEffect>("NEUTRAL")

  const handleSendNews = () => {
    if (newsHeadline.trim()) {
      onSendNews(newsHeadline.trim(), newsEffect)
      setNewsHeadline("")
    }
  }

  const quickNews = [
    { headline: "Major startup funding announced!", effect: "BOOST" as NewsEffect },
    { headline: "E-Cell launches new initiative!", effect: "BOOST" as NewsEffect },
    { headline: "Tech market volatility detected!", effect: "DROP" as NewsEffect },
    { headline: "Innovation grant approved!", effect: "BOOST" as NewsEffect },
  ]

  return (
    <Card className="bg-[#1a1f2e]/80 backdrop-blur-xl border-ecell-blue/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-xl">⚡</span>
          God Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Market Manipulation */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Market Control</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onTriggerCrash}
              className="bg-ecell-danger/20 text-ecell-danger border border-ecell-danger hover:bg-ecell-danger/30 glow-red"
            >
              Trigger Crash
            </Button>
            <Button
              onClick={onStimulusCheck}
              className="bg-ecell-success/20 text-ecell-success border border-ecell-success hover:bg-ecell-success/30 glow-green"
            >
              Stimulus (₹500)
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onSetMarketTrend("bull")}
              variant="outline"
              className="border-ecell-success/50 text-ecell-success hover:bg-ecell-success/10"
            >
              Bull Market
            </Button>
            <Button
              onClick={() => onSetMarketTrend("bear")}
              variant="outline"
              className="border-ecell-danger/50 text-ecell-danger hover:bg-ecell-danger/10"
            >
              Bear Market
            </Button>
          </div>
        </div>

        {/* News Broadcast */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Broadcast News</p>
          <div className="flex gap-2">
            <Input
              placeholder="Breaking news headline..."
              value={newsHeadline}
              onChange={(e) => setNewsHeadline(e.target.value)}
              className="bg-secondary border-border"
            />
            <Select value={newsEffect} onValueChange={(v) => setNewsEffect(v as NewsEffect)}>
              <SelectTrigger className="w-28 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BOOST">Boost</SelectItem>
                <SelectItem value="DROP">Drop</SelectItem>
                <SelectItem value="NEUTRAL">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSendNews}
            disabled={!newsHeadline.trim()}
            className="w-full bg-ecell-blue/20 text-ecell-blue border border-ecell-blue hover:bg-ecell-blue/30"
          >
            Send News
          </Button>
        </div>

        {/* Quick News Buttons */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Quick Headlines</p>
          <div className="grid grid-cols-2 gap-2">
            {quickNews.map((item, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => onSendNews(item.headline, item.effect)}
                className={`text-xs ${item.effect === "BOOST"
                  ? "border-ecell-success/30 text-ecell-success/70 hover:bg-ecell-success/10"
                  : "border-ecell-danger/30 text-ecell-danger/70 hover:bg-ecell-danger/10"
                  }`}
              >
                {item.headline.slice(0, 25)}...
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
