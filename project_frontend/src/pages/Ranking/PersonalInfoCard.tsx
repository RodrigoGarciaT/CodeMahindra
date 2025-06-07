"use client"

import { motion } from "framer-motion"

interface User {
  id: string
  name: string
  avatar?: string
  experience: number // 🔥 Cambiado de coins → experience
  position?: string
  team?: string
  rank: number
  nationality?: string
  firstName?: string
  lastName?: string
  flag?: string
}

interface PersonalInfoCardProps {
  user: User
}

export default function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <h3 className="text-lg font-semibold text-white">Mi Información</h3>
      </div>

      {/* Avatar y nombre */}
      <div className="flex items-center space-x-4 mb-5">
        <div className="relative">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-14 h-14 rounded-full border-2 border-slate-600 object-cover shadow-md"
          />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
            <span className="text-xs text-white">✓</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-bold text-white">
            {user.firstName} {user.lastName}
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            {user.flag && (
              <img
                src={user.flag}
                alt={user.nationality}
                className="w-4 h-3 rounded-sm object-cover border border-slate-600"
              />
            )}
            <span className="text-sm text-slate-400">
              {user.nationality || "No especificado"}
            </span>
          </div>
        </div>
      </div>

      {/* Información en grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Experiencia */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-3 rounded-lg border border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Experiencia</p>
              <p className="text-lg font-bold text-yellow-400">
                {user.experience.toLocaleString()} XP
              </p>
            </div>
            <span className="text-2xl">🏆</span>
          </div>
        </div>

        {/* Rank */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-3 rounded-lg border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Ranking</p>
              <p className="text-lg font-bold text-blue-400">
                #{user.rank}
              </p>
            </div>
            <span className="text-2xl">📊</span>
          </div>
        </div>
      </div>

      {/* Detalles adicionales */}
      <div className="space-y-2">
        {user.position && (
          <div className="flex items-center justify-between py-2 px-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">💼</span>
              <span className="text-sm text-slate-400">Posición</span>
            </div>
            <span className="text-sm font-medium text-white">{user.position}</span>
          </div>
        )}
        
        {user.team && (
          <div className="flex items-center justify-between py-2 px-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">👥</span>
              <span className="text-sm text-slate-400">Equipo</span>
            </div>
            <span className="text-sm font-medium text-purple-400">{user.team}</span>
          </div>
        )}
      </div>

      {/* ID (opcional, para debug) */}
      <div className="mt-4 pt-3 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">ID de Usuario</span>
          <span className="text-xs text-slate-400 font-mono">
            {user.id.slice(0, 8)}...
          </span>
        </div>
      </div>
    </motion.div>
  )
}