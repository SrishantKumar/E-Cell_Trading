"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface RoundCompletionMessageProps {
    currentRound: number
    show: boolean
    onClose?: () => void
}

export function RoundCompletionMessage({ currentRound, show, onClose }: RoundCompletionMessageProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (show) {
            setVisible(true)
            // Auto-dismiss after 5 seconds
            const timer = setTimeout(() => {
                handleClose()
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [show])

    const handleClose = () => {
        setVisible(false)
        onClose?.()
    }

    if (!visible || currentRound >= 3) return null

    const nextRound = currentRound + 1

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
                onClick={handleClose}
                className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full w-10 h-10 p-0"
                size="icon"
            >
                <X className="w-5 h-5" />
            </Button>

            {/* Sparkle Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1 + Math.random() * 2}s`,
                        }}
                    >
                        <div
                            className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-ecell-orange"
                            style={{
                                boxShadow: "0 0 10px #f97316",
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <Card className="relative bg-gradient-to-br from-[#1a1f2e] via-[#0f1419] to-[#1a1f2e] border-2 border-ecell-orange/50 shadow-2xl p-8 md:p-12 max-w-2xl w-full animate-in zoom-in duration-500">
                <div className="text-center space-y-6">
                    {/* Checkmark Icon */}
                    <div className="flex justify-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-ecell-orange to-yellow-500 flex items-center justify-center animate-bounce">
                            <span className="text-4xl md:text-5xl">✓</span>
                        </div>
                    </div>

                    {/* Round Complete Message */}
                    <div className="space-y-3">
                        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ecell-orange via-yellow-400 to-ecell-orange">
                            Round {currentRound} Complete!
                        </h2>
                        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-ecell-orange to-transparent rounded-full" />
                    </div>

                    {/* Get Ready Message */}
                    <div className="space-y-2">
                        <p className="text-xl md:text-2xl text-white/90 font-semibold">
                            Get Ready for
                        </p>
                        <p className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ecell-blue via-ecell-purple to-ecell-orange animate-pulse">
                            Round {nextRound}
                        </p>
                    </div>

                    {/* Motivational Text */}
                    <p className="text-sm md:text-base text-white/60 mt-4">
                        {currentRound === 1 && "The market is heating up! Stay sharp! 🔥"}
                        {currentRound === 2 && "Final round ahead! Give it your all! 💪"}
                    </p>

                    {/* Auto-close indicator */}
                    <p className="text-xs text-white/40 mt-6">
                        Auto-closing in a few seconds...
                    </p>
                </div>
            </Card>
        </div>
    )
}
