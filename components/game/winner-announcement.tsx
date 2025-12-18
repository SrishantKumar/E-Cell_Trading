"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Player } from "@/lib/types"

interface WinnerAnnouncementProps {
    players: Player[]
    show: boolean
    onClose?: () => void
}

export function WinnerAnnouncement({ players, show, onClose }: WinnerAnnouncementProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (show) {
            setVisible(true)
        }
    }, [show])

    if (!visible) return null

    const topThree = players.slice(0, 3)
    const winner = topThree[0]

    const handleClose = () => {
        setVisible(false)
        onClose?.()
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md animate-in fade-in duration-500 overflow-y-auto">
            {/* Close Button */}
            <Button
                onClick={handleClose}
                className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full w-12 h-12 p-0"
                size="icon"
            >
                <X className="w-6 h-6" />
            </Button>

            {/* Confetti Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-confetti"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-10%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                    >
                        <div
                            className="w-2 h-2 md:w-3 md:h-3 rounded-sm"
                            style={{
                                backgroundColor: ["#f97316", "#8b5cf6", "#3b82f6", "#10b981"][Math.floor(Math.random() * 4)],
                                transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Main Content - Centered and Scrollable */}
            <div className="min-h-screen flex items-center justify-center p-4 py-8 md:py-12">
                <div className="relative w-full max-w-4xl animate-in zoom-in duration-700">
                    {/* E-Cell Logo */}
                    <div className="flex justify-center mb-4 md:mb-6">
                        <div className="relative w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 animate-in zoom-in duration-1000 delay-200">
                            <Image
                                src="/ecell-logo.png"
                                alt="E-Cell NITA"
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Congratulations Card */}
                    <Card className="bg-gradient-to-br from-[#1a1f2e] via-[#0f1419] to-[#1a1f2e] border-2 border-ecell-orange/50 shadow-2xl p-4 md:p-6 lg:p-10">
                        {/* Title */}
                        <div className="text-center mb-4 md:mb-6 space-y-2 md:space-y-3">
                            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ecell-orange via-yellow-400 to-ecell-orange animate-pulse leading-tight">
                                🎉 CONGRATULATIONS! 🎉
                            </h1>
                            <p className="text-sm md:text-xl lg:text-2xl text-white/80 font-semibold">
                                E-Cell Trading Arena Champion
                            </p>
                        </div>

                        {/* Winner Spotlight */}
                        <div className="mb-4 md:mb-8">
                            <div className="bg-gradient-to-r from-ecell-orange/20 via-yellow-400/20 to-ecell-orange/20 border-2 border-ecell-orange rounded-xl p-4 md:p-6 text-center">
                                <div className="text-3xl md:text-5xl mb-2 md:mb-3 animate-bounce">👑</div>
                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 break-words">
                                    {winner?.name}
                                </h2>
                                <p className="text-xl md:text-2xl lg:text-3xl text-ecell-orange font-bold mb-1">
                                    ₹{winner?.netWorth.toFixed(0)}
                                </p>
                                <p className="text-xs md:text-base text-white/60">
                                    Final Net Worth
                                </p>
                            </div>
                        </div>

                        {/* Podium - Top 3 */}
                        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
                            {/* 2nd Place */}
                            {topThree[1] && (
                                <div className="flex flex-col items-center pt-6 md:pt-10">
                                    <div className="bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg p-2 md:p-3 w-full text-center border-2 border-gray-400">
                                        <div className="text-xl md:text-3xl mb-1">🥈</div>
                                        <p className="text-xs md:text-lg font-bold text-white mb-1 truncate px-1">{topThree[1].name}</p>
                                        <p className="text-xs md:text-base text-gray-200">₹{topThree[1].netWorth.toFixed(0)}</p>
                                        <div className="mt-1 text-[10px] md:text-xs text-gray-300">2nd Place</div>
                                    </div>
                                </div>
                            )}

                            {/* 1st Place (Center, Elevated) */}
                            <div className="flex flex-col items-center">
                                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-3 md:p-4 w-full text-center border-2 border-yellow-500 shadow-xl">
                                    <div className="text-2xl md:text-4xl mb-1">🏆</div>
                                    <p className="text-sm md:text-xl font-bold text-gray-900 mb-1 truncate px-1">{topThree[0].name}</p>
                                    <p className="text-xs md:text-lg text-gray-800 font-bold">₹{topThree[0].netWorth.toFixed(0)}</p>
                                    <div className="mt-1 text-[10px] md:text-sm font-semibold text-gray-700">WINNER</div>
                                </div>
                            </div>

                            {/* 3rd Place */}
                            {topThree[2] && (
                                <div className="flex flex-col items-center pt-8 md:pt-14">
                                    <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-2 md:p-3 w-full text-center border-2 border-orange-500">
                                        <div className="text-xl md:text-3xl mb-1">🥉</div>
                                        <p className="text-xs md:text-lg font-bold text-white mb-1 truncate px-1">{topThree[2].name}</p>
                                        <p className="text-xs md:text-base text-orange-200">₹{topThree[2].netWorth.toFixed(0)}</p>
                                        <div className="mt-1 text-[10px] md:text-xs text-orange-300">3rd Place</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Message */}
                        <div className="text-center space-y-2 md:space-y-3 pt-4 md:pt-5 border-t border-white/10">
                            <p className="text-xs md:text-lg text-white/80">
                                Thank you for participating in the
                            </p>
                            <p className="text-sm md:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ecell-blue via-ecell-purple to-ecell-orange">
                                E-CELL NITA TRADING ARENA
                            </p>
                            <p className="text-[10px] md:text-sm text-white/50 mt-2">
                                Powered by E-Cell NITA | www.ecellnita.com
                            </p>
                        </div>

                        {/* Close Button (Bottom) */}
                        <div className="mt-6 md:mt-8 text-center">
                            <Button
                                onClick={handleClose}
                                className="bg-ecell-orange hover:bg-ecell-orange/80 text-white px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
                            >
                                Close & Continue
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
