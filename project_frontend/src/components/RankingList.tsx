import type React from "react"
import type { User } from "../types/user";
import { motion } from "framer-motion"

type RankingListProps = {
  users: User[]
  startRank: number
}

const RankingList: React.FC<RankingListProps> = ({ users, startRank }) => {
  return (
    <motion.div
      className="bg-[#1a1a1a] rounded-xl overflow-hidden"
      style={{
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          className="flex items-center p-4 border-b border-[#2a2a2a] hover:bg-[#252525] transition-all duration-200"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * index + 0.5 }}
          whileHover={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            transition: { duration: 0.1 },
          }}
        >
          <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-white font-medium text-sm">
            {startRank + index}
          </div>
          <div className="relative ml-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md p-[2px]">
              <img
                src={user.avatar || "/placeholder.svg?height=40&width=40"}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full overflow-hidden border border-[#1a1a1a]">
              <img
                src={user.flag || "/placeholder.svg?height=16&width=16"}
                alt="flag"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="font-medium text-white">{user.name}</p>
            <p className="text-sm text-gray-400">{user.points} points</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default RankingList

