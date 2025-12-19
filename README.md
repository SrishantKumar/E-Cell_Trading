# 🎯 E-Cell Trading Arena

A real-time multiplayer stock trading simulation game built for E-Cell NITA competitions. Players compete to maximize their net worth through strategic trading, market manipulation, and sabotage mechanics.

![E-Cell Trading Arena](https://img.shields.io/badge/E--Cell-Trading%20Arena-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-green?style=for-the-badge&logo=supabase)

## ✨ Features

### 🎮 Player Features
- **Real-time Trading**: Buy and sell E-Coins with live price updates every 2 seconds
- **Quick Trading**: One-click buttons for buying/selling 1, 5, 10, or MAX stocks
- **Live Leaderboard**: See your ranking against other players in real-time
- **Sabotage System**: Freeze competitors for 30 seconds with "Hack Attack" (₹5,000)
- **Portfolio Tracking**: Monitor cash, E-Coins, net worth, and profit/loss percentage
- **Round-Based Gameplay**: 3 rounds of 5 minutes each with data persistence

### 🎛️ Admin Features
- **Mission Control Dashboard**: Professional admin interface with glassmorphism design
- **Market Manipulation**: 
  - Trigger crashes (-18% per tick)
  - Set market trends (Bull, Bear, Crash, Spike)
  - Send custom news broadcasts
- **God Mode Controls**:
  - Stimulus checks for all players
  - Freeze individual players
  - Real-time market trend changes
- **Round Management**: Start/pause rounds, track time, manage game flow
- **Live Analytics**: Real-time price charts, market stats, player rankings

### 🔒 Security
- Password-protected admin dashboard
- Session-based authentication
- Supabase Row Level Security (RLS)

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ecell-trading-arena.git
cd ecell-trading-arena
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and create a new project
2. Copy your project URL and anon key

#### Run Database Migrations
Execute the following SQL in your Supabase SQL Editor:

```sql
-- Create teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cash DECIMAL DEFAULT 10000,
  shares_owned INTEGER DEFAULT 0,
  net_worth DECIMAL DEFAULT 10000,
  is_frozen BOOLEAN DEFAULT false,
  frozen_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create market_state table
CREATE TABLE market_state (
  id INTEGER PRIMARY KEY DEFAULT 1,
  current_price DECIMAL DEFAULT 100,
  price_history JSONB DEFAULT '[]',
  market_trend TEXT DEFAULT 'bull',
  game_status TEXT DEFAULT 'lobby',
  game_started_at TIMESTAMPTZ,
  game_duration_seconds INTEGER DEFAULT 900,
  current_round INTEGER DEFAULT 1,
  round_duration_seconds INTEGER DEFAULT 300,
  round_started_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create news_events table
CREATE TABLE news_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  impact_multiplier DECIMAL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial market state
INSERT INTO market_state (id) VALUES (1);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE market_state;
ALTER PUBLICATION supabase_realtime ADD TABLE news_events;
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_PASSWORD=ecell2024
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Play

### For Players

1. **Join the Game**
   - Navigate to `/play`
   - Enter your team name
   - Wait for admin to start the game

2. **Trading**
   - Monitor the live market price chart
   - Click **BUY** to purchase E-Coins at current price
   - Click **SELL** to sell E-Coins
   - Use quick trade buttons: +1, +5, +10, +MAX (buy) or -1, -5, -10, -MAX (sell)

3. **Sabotage**
   - Spend ₹5,000 to freeze a competitor for 30 seconds
   - Strategic timing can give you a competitive edge

4. **Win Condition**
   - Highest net worth at the end of Round 3 wins!

### For Admins

1. **Access Admin Dashboard**
   - Navigate to `/admin`
   - Enter password (default: `ecell2024`)

2. **Start the Game**
   - Click "Start Game" to begin Round 1
   - Game loop starts automatically

3. **Control the Market**
   - **Trigger Crash**: Massive price drop (-18% per tick)
   - **Set Trends**: Bull (+4%), Bear (-10%), Spike (+12%)
   - **Send News**: Broadcast messages to all players
   - **Give Stimulus**: Add ₹500 to all players

4. **Manage Rounds**
   - Each round lasts 5 minutes
   - Game auto-pauses between rounds
   - Click "Start Round 2/3" to continue
   - Player data persists across rounds

## 🎨 Design

The application features a modern, professional design with:
- **Dark Theme**: Deep navy background (#0a0e1a)
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **E-Cell Branding**: Orange, blue, and purple color scheme
- **Gradient Headers**: Eye-catching text gradients
- **Responsive Layout**: Works on desktop, tablet, and mobile

## 🔧 Configuration

### Change Admin Password

Edit `components/admin/admin-login.tsx`:
```typescript
const ADMIN_PASSWORD = "your_new_password"
```

Or use environment variable:
```env
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

### Adjust Game Settings

Edit `hooks/use-game-loop.ts` to modify:
- Market volatility
- Crash intensity
- Price update frequency (default: 2 seconds)

### Customize Round Duration

Edit the database:
```sql
UPDATE market_state SET round_duration_seconds = 600; -- 10 minutes per round
```

## 📊 Game Mechanics

### Market Dynamics

| Trend | Effect | Use Case |
|-------|--------|----------|
| **Bull** | +3-5% per tick | Normal growth |
| **Bear** | -8-12% per tick | Steady decline |
| **Crash** | -12-15% per tick | Natural crash |
| **Triggered Crash** | -15-20% per tick | Admin-triggered panic |
| **Spike** | +10-15% per tick | Rapid growth |

### Round System

- **Total Game**: 15 minutes
- **Round 1**: 5 minutes
- **Round 2**: 5 minutes  
- **Round 3**: 5 minutes
- **Data Persistence**: Cash and stocks carry over between rounds

### Sabotage

- **Cost**: ₹5,000
- **Duration**: 30 seconds
- **Effect**: Target player cannot trade
- **Visual**: Purple "HACKED!" overlay with lightning bolts

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com/)
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🎯 E-Cell NITA

Built with ❤️ for E-Cell NITA competitions.

**Website**: [www.ecellnita.com](https://www.ecellnita.in/)

---

### 🐛 Known Issues

- Browser extensions may interfere with Supabase requests (disable for development)
- Ensure Supabase Realtime is enabled for all tables

### 💡 Tips

- **For Competition Day**: Change admin password before the event
- **Performance**: Game supports 20+ concurrent players
- **Testing**: Use multiple browser windows to simulate players
- **Market Drama**: Use crashes and spikes to create excitement!

### 📞 Support

For issues or questions, please open a GitHub issue or contact E-Cell NITA.

---

**Made with Next.js, TypeScript, and Supabase** 🚀
