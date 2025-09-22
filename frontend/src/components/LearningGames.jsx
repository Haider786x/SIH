"use client"

import { useState } from "react"
import { Search, LogOut, Gamepad2, Trophy, Clock, Star, Target, Camera } from "lucide-react"
import ARChallenge from "./ARChallenge"

const LearningGames = ({ user, onLogout, onXPGain }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showARChallenge, setShowARChallenge] = useState(false)
  const [userXP, setUserXP] = useState(1250) // Mock XP value

  const handleARComplete = (xpGained) => {
    setUserXP((prev) => prev + xpGained)
    if (onXPGain) {
      onXPGain(xpGained)
    }
    setShowARChallenge(false)
  }

  const games = [
    {
      id: 1,
      title: "Grow Your Tree",
      description: "Learn about plant growth and ecosystems!",
      xp: 15,
      category: "Educational",
      duration: "5-10 min",
      color: "from-green-500 to-emerald-500",
      icon: "🌳",
      difficulty: "Beginner",
    },
    {
      id: 2,
      title: "Sort the Trash",
      description: "Master waste management and recycling!",
      xp: 20,
      category: "Skill Building",
      duration: "3-7 min",
      color: "from-orange-500 to-red-500",
      icon: "🗑️",
      difficulty: "Intermediate",
    },
    {
      id: 3,
      title: "Lightning Quiz",
      description: "Test your knowledge against the clock!",
      xp: 25,
      category: "Fast-paced",
      duration: "2-5 min",
      color: "from-purple-500 to-pink-500",
      icon: "⚡",
      difficulty: "Advanced",
    },
    {
      id: 4,
      title: "Global Leaderboard",
      description: "Compete with students worldwide!",
      xp: 0,
      category: "Competitive",
      duration: "Ongoing",
      color: "from-red-500 to-orange-500",
      icon: "🏆",
      difficulty: "All Levels",
      isLeaderboard: true,
    },
    {
      id: 5,
      title: "Climate Simulator",
      description: "Explore climate change scenarios!",
      xp: 30,
      category: "Simulation",
      duration: "10-15 min",
      color: "from-blue-500 to-cyan-500",
      icon: "📊",
      difficulty: "Intermediate",
    },
    {
      id: 6,
      title: "Eco-Hero Challenge",
      description: "Complete daily environmental missions!",
      xp: 40,
      category: "Daily",
      duration: "Varies",
      color: "from-teal-500 to-green-500",
      icon: "🦸",
      difficulty: "All Levels",
      isDaily: true,
    },
  ]

  const filteredGames = games.filter(
    (game) =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-purple-800/30 backdrop-blur-xl border-b border-purple-400/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Games</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-purple-800/50 border border-purple-400/30 rounded-xl pl-10 pr-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1"></div>
              <div className="bg-purple-800/50 p-2 rounded-xl border border-purple-400/30">
                <svg className="h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M9 11h.01M9 8h.01"
                  />
                </svg>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Learning Games</h2>
              <p className="text-purple-200">Earn XP while playing!</p>
            </div>
          </div>

          <div className="bg-purple-800/30 backdrop-blur-xl border border-purple-400/20 rounded-2xl px-6 py-3">
            <span className="text-purple-200 text-sm">Earn XP while playing!</span>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Game Icon & XP Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{game.icon}</div>
                  {game.xp > 0 && (
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      +{game.xp} XP
                    </div>
                  )}
                </div>

                {/* Game Info */}
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-blue-200 text-sm mb-4">{game.description}</p>

                {/* Game Stats */}
                <div className="flex items-center justify-between text-xs text-purple-300 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>{game.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{game.duration}</span>
                  </div>
                </div>

                {/* Action Button */}
                {game.isLeaderboard ? (
                  <button
                    className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2`}
                  >
                    <Trophy className="h-5 w-5" />
                    <span>View Rankings</span>
                  </button>
                ) : game.isDaily ? (
                  <button
                    className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2`}
                  >
                    <Target className="h-5 w-5" />
                    <span>Accept Challenge</span>
                  </button>
                ) : (
                  <button
                    className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2`}
                  >
                    <Gamepad2 className="h-5 w-5" />
                    <span>Play Now</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* AR Challenge Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">📱</div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  +25 XP
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">AR Eco-Challenge</h3>
              <p className="text-blue-200 text-sm mb-4">Real-world environmental scanning</p>

              <div className="flex items-center justify-between text-xs text-purple-300 mb-4">
                <div className="flex items-center space-x-1">
                  <Camera className="h-3 w-3" />
                  <span>AR Experience</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>2-3 min</span>
                </div>
              </div>

              <button
                onClick={() => setShowARChallenge(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Camera className="h-5 w-5" />
                <span>Start AR Scan</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* AR Challenge Modal */}
      <ARChallenge isOpen={showARChallenge} onClose={() => setShowARChallenge(false)} onComplete={handleARComplete} />
    </div>
  )
}

export default LearningGames
