"use client"

import type React from "react"
import type { User } from "@/types/user"
import { motion } from "framer-motion"
import { Crown } from "lucide-react"

type PodiumViewProps = {
  topUsers: User[]
}

const getFlagForUser = (user: User | undefined) => {
  if (!user || !user.nationality) {
    return "https://static.vecteezy.com/system/resources/thumbnails/007/095/871/small/usa-realistic-waving-flag-illustration-national-country-background-symbol-independence-day-free-vector.jpg"
  }

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

const PodiumUserCard = ({ user, place }: { user?: User; place: number }) => {
  const pedestalHeights = { 1: 260, 2: 200, 3: 160 }
  const positions = {
    1: { order: 2, marginTop: 0 },
    2: { order: 1, marginTop: 60 },
    3: { order: 3, marginTop: 100 }
  }

  return (
    <div 
      className="flex flex-col items-center"
      style={{ order: positions[place].order }}
    >
      {/* Crown for first place */}
      {place === 1 && (
        <motion.div
          className="mb-3 w-12 h-12 bg-yellow-400 rounded-md flex items-center justify-center"
          initial={{ y: -10 }}
          animate={{ y: [-5, 0, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Crown className="h-8 w-8 text-yellow-900" />
        </motion.div>
      )}

      {/* User info */}
      <div 
        className="flex flex-col items-center mb-4"
        style={{ marginTop: positions[place].marginTop }}
      >
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt={user?.name || `Player ${place}`}
          className={`w-20 h-20 rounded-full object-cover mb-2 ${
            place === 1 ? "border-4 border-yellow-400" : "border-2 border-red-500"
          }`}
        />
        <img
          src={getFlagForUser(user)}
          alt="Flag"
          className="w-10 h-10 rounded-md border border-gray-800 mb-2"
        />
        <p className="text-white text-xl font-bold text-center">
          {user?.name || "Anonymous"}
        </p>
        <p className="text-sm text-gray-300 text-center mb-1">
          {user?.team || "Sin equipo"}
        </p>
        <p className="bg-red-500 text-white px-5 py-2 rounded-full font-bold">
          {user?.experience?.toLocaleString() || "0"} XP
        </p>
      </div>

      {/* Pedestal */}
      <motion.div
        className={`w-[180px] mx-2 ${
          place === 1 ? "z-10" : ""
        } ${
          place === 1
            ? "bg-gradient-to-b from-red-400 to-red-500"
            : "bg-gradient-to-b from-red-500 to-red-600"
        } rounded-t-md shadow-xl flex items-center justify-center text-white text-[120px] font-bold`}
        style={{ height: pedestalHeights[place] }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: place === 2 ? 0.1 : place === 3 ? 0.2 : 0,
          type: "spring"
        }}
      >
        {place}
      </motion.div>
    </div>
  )
}

const PodiumView: React.FC<PodiumViewProps> = ({ topUsers }) => {
  const podiumUsers = [...topUsers].sort((a, b) => b.experience - a.experience).slice(0, 3)

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Background circles */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-gray-700 opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gray-700 opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gray-700 opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-gray-700 opacity-50"></div>
        </div>
      </div>

      {/* Podium */}
      <div className="relative z-10 flex items-end justify-center gap-4 mt-8">
        <PodiumUserCard user={podiumUsers[1]} place={2} />
        <PodiumUserCard user={podiumUsers[0]} place={1} />
        <PodiumUserCard user={podiumUsers[2]} place={3} />
      </div>
    </div>
  )
}

export default PodiumView