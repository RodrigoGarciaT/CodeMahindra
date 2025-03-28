"use client"
import { users } from "../types/mockUsers";
import PodiumView from "../components/PodiumView";
import RankingList from "../components/RankingList";
import UserStatusCard from "../components/UserStatusCard";
import TopPlayerCard from "../components/TopPlayerCard";

import { motion } from "framer-motion"

const Ranking = () => {
  // Asumimos que el usuario actual está en la posición 4
  const currentUserRank = 4
  const percentile = 60

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden">

      {/* Fondo con efecto de partículas/estrellas */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div className="absolute w-1 h-1 bg-white rounded-full top-[10%] left-[20%] shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[30%] left-[80%] shadow-[0_0_8px_2px_rgba(255,255,255,0.5)]"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[70%] left-[15%] shadow-[0_0_12px_3px_rgba(255,255,255,0.5)]"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[40%] left-[60%] shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[85%] left-[75%] shadow-[0_0_8px_2px_rgba(255,255,255,0.5)]"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[20%] left-[40%] shadow-[0_0_12px_3px_rgba(255,255,255,0.5)]"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[60%] left-[30%] shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[50%] left-[90%] shadow-[0_0_8px_2px_rgba(255,255,255,0.5)]"></div>
      </div>

      {/* Círculos decorativos de fondo */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] rounded-full border border-gray-800 opacity-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full border border-gray-800 opacity-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-gray-800 opacity-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna izquierda */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UserStatusCard rank={currentUserRank} percentile={percentile} />
            <TopPlayerCard user={users[0]} />
          </motion.div>

          {/* Columna central - Podio */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PodiumView topUsers={users.slice(0, 3)} />
          </motion.div>

          {/* Columna derecha - Ranking */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <RankingList users={users.slice(3)} startRank={4} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Ranking

