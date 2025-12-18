"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JoinGameFormProps {
  onJoin: (teamName: string) => Promise<string>
}

export function JoinGameForm({ onJoin }: JoinGameFormProps) {
  const [teamName, setTeamName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) {
      setError("Please enter a team name")
      return
    }

    setLoading(true)
    setError("")

    try {
      await onJoin(teamName.trim())
    } catch (err) {
      setError("Failed to join game. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-ecell-orange/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-ecell-orange text-glow-orange">Join the Trading Arena</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter your team name..."
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                maxLength={20}
              />
            </div>

            {error && <p className="text-sm text-ecell-danger">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-ecell-orange/20 text-ecell-orange border border-ecell-orange hover:bg-ecell-orange/30 glow-orange"
            >
              {loading ? "Joining..." : "Enter Game"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
