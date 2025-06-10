"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronRight, CheckCircle, Brain, MessageSquareCode } from "lucide-react"

const WeeklyChallengesSection: React.FC = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 shadow-2xl border border-gray-200 text-gray-800 relative overflow-hidden"
    >
      {/* Backgrounds */}
      <motion.div
        className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-red-100/30 to-transparent rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10"
      >
        <span className="text-xl">🔥</span> Weekly Challenges
      </motion.h2>

      {/* Buttons */}
      <div className="space-y-3 relative z-10">
        {[
          {
            label: "Complete tasks",
            icon: <CheckCircle className="w-5 h-5" />,
            to: "/tasks",
            gradient: "from-red-500 to-red-600",
            border: "border-red-400/50",
            shadow: "shadow-red-500/40",
            delay: 0.2,
            particles: ["✨", "🎉", "⭐", "🔥"],
          },
          {
            label: "Solve a problem",
            icon: <Brain className="w-5 h-5" />,
            to: "/problems",
            gradient: "from-purple-500 to-purple-600",
            border: "border-purple-400/50",
            shadow: "shadow-purple-500/40",
            delay: 0.3,
            particles: ["🧩", "💡", "⚡", "🎯"],
          },
          {
            label: "View code feedback",
            icon: <MessageSquareCode className="w-5 h-5" />,
            to: "/repos",
            gradient: "from-blue-500 to-cyan-600",
            border: "border-blue-400/50",
            shadow: "shadow-blue-500/40",
            delay: 0.4,
            particles: ["💬", "📝", "⭐", "🎨"],
          },
        ].map(({ label, icon, to, gradient, border, shadow, delay, particles }, i) => (
          <motion.button
            key={label}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full bg-gradient-to-r ${gradient} hover:brightness-110 text-white p-4 rounded-xl flex justify-between items-center font-medium shadow-md hover:${shadow} transition-all duration-300 relative overflow-hidden group border-2 ${border}`}
            onClick={() => navigate(to)}
            whileHover={{
              scale: 1.02,
              y: -2,
            }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Animated light */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10"
              animate={{ x: [-100, 300], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {particles.map((p, j) => (
                <motion.div
                  key={j}
                  className="absolute text-white/40 text-sm"
                  style={{
                    left: `${20 + j * 20}%`,
                    top: `${30 + (j % 2) * 20}%`,
                  }}
                  animate={{
                    y: [-5, 5, -5],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: j * 0.2,
                    ease: "easeInOut",
                  }}
                >
                  {p}
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <span className="flex items-center gap-2 relative z-10">
              <motion.div
                className="p-1.5 bg-white/20 rounded-lg border border-white/30 backdrop-blur-sm"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {icon}
              </motion.div>
              <span className="text-base">{label}</span>
            </span>
            <motion.div className="relative z-10" whileHover={{ x: 6, scale: 1.1 }}>
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        ))}
      </div>
    </motion.div>

  )
}

export default WeeklyChallengesSection
