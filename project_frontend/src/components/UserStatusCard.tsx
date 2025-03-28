"use client"

import type React from "react"
import { motion } from "framer-motion"

type UserStatusCardProps = {
  rank: number
  percentile: number
}

const UserStatusCard: React.FC<UserStatusCardProps> = ({ rank, percentile }) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-orange-400 to-orange-300 rounded-xl p-5 flex items-center gap-4"
      style={{
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(251, 146, 60, 0.3)",
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3), 0 0 30px rgba(251, 146, 60, 0.4)",
        transition: { duration: 0.2 },
      }}
    >
      <div
        className="bg-white rounded-full w-16 h-16 flex items-center justify-center text-orange-500 font-bold text-2xl shadow-md"
        style={{
          boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        #{rank}
      </div>
      <div className="text-white">
        <p className="font-medium">You are doing better than</p>
        <p
          className="text-2xl font-bold"
          style={{
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
          }}
        >
          {percentile}% of other players!
        </p>
      </div>
    </motion.div>
  )
}

export default UserStatusCard

