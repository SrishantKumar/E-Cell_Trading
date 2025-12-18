"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Users, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#0a0e1a] overflow-hidden">
      {/* Background with trading chart pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-ecell-orange/10 via-transparent to-ecell-blue/10" />
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Candlestick decorative elements */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 600" fill="none">
          <rect x="50" y="100" width="20" height="80" fill="#FF6B35" opacity="0.6" />
          <rect x="100" y="80" width="20" height="100" fill="#4ECDC4" opacity="0.6" />
          <rect x="150" y="120" width="20" height="60" fill="#FF6B35" opacity="0.6" />
          <rect x="200" y="90" width="20" height="90" fill="#4ECDC4" opacity="0.6" />
          <rect x="250" y="110" width="20" height="70" fill="#4ECDC4" opacity="0.6" />
          <rect x="300" y="130" width="20" height="50" fill="#FF6B35" opacity="0.6" />
          <line x1="60" y1="80" x2="60" y2="200" stroke="#FF6B35" strokeWidth="2" opacity="0.4" />
          <line x1="110" y1="60" x2="110" y2="200" stroke="#4ECDC4" strokeWidth="2" opacity="0.4" />
          <line x1="160" y1="100" x2="160" y2="200" stroke="#FF6B35" strokeWidth="2" opacity="0.4" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo and Title - Single unified header */}
        <div className="text-center mb-16 space-y-8">
          {/* Logo with brand name */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-ecell-blue/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300" />
              <Image
                src="/ecell-logo.png"
                alt="E-Cell NITA Logo"
                width={100}
                height={100}
                className="relative animate-pulse-neon drop-shadow-2xl"
              />
            </div>
            <p className="text-lg font-semibold text-white/80 tracking-widest uppercase">E-Cell NITA</p>
          </div>

          {/* Main Title */}
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4ECDC4] via-[#6DD5ED] to-[#4ECDC4] animate-pulse-neon tracking-tight leading-tight">
              E-CELL NITA
              <br />
              TRADING ARENA
            </h1>

            <p className="text-lg md:text-xl text-white/60 font-light tracking-wide">
              E-Cell NITA Trading Competition
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full mb-16">
          {/* Join as Player Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-ecell-orange/30 to-ecell-orange/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-[#1a1f2e]/90 backdrop-blur-xl border border-ecell-orange/40 rounded-2xl p-8 hover:border-ecell-orange/70 transition-all duration-300 hover:transform hover:scale-105 shadow-2xl">
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="p-5 bg-ecell-orange/15 rounded-full ring-2 ring-ecell-orange/30">
                  <Users className="w-14 h-14 text-ecell-orange" />
                </div>

                <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Join as Player</h2>

                <p className="text-white/70 text-sm leading-relaxed">
                  Join us as a player and compete in the E-Cell NITA trading competition
                </p>

                <Link href="/play" className="w-full">
                  <Button className="w-full bg-ecell-orange hover:bg-ecell-orange/90 text-white font-bold py-6 rounded-xl border-2 border-ecell-orange/50 hover:border-ecell-orange transition-all duration-300 text-base uppercase tracking-wide shadow-lg hover:shadow-ecell-orange/50">
                    Enter Trading Arena
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Admin Dashboard Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-ecell-blue/30 to-ecell-blue/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-[#1a1f2e]/90 backdrop-blur-xl border border-ecell-blue/40 rounded-2xl p-8 hover:border-ecell-blue/70 transition-all duration-300 hover:transform hover:scale-105 shadow-2xl">
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="p-5 bg-ecell-blue/15 rounded-full ring-2 ring-ecell-blue/30">
                  <BarChart3 className="w-14 h-14 text-ecell-blue" />
                </div>

                <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Admin Dashboard</h2>

                <p className="text-white/70 text-sm leading-relaxed">
                  Control the market, manage players, and oversee the trading competition
                </p>

                <Link href="/admin" className="w-full">
                  <Button className="w-full bg-ecell-blue hover:bg-ecell-blue/90 text-white font-bold py-6 rounded-xl border-2 border-ecell-blue/50 hover:border-ecell-blue transition-all duration-300 text-base uppercase tracking-wide shadow-lg hover:shadow-ecell-blue/50">
                    Mission Control
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* How to Play Section */}
        <div className="max-w-4xl w-full mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-ecell-purple/15 to-transparent rounded-2xl blur-xl" />
            <div className="relative bg-[#1a1f2e]/70 backdrop-blur-xl border-2 border-ecell-orange/40 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-ecell-orange via-ecell-purple to-ecell-blue uppercase tracking-wide">
                How to Play
              </h2>

              <ul className="space-y-4 text-white/80 text-base">
                <li className="flex items-start gap-4 group">
                  <span className="text-ecell-orange text-2xl font-bold group-hover:scale-125 transition-transform">•</span>
                  <span className="leading-relaxed">Start with ₹10,000 and compete against other players in real-time trading</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <span className="text-ecell-orange text-2xl font-bold group-hover:scale-125 transition-transform">•</span>
                  <span className="leading-relaxed">Buy E-Coins when prices are low and sell when they rise to maximize profits</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <span className="text-ecell-orange text-2xl font-bold group-hover:scale-125 transition-transform">•</span>
                  <span className="leading-relaxed">Use strategic sabotage to freeze competitors and gain a competitive edge</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <span className="text-ecell-orange text-2xl font-bold group-hover:scale-125 transition-transform">•</span>
                  <span className="leading-relaxed">Build the highest net worth to win the E-Cell NITA trading championship</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm">
          <a href="https://www.ecellnita.in/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ecell-blue transition-colors">
            E-Cell NITA website
          </a>

          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/ecellnita/" className="hover:text-ecell-blue transition-colors hover:scale-110 transform">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href="https://www.instagram.com/ecellnita/" className="hover:text-ecell-orange transition-colors hover:scale-110 transform">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="https://x.com/ecellnita" className="hover:text-ecell-blue transition-colors hover:scale-110 transform">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
            </a>
          </div>

          <a href="mailto:nitaecell@gmail.com" className="flex items-center gap-2 hover:text-ecell-orange transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            contact nitaecell@gmail.com
          </a>
        </div>
      </div>
    </main>
  )
}
