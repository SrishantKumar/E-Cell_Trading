"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, AlertCircle } from "lucide-react"

interface AdminLoginProps {
    onAuthenticated: () => void
}

//admin password
const ADMIN_PASSWORD = "ecell@2025"

export function AdminLogin({ onAuthenticated }: AdminLoginProps) {
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Check if already authenticated
    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem("admin_authenticated") === "true"
        if (isAuthenticated) {
            onAuthenticated()
        }
    }, [onAuthenticated])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Simulate a small delay for better UX
        setTimeout(() => {
            if (password === ADMIN_PASSWORD) {
                sessionStorage.setItem("admin_authenticated", "true")
                onAuthenticated()
            } else {
                setError("Incorrect password. Please try again.")
                setPassword("")
            }
            setLoading(false)
        }, 500)
    }

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-ecell-purple/10 via-transparent to-ecell-blue/10" />
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <Card className="w-full max-w-md relative z-10 bg-[#1a1f2e]/90 backdrop-blur-xl border-ecell-purple/40 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-4 bg-ecell-purple/20 rounded-full ring-2 ring-ecell-purple/30">
                            <Lock className="w-12 h-12 text-ecell-purple" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">
                        Admin Authentication
                    </CardTitle>
                    <p className="text-white/60 text-sm">
                        Enter the admin password to access Mission Control
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Enter admin password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-ecell-purple focus:ring-ecell-purple"
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-ecell-danger text-sm bg-ecell-danger/10 border border-ecell-danger/30 rounded-lg p-3">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full bg-ecell-purple hover:bg-ecell-purple/90 text-white font-semibold py-6 rounded-xl border-2 border-ecell-purple/50 hover:border-ecell-purple transition-all duration-300"
                        >
                            {loading ? "Verifying..." : "Access Mission Control"}
                        </Button>

                        <div className="text-center">
                            <a
                                href="/"
                                className="text-sm text-white/50 hover:text-white/80 transition-colors"
                            >
                                ← Back to Home
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
