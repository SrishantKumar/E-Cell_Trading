"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import type { Player } from "@/lib/types"

interface WinnerAnnouncementProps {
    players: Player[]
    show: boolean
}

export function WinnerAnnouncement({ players, show }: WinnerAnnouncementProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (show) {
            setVisible(true)
        }
    }, [show])

    if (!visible) return null

    const topThree = players.slice(0, 3)
    const winner = topThree[0]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
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
                            className="w-3 h-3 rounded-sm"
                            style={{
                                backgroundColor: ["#f97316", "#8b5cf6", "#3b82f6", "#10b981"][Math.floor(Math.random() * 4)],
                                transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="relative max-w-4xl w-full mx-4 animate-in zoom-in duration-700">
                {/* E-Cell Logo */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-32 h-32 animate-in zoom-in duration-1000 delay-200">
                        <Image
                            src="/ecell-logo.png"
                            alt="E-Cell NITA"
                            fill
                            className="object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Congratulations Card */}
                <Card className="bg-gradient-to-br from-[#1a1f2e] via-[#0f1419] to-[#1a1f2e] border-2 border-ecell-orange/50 shadow-2xl p-8 md:p-12">
                    {/* Title */}
                    <div className="text-center mb-8 space-y-4">
                        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ecell-orange via-yellow-400 to-ecell-orange animate-pulse">
                            🎉 CONGRATULATIONS! 🎉
                        </h1>
                        <p className="text-2xl md:text-3xl text-white/80 font-semibold">
                            E-Cell Trading Arena Champion
                        </p>
                    </div>

                    {/* Winner Spotlight */}
                    <div className="mb-10">
                        <div className="bg-gradient-to-r from-ecell-orange/20 via-yellow-400/20 to-ecell-orange/20 border-2 border-ecell-orange rounded-xl p-8 text-center">
                            <div className="text-6xl mb-4 animate-bounce">👑</div>
                            <h2 className="text-5xl md:text-6xl font-bold text-white mb-3">
                                {winner?.name}
                            </h2>
                            <p className="text-3xl text-ecell-orange font-bold mb-2">
                                ₹{winner?.netWorth.toFixed(0)}
                            </p>
                            <p className="text-lg text-white/60">
                                Final Net Worth
                            </p>
                        </div>
                    </div>

                    {/* Podium - Top 3 */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {/* 2nd Place */}
                        {topThree[1] && (
                            <div className="flex flex-col items-center pt-12">
                                <div className="bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg p-4 w-full text-center border-2 border-gray-400">
                                    <div className="text-4xl mb-2">🥈</div>
                                    <p className="text-xl font-bold text-white mb-1">{topThree[1].name}</p>
                                    <p className="text-lg text-gray-200">₹{topThree[1].netWorth.toFixed(0)}</p>
                                    <div className="mt-2 text-sm text-gray-300">2nd Place</div>
                                </div>
                            </div>
                        )}

                        {/* 1st Place (Center, Elevated) */}
                        <div className="flex flex-col items-center">
                            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-6 w-full text-center border-2 border-yellow-500 shadow-xl">
                                <div className="text-5xl mb-2">🏆</div>
                                <p className="text-2xl font-bold text-gray-900 mb-1">{topThree[0].name}</p>
                                <p className="text-xl text-gray-800 font-bold">₹{topThree[0].netWorth.toFixed(0)}</p>
                                <div className="mt-2 text-sm font-semibold text-gray-700">WINNER</div>
                            </div>
                        </div>

                        {/* 3rd Place */}
                        {topThree[2] && (
                            <div className="flex flex-col items-center pt-16">
                                <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-4 w-full text-center border-2 border-orange-500">
                                    <div className="text-4xl mb-2">🥉</div>
                                    <p className="text-xl font-bold text-white mb-1">{topThree[2].name}</p>
                                    <p className="text-lg text-orange-200">₹{topThree[2].netWorth.toFixed(0)}</p>
                                    <div className="mt-2 text-sm text-orange-300">3rd Place</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Message */}
                    <div className="text-center space-y-4 pt-6 border-t border-white/10">
                        <p className="text-xl text-white/80">
                            Thank you for participating in the
                        </p>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ecell-blue via-ecell-purple to-ecell-orange">
                            E-CELL NITA TRADING ARENA
                        </p>
                        <p className="text-sm text-white/50 mt-4">
                            Powered by E-Cell NITA | www.ecellnita.com
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
