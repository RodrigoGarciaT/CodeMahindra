"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

type Achievement = {
  id: string
  name: string
  category: string
  topic: string
  description: string
  icon: React.ReactNode
  earned?: boolean
}

type Props = {
  achievements: Achievement[]
}

const AchievementsSection: React.FC<Props> = ({ achievements }) => {
  const navigate = useNavigate()

  const earned = achievements.filter((a) => a.earned)
  const unearned = achievements.filter((a) => !a.earned)
  const total = achievements.length
  const progress = total > 0 ? (earned.length / total) * 100 : 0

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const renderAchievement = (achievement: Achievement, index: number) => (
    <motion.div
      key={achievement.id}
      variants={itemVariants}
      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl text-center border transition-all duration-300 shadow-lg overflow-hidden group cursor-pointer ${
        achievement.earned
          ? "bg-gradient-to-br from-white via-red-50 to-red-100 text-gray-800 border-red-200 hover:shadow-red-200/50"
          : "bg-gradient-to-br from-white to-gray-50 text-gray-500 border-gray-200 hover:shadow-gray-200/50"
      }`}
      whileHover={{
        scale: 1.05,
        y: -4,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      {achievement.earned && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-100/50 via-transparent to-red-100/50"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        />
      )}

      {achievement.earned && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                y: [-5, 5, -5],
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            >
              {["✨", "🎉", "⭐"][i]}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 text-xl relative ${
          achievement.earned ? "bg-red-100 border border-red-200" : "bg-gray-100 border border-gray-200"
        }`}
        whileHover={{ rotate: 10, scale: 1.1 }}
      >
        {achievement.earned && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-200 to-red-300 rounded-2xl blur-md opacity-50"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        <div className={`relative z-10 ${achievement.earned ? "text-red-500" : "text-gray-400"}`}>
          {achievement.icon}
        </div>
      </motion.div>

      <span className={`font-semibold text-sm mb-0.5 relative z-10 ${achievement.earned ? "text-gray-800" : "text-gray-500"}`}>
        {achievement.name}
      </span>
      <span className={`text-xs relative z-10 ${achievement.earned ? "text-gray-600" : "text-gray-400"}`}>
        {achievement.topic}
      </span>

      <div className="absolute top-2 right-2">
        {achievement.earned ? <span className="text-sm">🏆</span> : <span className="text-sm opacity-50">⏳</span>}
      </div>
    </motion.div>
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/95 backdrop-blur-sm text-gray-800 rounded-3xl p-5 shadow-2xl border border-red-100 relative overflow-hidden"
    >
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100/30 to-transparent rounded-full blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div variants={itemVariants} className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <span className="text-xl">🏅</span>
            Achievements
          </h2>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
            {earned.length} of {total} completed ({Math.round(progress)}%)
          </p>
        </div>
        <motion.button
          className="text-xs z-30 text-red-500 hover:text-red-600 font-medium transition-all duration-300 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 flex items-center gap-2"
          onClick={() => navigate("/achievements")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View more</span>
        </motion.button>

      </motion.div>

      <motion.div variants={itemVariants} className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-red-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-red-100 rounded-full h-3.5 overflow-hidden shadow-inner border border-red-200 relative">
          <motion.div
            className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 h-3.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: [-100, 200] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </motion.div>

      {earned.length > 0 && (
        <motion.div variants={itemVariants} className="mb-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">⭐</span>
            Recent achievements
            <motion.span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {earned.length} earned
            </motion.span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {earned.slice(-3).map((achievement, index) => renderAchievement(achievement, index))}
          </div>
        </motion.div>
      )}

      {/*
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          Upcoming goals
          <motion.span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {unearned.length} remaining
          </motion.span>
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {unearned.slice(0, 3).map((achievement, index) => renderAchievement(achievement, index + 3))}
        </div>
      </motion.div>
      */}

      {progress > 0 && (
        <motion.div
          variants={itemVariants}
          className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200"
        >
          <p className="text-sm text-gray-700 text-center">
            {progress >= 100
              ? "Amazing! You've completed all achievements! 🎉"
              : progress >= 75
              ? "You're almost there! Keep pushing! 💪"
              : progress >= 50
              ? "Great progress! You're halfway there! 🚀"
              : progress >= 25
              ? "Good start! Keep building momentum! ⚡"
              : "Your achievement journey begins now! 🌟"}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default AchievementsSection
