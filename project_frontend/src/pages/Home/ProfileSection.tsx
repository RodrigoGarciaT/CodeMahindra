"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"
import CountryName from "../Home/CountryName"

type Props = {
  user: {
    profilePicture: string
    firstName: string
    lastName: string
    experience: number
    nationality: string
  }
}

const ProfileSection: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate()

  const level = Math.floor((user?.experience ?? 0) / 1000)
  const progress = ((user?.experience ?? 0) % 1000) / 10

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 shadow-2xl border border-red-100 text-gray-800 relative overflow-hidden"
    >
      {/* Background decoration */}
      <motion.div
        className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-100/40 to-transparent rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-between items-center mb-4"
      >
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>👤</span> Profile
        </h2>
        <motion.button
          className="text-xs z-30 text-red-500 hover:text-red-600 font-medium transition-all duration-300 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 flex items-center gap-2"
          onClick={() => navigate("/profile")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View more</span>
        </motion.button>

      </motion.div>

      {/* User box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white to-red-50 p-4 rounded-2xl mb-4 shadow-lg border border-red-200 relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-transparent to-red-100/30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 flex items-center gap-4">
          <motion.div className="relative" whileHover={{ scale: 1.1, rotate: 5 }}>
            {user?.profilePicture ? (
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-red-300 shadow-md">
                <img
                  src={user.profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-lg font-bold border-2 border-red-300 shadow-md">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </div>
            )}

            {/* Online indicator */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-800 leading-tight">
              {user?.firstName} {user?.lastName}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <span>🌍</span>
              {user?.nationality ? (
                <CountryName code={user.nationality} />
              ) : (
                <span className="text-gray-500">No nationality</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <TrendingUp className="w-4 h-4 text-red-600" />
          </motion.div>
          <h3 className="font-bold text-base text-gray-800">Progress</h3>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex justify-between text-xs text-gray-700 mb-2">
            <span className="flex items-center gap-1">
              👑 Level <span className="text-red-600 font-bold">{level}</span>
            </span>
            <span className="flex items-center gap-1">
              ⚡ <span className="font-semibold">{user?.experience} XP</span>
            </span>
          </div>

          <div className="w-full bg-red-200 rounded-full h-3 overflow-hidden shadow-inner border border-red-300 relative">
            <motion.div
              className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 h-3 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-100, 200] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>

          <div className="flex justify-between text-[11px] text-gray-600 mt-1">
            <span>Level {level}</span>
            <span className="font-semibold">{Math.round(progress)}% to next</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProfileSection
