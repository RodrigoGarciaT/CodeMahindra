"use client"

import type React from "react"
import type { User } from "@/types/user"
import { motion } from "framer-motion"
import { Clock, Crown } from "lucide-react"

type PodiumViewProps = {
  topUsers: User[]
}

// 🔥 función para obtener la bandera a partir de la nationality
const getFlagForUser = (user: User | undefined) => {
  if (!user || !user.nationality) return "https://static.vecteezy.com/system/resources/thumbnails/007/095/871/small/usa-realistic-waving-flag-illustration-national-country-background-symbol-independence-day-free-vector.jpg"

  const nationalityToFlag: Record<string, string> = {
    "Brasil": "https://flagcdn.com/w320/br.png",
    "México": "https://flagcdn.com/w320/mx.png",
    "Argentina": "https://flagcdn.com/w320/ar.png",
    "España": "https://flagcdn.com/w320/es.png",
    "El Salvador": "https://flagcdn.com/w320/sv.png",
    "Alemania": "https://flagcdn.com/w320/de.png",
    "Canadá": "https://flagcdn.com/w320/ca.png",
    "Perú": "https://flagcdn.com/w320/pe.png",
    "Estados Unidos": "https://flagcdn.com/w320/us.png",
    "No especificado": "https://static.vecteezy.com/system/resources/thumbnails/007/095/871/small/usa-realistic-waving-flag-illustration-national-country-background-symbol-independence-day-free-vector.jpg"
  }

  return nationalityToFlag[user.nationality] || nationalityToFlag["No especificado"]
}

const PodiumView: React.FC<PodiumViewProps> = ({ topUsers }) => {
  const podiumUsers = [...topUsers].sort((a, b) => b.coins - a.coins).slice(0, 3)

  return (
    <div className="relative w-full max-w-3xl mx-auto h-[600px]">
      <div className="absolute top-0 right-0 z-50">
        <motion.div
          className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Clock className="h-5 w-5" />
          <span className="font-medium text-lg">06d 23h 00m</span>
        </motion.div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-gray-700 opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gray-700 opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gray-700 opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-gray-700 opacity-50"></div>
      </div>

      <div className="absolute inset-0 flex items-end justify-center">
        <div className="relative w-full max-w-[600px] h-[400px]">
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center">
            {/** 2nd place */}
            <motion.div className="relative w-[180px] h-[200px] mx-2"
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, type: "spring" }}>
              <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-600 rounded-t-md shadow-xl flex items-center justify-center text-white text-[120px] font-bold">2</div>
            </motion.div>

            {/** 1st place */}
            <motion.div className="relative w-[180px] h-[260px] mx-2 z-10"
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, type: "spring" }}>
              <div className="absolute inset-0 bg-gradient-to-b from-red-400 to-red-500 rounded-t-md shadow-xl flex items-center justify-center text-white text-[120px] font-bold">1</div>
            </motion.div>

            {/** 3rd place */}
            <motion.div className="relative w-[180px] h-[160px] mx-2"
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, type: "spring" }}>
              <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-600 rounded-t-md shadow-xl flex items-center justify-center text-white text-[120px] font-bold">3</div>
            </motion.div>
          </div>

          <div className="absolute inset-0 z-20">
            {/* 2nd place player */}
            <div className="absolute bottom-[200px] left-[calc(50%-190px)] w-[180px] flex flex-col items-center transform -translate-x-1/2">
              <img src={podiumUsers[1]?.avatar || "/placeholder.svg"} alt={podiumUsers[1]?.name} className="w-20 h-20 rounded-full object-cover mb-2" />
              <img src={getFlagForUser(podiumUsers[1])} alt="Flag" className="w-10 h-10 rounded-md border border-gray-800 mb-2" />
              <p className="text-white text-xl font-bold">{podiumUsers[1]?.name}</p>
              <p className="bg-red-500 text-white px-5 py-2 rounded-full">{podiumUsers[1]?.coins?.toLocaleString()} QP</p>
            </div>

            {/* 1st place player */}
            <div className="absolute bottom-[260px] left-1/2 w-[180px] flex flex-col items-center transform -translate-x-1/2">
              <motion.div className="absolute -top-12 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400 rounded-md flex items-center justify-center z-30"
                initial={{ y: -10 }} animate={{ y: [-5, 0, -5] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
                <Crown className="h-8 w-8 text-yellow-900" />
              </motion.div>
              <img src={podiumUsers[0]?.avatar || "/placeholder.svg"} alt={podiumUsers[0]?.name} className="w-20 h-20 rounded-full object-cover mb-2" />
              <img src={getFlagForUser(podiumUsers[0])} alt="Flag" className="w-10 h-10 rounded-md border border-gray-800 mb-2" />
              <p className="text-white text-xl font-bold">{podiumUsers[0]?.name}</p>
              <p className="bg-red-500 text-white px-5 py-2 rounded-full">{podiumUsers[0]?.coins?.toLocaleString()} QP</p>
            </div>

            {/* 3rd place player */}
            <div className="absolute bottom-[160px] left-[calc(50%+190px)] w-[180px] flex flex-col items-center transform -translate-x-1/2">
              <img src={podiumUsers[2]?.avatar || "/placeholder.svg"} alt={podiumUsers[2]?.name} className="w-20 h-20 rounded-full object-cover mb-2" />
              <img src={getFlagForUser(podiumUsers[2])} alt="Flag" className="w-10 h-10 rounded-md border border-gray-800 mb-2" />
              <p className="text-white text-xl font-bold">{podiumUsers[2]?.name}</p>
              <p className="bg-red-500 text-white px-5 py-2 rounded-full">{podiumUsers[2]?.coins?.toLocaleString()} QP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PodiumView