"use client"
import type React from "react"
import type { User } from "@/types/user"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Trophy, Users } from "lucide-react"

type RankingListProps = {
  users: User[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const getFlagForUser = (user: User): string => {
  if (!user || !user.nationality) return "https://flagcdn.com/w320/us.png"
  
  const nationalityToFlag: Record<string, string> = {
    // América
    AR: "https://flagcdn.com/w320/ar.png",
    BO: "https://flagcdn.com/w320/bo.png",
    BR: "https://flagcdn.com/w320/br.png",
    CL: "https://flagcdn.com/w320/cl.png",
    CO: "https://flagcdn.com/w320/co.png",
    CR: "https://flagcdn.com/w320/cr.png",
    CU: "https://flagcdn.com/w320/cu.png",
    DO: "https://flagcdn.com/w320/do.png",
    EC: "https://flagcdn.com/w320/ec.png",
    SV: "https://flagcdn.com/w320/sv.png",
    GT: "https://flagcdn.com/w320/gt.png",
    HN: "https://flagcdn.com/w320/hn.png",
    MX: "https://flagcdn.com/w320/mx.png",
    NI: "https://flagcdn.com/w320/ni.png",
    PA: "https://flagcdn.com/w320/pa.png",
    PY: "https://flagcdn.com/w320/py.png",
    PE: "https://flagcdn.com/w320/pe.png",
    PR: "https://flagcdn.com/w320/pr.png",
    UY: "https://flagcdn.com/w320/uy.png",
    VE: "https://flagcdn.com/w320/ve.png",
    US: "https://flagcdn.com/w320/us.png",
    CA: "https://flagcdn.com/w320/ca.png",

    // Europa
    DE: "https://flagcdn.com/w320/de.png",
    ES: "https://flagcdn.com/w320/es.png",
    FR: "https://flagcdn.com/w320/fr.png",
    GB: "https://flagcdn.com/w320/gb.png",
    IT: "https://flagcdn.com/w320/it.png",
    NL: "https://flagcdn.com/w320/nl.png",
    PT: "https://flagcdn.com/w320/pt.png",
    BE: "https://flagcdn.com/w320/be.png",
    CH: "https://flagcdn.com/w320/ch.png",
    AT: "https://flagcdn.com/w320/at.png",
    SE: "https://flagcdn.com/w320/se.png",
    NO: "https://flagcdn.com/w320/no.png",
    DK: "https://flagcdn.com/w320/dk.png",
    FI: "https://flagcdn.com/w320/fi.png",
    IE: "https://flagcdn.com/w320/ie.png",
    PL: "https://flagcdn.com/w320/pl.png",
    CZ: "https://flagcdn.com/w320/cz.png",
    HU: "https://flagcdn.com/w320/hu.png",
    RO: "https://flagcdn.com/w320/ro.png",

    // Asia (comunes)
    CN: "https://flagcdn.com/w320/cn.png",
    JP: "https://flagcdn.com/w320/jp.png",
    KR: "https://flagcdn.com/w320/kr.png",
    IN: "https://flagcdn.com/w320/in.png",

    // Otros
    AU: "https://flagcdn.com/w320/au.png",
    NZ: "https://flagcdn.com/w320/nz.png",
    ZA: "https://flagcdn.com/w320/za.png",

    // Fallback
    "NO ESPECIFICADO": "https://flagcdn.com/w320/us.png",
  }
  
  return (
    nationalityToFlag[user.nationality?.toUpperCase?.()] ||
    nationalityToFlag["NO ESPECIFICADO"]
  )
}

const getRankColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-[0_0_15px_rgba(255,215,0,0.6)]"
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-black shadow-[0_0_10px_rgba(192,192,192,0.5)]"
    case 3:
      return "bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-[0_0_10px_rgba(180,83,9,0.5)]"
    default:
      return "bg-[#333]/70 text-white/90"
  }
}

const RankingList: React.FC<RankingListProps> = ({ users, currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <Users className="h-5 w-5 text-cyan-300" />
        <span>Top Users List</span>
      </h2>

      <motion.div
        className="bg-[#1e1e1e]/60 rounded-xl overflow-hidden flex-grow flex flex-col backdrop-blur-sm"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-grow">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              className="flex items-center p-4 border-b border-[#2a2a2a]/40 hover:bg-white/5 transition-all duration-300 group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              {/* Rank Number */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 group-hover:scale-110 ${getRankColor(user.rank)}`}>
                {user.rank}
              </div>

              {/* Avatar with Flag */}
              <div className="ml-4 relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center p-[2px] shadow-lg">
                  <img
                    src={user.profileEpic || "/placeholder.svg?height=56&width=56"}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=56&width=56"
                    }}
                  />
                </div>
                {/* Flag overlay */}
                {user.nationality && (
                  <div className="absolute -right-1 -bottom-1 w-7 h-7 rounded-full overflow-hidden border-2 border-gray-700 shadow-md">
                    <img
                      src={getFlagForUser(user)}
                      alt={user.nationality}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "https://flagcdn.com/w320/us.png"
                      }}
                    />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white text-lg truncate group-hover:text-yellow-400 transition-colors">
                    {user.name}
                  </h3>
                  {user.rank <= 3 && (
                    <Trophy className="h-4 w-4 text-yellow-400 animate-pulse" />
                  )}
                </div>
                {user.team && (
                  <p className="text-xs text-gray-400 mb-1 truncate">
                    Team: <span className="text-blue-300">{user.team}</span>
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-amber-400">
                    {user.experience.toLocaleString()} XP
                  </p>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Rank indicator for top 3 */}
              {user.rank <= 3 && (
                <div className="ml-2">
                  <div className={`w-1 h-12 rounded-full ${
                    user.rank === 1 ? 'bg-gradient-to-b from-yellow-400 to-yellow-600' :
                    user.rank === 2 ? 'bg-gradient-to-b from-gray-300 to-gray-500' :
                    'bg-gradient-to-b from-amber-600 to-amber-800'
                  } shadow-lg`}></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-[#2a2a2a]/50 bg-[#1a1a1a]/60">
            <motion.button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-3 rounded-full transition-all duration-200 ${
                currentPage === 1
                  ? "text-gray-600 cursor-not-allowed opacity-50"
                  : "text-white hover:bg-[#333] hover:shadow-lg hover:text-blue-400"
              }`}
              whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
              whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page
                if (totalPages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }

                return (
                  <motion.button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-110"
                        : "text-gray-400 hover:bg-[#333] hover:text-white hover:scale-105"
                    }`}
                    whileHover={{ scale: currentPage === page ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {page}
                  </motion.button>
                )
              })}
            </div>

            <motion.button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-full transition-all duration-200 ${
                currentPage === totalPages
                  ? "text-gray-600 cursor-not-allowed opacity-50"
                  : "text-white hover:bg-[#333] hover:shadow-lg hover:text-blue-400"
              }`}
              whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
              whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default RankingList