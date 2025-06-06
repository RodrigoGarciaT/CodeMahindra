"use client"

import type React from "react"
import { motion } from "framer-motion"
import type { User } from "../types/user"

type UserStatusCardProps = {
  user?: User | null
  percentile: number
}

// 🔥 función para obtener la bandera a partir de nationality
const getFlagForUser = (user: User | null | undefined): string => {
  if (!user || !user.nationality) return "https://static.vecteezy.com/system/resources/thumbnails/007/095/871/small/usa-realistic-waving-flag-illustration-national-country-background-symbol-independence-day-free-vector.jpg"

  const nationalityToFlag: Record<string, string> = {
    "BR": "https://flagcdn.com/w320/br.png",
    "MX": "https://flagcdn.com/w320/mx.png",
    "AR": "https://flagcdn.com/w320/ar.png",
    "ES": "https://flagcdn.com/w320/es.png",
    "SV": "https://flagcdn.com/w320/sv.png",
    "DE": "https://flagcdn.com/w320/de.png",
    "CA": "https://flagcdn.com/w320/ca.png",
    "PE": "https://flagcdn.com/w320/pe.png",
    "US": "https://flagcdn.com/w320/us.png",
    "No especificado": "https://static.vecteezy.com/system/resources/thumbnails/007/095/871/small/usa-realistic-waving-flag-illustration-national-country-background-symbol-independence-day-free-vector.jpg"
  }

  return nationalityToFlag[user.nationality] || nationalityToFlag["No especificado"]
}

const UserStatusCard: React.FC<UserStatusCardProps> = ({ user, percentile }) => {
  if (!user) {
    // 🚫 Fallback cuando no hay ranking
    return (
      <motion.div
        className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-5 text-white text-center"
        style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
      >
        <p className="text-xl font-bold mb-2">🚫 Not ranked yet</p>
        <p className="text-sm opacity-80">You need to gain experience to appear in the ranking.</p>
      </motion.div>
    )
  }

  // 👀 nombre que se muestra
  const displayName =
    user.name && user.name.startsWith("http")
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User"
      : user.name

  return (
    <motion.div
      className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl p-5 relative overflow-hidden"
      style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 165, 0, 0.2)",
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-4 relative z-10">
        {/* Rank circle */}
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
          <span className="text-orange-500 text-xl font-bold">
            {user.rank ? `#${user.rank}` : "-"}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* 👤 Nombre completo */}
          <p className="text-white font-bold text-2xl mb-1">{displayName}</p>

          <p className="text-white font-bold text-lg">You are doing better than</p>
          <p className="text-white text-2xl font-extrabold">{percentile}% of other players</p>

          <div className="mt-2 text-white text-sm">
            <p><strong>Points:</strong> {user.coins.toLocaleString()} QP</p>
            {user.position && <p><strong>Position:</strong> {user.position}</p>}
            {user.team && <p><strong>Team:</strong> {user.team}</p>}
            {user.nationality && (
              <div className="flex items-center gap-2 mt-1">
                <p><strong>Nationality:</strong> {user.nationality}</p>
                <img
                  src={getFlagForUser(user)}
                  alt={user.nationality}
                  className="w-6 h-6 rounded-sm border border-gray-800"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 bg-white bg-opacity-30 h-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentile}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </motion.div>
  )
}

export default UserStatusCard