"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Star, Users, MapPin, Flame } from "lucide-react"

type User = {
  id: string
  name: string
  profileEpic: string
  experience: number
  position?: string | null
  team?: string | null
  rank: number
  nationality?: string
  firstName?: string
  lastName?: string
  flag?: string
}

type UserStatusCardProps = {
  user?: User | null
  percentile: number
}

// Función para obtener la bandera a partir de nationality
const getFlagForUser = (user: User | null | undefined): string => {
  if (!user || !user.nationality) {
    return "https://flagcdn.com/w320/us.png"
  }

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

    // Asia (algunos comunes)
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

const UserStatusCard: React.FC<UserStatusCardProps> = ({ user, percentile }) => {
  // Si no hay usuario (no autenticado o error)
  if (!user) {
    return (
      <motion.div
        className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-2xl p-6 text-white text-center relative overflow-hidden backdrop-blur-sm"
        style={{
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600/20 to-transparent"></div>
        <div className="relative z-10">
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          >
            📊
          </motion.div>
          <p className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Unranked
          </p>
          <p className="text-sm opacity-80 leading-relaxed">
            You need to gain experience to appear in the leaderboard.
          </p>
          <div className="mt-6 bg-slate-500/30 h-3 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-slate-400 to-slate-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "0%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    )
  }

  // Determinar el nombre que se muestra
  const displayName = (() => {
    if (user.name && user.name.startsWith("http")) {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim()
      return fullName || "Usuario Desconocido"
    }

    if (user.name && user.name.trim()) {
      return user.name.trim()
    }

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim()
    return fullName || "Usuario Desconocido"
  })()

  const profileEpicUrl = user.profileEpic || "/placeholder.svg?height=80&width=80"

  // Determinar el color del ranking basado en la posición
  const getRankingColor = (rank: number) => {
    if (rank <= 3) return "from-yellow-400 to-yellow-600"
    if (rank <= 10) return "from-orange-400 to-orange-600"
    if (rank <= 50) return "from-blue-400 to-blue-600"
    return "from-purple-400 to-purple-600"
  }

  const getRankingIcon = (rank: number) => {
    if (rank <= 3) return "🏆"
    if (rank <= 10) return "🥇"
    if (rank <= 50) return "⭐"
    return "🎯"
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm"
      style={{
        boxShadow:
          "0 25px 50px rgba(251, 146, 60, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 30px 60px rgba(251, 146, 60, 0.5), 0 0 30px rgba(255, 165, 0, 0.3)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
    >
      {/* Efectos de fondo mejorados */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl translate-y-10 -translate-x-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>

      <div className="relative z-10">
        {/* Header con avatar y ranking */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar del usuario */}
          <motion.div className="relative" whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-xl backdrop-blur-sm">
              <img
                src={profileEpicUrl || "/placeholder.svg"}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=80&width=80"
                }}
              />
            </div>
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <span className="text-lg">{getRankingIcon(user.rank)}</span>
            </motion.div>
          </motion.div>

          {/* Ranking badge mejorado */}
          <motion.div
            className={`bg-gradient-to-r ${getRankingColor(user.rank)} rounded-2xl px-4 py-3 shadow-xl border border-white/20`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-white" />
              <span className="text-white text-xl font-bold">#{user.rank}</span>
            </div>
          </motion.div>
        </div>

        {/* Información del usuario */}
        <div className="space-y-4">
          {/* Nombre del usuario */}
          <motion.h2
            className="text-white font-bold text-3xl leading-tight bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {displayName}
          </motion.h2>

          {/* Percentil destacado */}
          <motion.div
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/90 font-semibold text-lg mb-1">You're better than</p>
            <div className="flex items-center gap-2">
              <motion.p
                className="text-white text-4xl font-extrabold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                {percentile}%
              </motion.p>
              <Star className="w-6 h-6 text-yellow-200 fill-current" />
            </div>
            <p className="text-white/80 text-sm">of other users</p>
          </motion.div>

          {/* Información adicional con iconos */}
          <motion.div
            className="grid grid-cols-1 gap-3 text-white/90 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <Star className="w-4 h-4 text-yellow-200 flex-shrink-0" />
              <div>
                <span className="font-semibold">Experience: </span>
                <span className="font-bold text-yellow-100">{user.experience?.toLocaleString() || 0} XP</span>
              </div>
            </div>

            {user.team && (
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <Users className="w-4 h-4 text-blue-200 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Team: </span>
                  <span className="font-bold text-blue-100">{user.team}</span>
                </div>
              </div>
            )}

            {user.nationality && (
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <MapPin className="w-4 h-4 text-green-200 flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Nationality: </span>
                  <span className="font-bold text-green-100">{user.nationality}</span>
                  <img
                    src={getFlagForUser(user) || "/placeholder.svg"}
                    alt={user.nationality}
                    className="w-6 h-4 rounded-sm border border-white/30 object-cover shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src =
                        "https://static.vecteezy.com/system/resources/thumbnails/007/095/871/small/usa-realistic-waving-flag-illustration-national-country-background-symbol-independence-day-free-vector.jpg"
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Barra de progreso mejorada */}
        <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm font-medium">Ranking progress</span>
            <span className="text-white font-bold text-sm">{Math.min(percentile, 100)}%</span>
          </div>
          <div className="bg-white/20 h-3 rounded-full overflow-hidden backdrop-blur-sm border border-white/30">
            <motion.div
              className="h-full bg-gradient-to-r from-white via-yellow-200 to-white rounded-full shadow-inner"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentile, 100)}%` }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default UserStatusCard