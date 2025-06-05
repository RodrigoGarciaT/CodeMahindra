"use client"

import type React from "react"
import { motion } from "framer-motion"
import type { User } from "@/types/user"

type UserStatusCardProps = {
  user: User
  percentile: number
}

const UserStatusCard: React.FC<UserStatusCardProps> = ({ user, percentile }) => {
  // Validación de datos
  const rank = user.rank ? `#${user.rank}` : "-";
  const points = user.coins ? user.coins.toLocaleString() : "0";
  const position = user.position || "N/A";
  const team = user.team || "N/A";
  
  // Aseguramos que percentile esté en el rango adecuado (0-100)
  const validPercentile = Math.min(Math.max(percentile, 0), 100);

  return (
    <motion.div
      className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl p-5 relative overflow-hidden"
      style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 165, 0, 0.2)",
      }}
      transition={{ duration: 0.2 }}
      aria-labelledby="user-status-card"
    >
      <div className="flex items-start gap-4 relative z-10">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg flex-shrink-0 mt-1" aria-label={`Rank: ${rank}`}>
          <span className="text-orange-500 text-xl font-bold">
            {rank}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-lg" id="user-status-card">You are doing better than</p>
          <p className="text-white text-2xl font-extrabold">{validPercentile}% of other players</p>
          <div className="mt-2 text-white text-sm">
            <p><strong>Points:</strong> {points} QP</p>
            <p><strong>Position:</strong> {position}</p>
            <p><strong>Team:</strong> {team}</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 bg-white bg-opacity-30 h-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${validPercentile}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          aria-label={`Progress bar: ${validPercentile}%`}
        />
      </div>
    </motion.div>
  )
}

export default UserStatusCard