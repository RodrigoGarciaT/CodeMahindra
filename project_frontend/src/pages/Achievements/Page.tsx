"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Trophy,
  Target,
  Crown,
  Flame,
  Code,
  BookOpen,
  Users,
  Zap,
  Award,
  Rocket,
  Heart,
  Coffee,
  Lightbulb,
  Puzzle,
  Map,
  Compass,
  Gift,
  Medal,
  Shield,
} from "lucide-react"

// Definición de Fire personalizado ANTES de usarlo
const Fire = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    <path d="M12 14c.5-.5.5-2 0-2.5-.5.5-2 1-2 2 0 .5.5 1 1 1" />
  </svg>
)

type Achievement = {
  id: string
  name: string
  category: string
  topic: string
  description: string
  icon: React.ReactNode
  earned?: boolean
  rarity?: "Common" | "Rare" | "Epic" | "Legendary"
  points?: number
}

const rarityConfig = {
  Common: {
    color: "text-gray-700",
    bgColor: "bg-gray-200",
    borderColor: "border-gray-300",
    glowColor: "shadow-gray-200/40",
    icon: <Medal className="w-4 h-4" />,
  },
  Rare: {
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    glowColor: "shadow-red-200/40",
    icon: <Shield className="w-4 h-4" />,
  },
  Epic: {
    color: "text-rose-700",
    bgColor: "bg-rose-100",
    borderColor: "border-rose-300",
    glowColor: "shadow-rose-200/40",
    icon: <Crown className="w-4 h-4" />,
  },
  Legendary: {
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
    glowColor: "shadow-amber-200/40",
    icon: <Trophy className="w-4 h-4" />,
  },
}

const categoryIcons = {
  coding: <Code className="w-5 h-5" />,
  learning: <BookOpen className="w-5 h-5" />,
  social: <Users className="w-5 h-5" />,
  streak: <Flame className="w-5 h-5" />,
  milestone: <Target className="w-5 h-5" />,
  special: <Crown className="w-5 h-5" />,
  beginner: <Rocket className="w-5 h-5" />,
  intermediate: <Zap className="w-5 h-5" />,
  advanced: <Award className="w-5 h-5" />,
  expert: <Gift className="w-5 h-5" />,
}

// Iconos específicos para logros - AHORA Fire está definido
const achievementIcons = {
  firstCode: <Code className="w-6 h-6" />,
  streak7: <Flame className="w-6 h-6" />,
  streak30: <Fire className="w-6 h-6" />,
  community: <Users className="w-6 h-6" />,
  perfectScore: <Award className="w-6 h-6" />,
  fastLearner: <Zap className="w-6 h-6" />,
  nightOwl: <Coffee className="w-6 h-6" />,
  innovator: <Lightbulb className="w-6 h-6" />,
  puzzleMaster: <Puzzle className="w-6 h-6" />,
  explorer: <Map className="w-6 h-6" />,
  pathfinder: <Compass className="w-6 h-6" />,
  contributor: <Heart className="w-6 h-6" />,
  default: <Trophy className="w-6 h-6" />,
}

// Función para obtener el icono correcto según el ID del logro
const getAchievementIcon = (id: string) => {
  const iconKey = id as keyof typeof achievementIcons
  return achievementIcons[iconKey] || achievementIcons.default
}

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem("user_id")
    if (!userId) return

    fetch(`${import.meta.env.VITE_BACKEND_URL}/achievements/status/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const earned =
          data.earned?.map((a: Achievement) => ({
            ...a,
            earned: true,
            rarity: a.rarity || "Common",
            points: a.points || 10,
            // Asignar icono específico según el ID
            icon: getAchievementIcon(a.id),
          })) || []
        const unearned =
          data.unearned?.map((a: Achievement) => ({
            ...a,
            earned: false,
            rarity: a.rarity || "Common",
            points: a.points || 10,
            // Asignar icono específico según el ID
            icon: getAchievementIcon(a.id),
          })) || []
        setAchievements([...earned, ...unearned])
      })
      .catch((err) => console.error("Failed to load achievements:", err))
  }, [])

  const total = achievements.length
  const earned = achievements.filter((a) => a.earned).length
  const progress = total > 0 ? Math.round((earned / total) * 100) : 0
  const totalPoints = achievements.filter((a) => a.earned).reduce((sum, a) => sum + (a.points || 0), 0)

  const categories = ["all", ...new Set(achievements.map((a) => a.category))]
  const filteredAchievements =
    selectedCategory === "all" ? achievements : achievements.filter((a) => a.category === selectedCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 px-6 py-10 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.05)_25px,rgba(255,255,255,0.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,0.05)_75px,rgba(255,255,255,0.05)_76px,transparent_77px),linear-gradient(rgba(255,255,255,0.05)_24px,transparent_25px,transparent_26px,rgba(255,255,255,0.05)_27px,rgba(255,255,255,0.05)_74px,transparent_75px,transparent_76px,rgba(255,255,255,0.05)_77px)] bg-[length:100px_100px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-8 flex items-center">
            <Link to="/home" className="mr-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="text-white h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-white text-3xl font-bold flex items-center gap-2">Achievements</h1>
              <p className="text-slate-400">Unlock milestones and track your progress</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-4">
            <motion.div
              className="bg-white/95 backdrop-blur-md border border-red-200 px-6 py-4 rounded-2xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, borderColor: "rgba(239, 68, 68, 0.3)" }}
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <span className="text-red-600 text-2xl font-bold">{earned}</span>
                  </div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>

                <div className="w-px h-8 bg-red-200" />

                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏳</span>
                    <span className="text-gray-800 text-2xl font-bold">{total - earned}</span>
                  </div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>

                <div className="w-px h-8 bg-red-200" />

                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📈</span>
                    <span className="text-red-500 text-2xl font-bold">{progress}%</span>
                  </div>
                  <div className="text-xs text-gray-600">Progress</div>
                </div>

                <div className="w-px h-8 bg-red-200" />

                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <span className="text-amber-600 text-2xl font-bold">{totalPoints}</span>
                  </div>
                  <div className="text-xs text-gray-600">Points</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-red-200 relative overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Background glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-50/80 via-transparent to-red-50/80"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <motion.div
                  className="p-3 bg-red-100 rounded-2xl border border-red-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-2xl">🎯</span>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Overall Progress</h2>
                  <p className="text-gray-600">
                    {earned} of {total} achievements unlocked 🚀
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">✨</span>
                  <span className="text-gray-800 font-bold text-3xl">{progress}%</span>
                </div>
                <div className="w-64 bg-red-100 rounded-full h-3 relative overflow-hidden border border-red-200">
                  <motion.div
                    className="bg-gradient-to-r from-red-400 via-red-500 to-red-400 h-3 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      animate={{ x: [-100, 300] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2
                    ${
                      selectedCategory === category
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                        : "bg-white border border-red-200 text-gray-700 hover:bg-red-50"
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {categoryIcons[category as keyof typeof categoryIcons] || <Target className="w-4 h-4" />}
                  <span className="capitalize">{category}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement) => {
              const rarity = achievement.rarity || "Common"
              const config = rarityConfig[rarity]
              const isHovered = hoveredAchievement === achievement.id

              return (
                <motion.div
                  key={achievement.id}
                  variants={itemVariants}
                  layout
                  className="relative group"
                  onMouseEnter={() => setHoveredAchievement(achievement.id)}
                  onMouseLeave={() => setHoveredAchievement(null)}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5,
                    z: 50,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  <div
                    className={`
    relative p-6 rounded-3xl cursor-pointer text-center border transition-all duration-500 overflow-hidden
    ${
      achievement.earned
        ? "bg-white/95 backdrop-blur-md border-red-300/50 shadow-lg shadow-red-300/10"
        : "bg-white/80 backdrop-blur-sm border-red-200"
    }
  `}
                  >
                    {/* Background glow for earned achievements */}
                    {achievement.earned && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-100/50 via-white/30 to-red-100/50 rounded-3xl"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    {/* Lock overlay for unearned */}
                    {!achievement.earned && (
                      <div className="absolute inset-0 bg-gray-200/80 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                        <span className="text-4xl">🔒</span>
                      </div>
                    )}

                    {/* Rarity indicator */}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${config.bgColor} border ${config.borderColor}`} />
                    </div>

                    {/* Icon */}
                    <div className="relative z-10 mb-4">
                      <motion.div
                        className={`
        w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl relative
        ${achievement.earned ? "bg-red-100 border border-red-300" : "bg-gray-100 border border-gray-300"}
      `}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {achievement.earned && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-300 to-red-400 rounded-2xl blur-lg opacity-30"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                        <div className={achievement.earned ? "text-red-500" : "text-gray-400"}>{achievement.icon}</div>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3
                        className={`font-bold text-sm mb-1 truncate ${achievement.earned ? "text-gray-800" : "text-gray-500"}`}
                      >
                        {achievement.name}
                      </h3>
                      <p className={`text-xs mb-2 ${achievement.earned ? "text-gray-600" : "text-gray-400"}`}>
                        {achievement.topic}
                      </p>

                      {/* Rarity badge */}
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          achievement.earned ? config.bgColor : "bg-gray-100"
                        } ${achievement.earned ? config.color : "text-gray-500"} border ${
                          achievement.earned ? config.borderColor : "border-gray-300"
                        }`}
                      >
                        {config.icon}
                        <span>{rarity}</span>
                      </div>

                      {/* Points */}
                      {achievement.earned && (
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <span className="text-sm">⭐</span>
                          <span className="text-xs text-red-500 font-semibold">+{achievement.points}</span>
                        </div>
                      )}
                    </div>

                    {/* Floating particles for earned achievements */}
                    {achievement.earned && isHovered && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute text-xs"
                            style={{
                              left: `${20 + i * 12}%`,
                              top: `${30 + (i % 2) * 20}%`,
                            }}
                            animate={{
                              y: [-10, 10, -10],
                              opacity: [0.3, 1, 0.3],
                              scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.2,
                              ease: "easeInOut",
                            }}
                          >
                            {["✨", "🎉", "⭐", "🔥", "💫", "🌟"][i]}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 p-4 rounded-2xl text-sm bg-white/95 backdrop-blur-md border border-red-200 shadow-2xl"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`p-2 rounded-lg ${
                              achievement.earned ? config.bgColor : "bg-gray-100"
                            } border ${achievement.earned ? config.borderColor : "border-gray-300"}`}
                          >
                            <div className={achievement.earned ? config.color : "text-gray-400"}>
                              {achievement.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 mb-1">{achievement.name}</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  achievement.earned ? config.bgColor : "bg-gray-100"
                                } ${achievement.earned ? config.color : "text-gray-500"} border ${
                                  achievement.earned ? config.borderColor : "border-gray-300"
                                }`}
                              >
                                {rarity}
                              </span>
                              <span className="text-xs text-gray-600">{achievement.category}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed mb-3">{achievement.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {achievement.earned ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <span className="text-sm">✅</span>
                                <span className="text-xs font-semibold">Unlocked</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-500">
                                <span className="text-sm">🔒</span>
                                <span className="text-xs">Locked</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-sm">⭐</span>
                            <span className="text-xs text-red-500 font-semibold">{achievement.points} pts</span>
                          </div>
                        </div>

                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white/95" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Achievements
