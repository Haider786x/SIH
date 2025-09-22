"use client"

import { useState } from "react"
import { Trophy, Target, Lightbulb, CheckCircle, Zap, Award, TrendingUp } from "lucide-react"

const ProgressDashboard = ({ user }) => {
  const [weeklyProgress, setWeeklyProgress] = useState({
    current: 2,
    target: 5,
    percentage: 40,
  })

  const [learningPath, setLearningPath] = useState({
    title: "Climate Champion",
    description: "Your personalized learning journey",
    progress: 65,
    currentLevel: "Advanced",
    levels: [
      { name: "Basics", completed: true },
      { name: "Intermediate", completed: true },
      { name: "Advanced", completed: false, current: true },
      { name: "Expert", completed: false },
    ],
  })

  const [todaysInspiration, setTodaysInspiration] = useState({
    quote: "Your learning journey is as unique as a fingerprint! ✨",
    context: "Personalized for your Climate Champion journey",
  })

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      name: "First Steps",
      description: "Completed first quiz",
      icon: "🌱",
      unlocked: true,
    },
    {
      id: 2,
      name: "Streak Master",
      description: "7-day learning streak",
      icon: "🔥",
      unlocked: true,
    },
    {
      id: 3,
      name: "Climate Aware",
      description: "Climate change expert",
      icon: "🌍",
      unlocked: true,
    },
    {
      id: 4,
      name: "Quick Learner",
      description: "Fast quiz completion",
      icon: "⚡",
      unlocked: true,
    },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Weekly Goal Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-teal-400/30 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 p-3 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Weekly Goal</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-teal-300">
                {weeklyProgress.current}/{weeklyProgress.target}
              </span>
              <span className="text-teal-200 text-sm ml-1">quizzes</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-teal-800/30 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-teal-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${weeklyProgress.percentage}%` }}
              ></div>
            </div>
          </div>

          <p className="text-teal-200 text-sm">
            {weeklyProgress.target - weeklyProgress.current} more quizzes to reach your weekly goal!
          </p>
        </div>

        {/* Climate Champion Learning Path */}
        <div className="bg-white/10 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{learningPath.title}</h3>
                <p className="text-blue-200 text-sm">{learningPath.description}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-300">{learningPath.progress}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-blue-800/30 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${learningPath.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Learning Levels */}
          <div className="grid grid-cols-4 gap-4">
            {learningPath.levels.map((level, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    level.completed
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                      : level.current
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"
                        : "bg-blue-800/30 border-2 border-blue-600/50"
                  }`}
                >
                  {level.completed ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : level.current ? (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-blue-400/50 rounded-full"></div>
                  )}
                </div>
                <p
                  className={`text-sm font-medium ${level.completed || level.current ? "text-white" : "text-blue-400"}`}
                >
                  {level.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Inspiration */}
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-xl border border-orange-400/30 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Today's Inspiration</h3>
          </div>

          <blockquote className="text-lg text-white italic mb-3 leading-relaxed">
            "{todaysInspiration.quote}"
          </blockquote>

          <p className="text-orange-200 text-sm">{todaysInspiration.context}</p>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white/10 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Recent Achievements</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="text-center group">
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-2xl p-4 hover:bg-purple-600/30 transition-all duration-300 group-hover:scale-105">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4 className="text-white font-bold text-sm mb-1">{achievement.name}</h4>
                  <p className="text-purple-200 text-xs">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">Total XP</h4>
                <p className="text-3xl font-bold text-green-300">1,250</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">Quizzes Completed</h4>
                <p className="text-3xl font-bold text-blue-300">24</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">Current Streak</h4>
                <p className="text-3xl font-bold text-yellow-300">7 days</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressDashboard
