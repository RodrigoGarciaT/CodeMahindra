"use client"

import type React from "react"
import type { User } from "../types/user";
import { motion } from "framer-motion"

type TopPlayerCardProps = {
  user: User
}

const TopPlayerCard: React.FC<TopPlayerCardProps> = ({ user }) => {
  return (
    <motion.div
      className="bg-[#1a1a1a] rounded-xl p-4 flex items-center gap-3"
      style={{
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 255, 255, 0.1)",
        transition: { duration: 0.2 },
      }}
    >
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md p-[2px]">
        <img
          src={user.avatar || "/placeholder.svg?height=40&width=40"}
          alt={user.name}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="font-medium text-white text-lg">{user.name}</p>
      </div>
      <div className="w-8 h-8 rounded-full overflow-hidden shadow-md">
        <img
          src={user.flag || "/placeholder.svg?height=24&width=24"}
          alt="flag"
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  )
}

export default TopPlayerCard




