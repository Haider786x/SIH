"use client"

import { createContext, useContext, useState, useEffect } from "react"

const XPContext = createContext()

export const useXP = () => {
  const context = useContext(XPContext)
  if (!context) {
    throw new Error("useXP must be used within an XPProvider")
  }
  return context
}

export const XPProvider = ({ children }) => {
  const [userXP, setUserXP] = useState(0)
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 5 })
  const [achievements, setAchievements] = useState([])
  const [learningStreak, setLearningStreak] = useState(0)

  // Load XP data from localStorage on mount
  useEffect(() => {
    const savedXP = localStorage.getItem("userXP")
    const savedWeeklyGoal = localStorage.getItem("weeklyGoal")
    const savedAchievements = localStorage.getItem("achievements")
    const savedStreak = localStorage.getItem("learningStreak")

    if (savedXP) setUserXP(Number.parseInt(savedXP))
    if (savedWeeklyGoal) setWeeklyGoal(JSON.parse(savedWeeklyGoal))
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements))
    if (savedStreak) setLearningStreak(Number.parseInt(savedStreak))
  }, [])

  // Save XP data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userXP", userXP.toString())
  }, [userXP])

  useEffect(() => {
    localStorage.setItem("weeklyGoal", JSON.stringify(weeklyGoal))
  }, [weeklyGoal])

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements))
  }, [achievements])

  useEffect(() => {
    localStorage.setItem("learningStreak", learningStreak.toString())
  }, [learningStreak])

  const addXP = (amount, source = "general") => {
    setUserXP((prev) => prev + amount)

    // Check for achievements
    checkAchievements(userXP + amount, source)

    // Update weekly goal if from quiz
    if (source === "quiz" || source === "ar-challenge") {
      setWeeklyGoal((prev) => ({
        ...prev,
        current: Math.min(prev.current + 1, prev.target),
      }))
    }

    // Show XP notification (you can implement a toast system here)
    console.log(`[XP] Gained ${amount} XP from ${source}!`)
  }

  const checkAchievements = (totalXP, source) => {
    const newAchievements = []

    // First XP achievement
    if (totalXP >= 25 && !achievements.find((a) => a.id === "first_xp")) {
      newAchievements.push({
        id: "first_xp",
        name: "First Steps",
        description: "Earned your first XP!",
        icon: "🌱",
        xpReward: 10,
      })
    }

    // AR Challenge achievement
    if (source === "ar-challenge" && !achievements.find((a) => a.id === "ar_master")) {
      newAchievements.push({
        id: "ar_master",
        name: "AR Explorer",
        description: "Completed first AR challenge!",
        icon: "📱",
        xpReward: 15,
      })
    }

    // High XP achievement
    if (totalXP >= 1000 && !achievements.find((a) => a.id === "xp_master")) {
      newAchievements.push({
        id: "xp_master",
        name: "XP Master",
        description: "Reached 1000 XP!",
        icon: "🏆",
        xpReward: 50,
      })
    }

    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements])
      // Add bonus XP for achievements
      const bonusXP = newAchievements.reduce((sum, achievement) => sum + achievement.xpReward, 0)
      if (bonusXP > 0) {
        setTimeout(() => setUserXP((prev) => prev + bonusXP), 1000)
      }
    }
  }

  const updateStreak = () => {
    const today = new Date().toDateString()
    const lastActivity = localStorage.getItem("lastActivityDate")

    if (lastActivity !== today) {
      setLearningStreak((prev) => prev + 1)
      localStorage.setItem("lastActivityDate", today)
    }
  }

  const resetWeeklyGoal = () => {
    setWeeklyGoal((prev) => ({ ...prev, current: 0 }))
  }

  const value = {
    userXP,
    weeklyGoal,
    achievements,
    learningStreak,
    addXP,
    updateStreak,
    resetWeeklyGoal,
    setWeeklyGoal,
  }

  return <XPContext.Provider value={value}>{children}</XPContext.Provider>
}
