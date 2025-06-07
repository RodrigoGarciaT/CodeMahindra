"use client"

import type React from "react"
import { motion } from "framer-motion"

type User = {
  id: string
  name: string
  avatar: string
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

const UserStatusCard: React.FC<UserStatusCardProps> = ({ user, percentile }) => {
  // Si no hay usuario (no autenticado o error)
  if (!user) {
    return (
      <motion.div
        className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-5 text-white text-center"
        style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-4xl mb-3">📊</div>
        <p className="text-xl font-bold mb-2">Sin Clasificar</p>
        <p className="text-sm opacity-80">
          Necesitas ganar experiencia para aparecer en el ranking.
        </p>
        <div className="mt-4 bg-gray-500 bg-opacity-30 h-2 rounded-full">
          <div className="h-full bg-gray-400 rounded-full w-0"></div>
        </div>
      </motion.div>
    )
  }

  // Determinar el nombre que se muestra
  const displayName = (() => {
    // Si el name parece ser una URL (como profilePicture), usar firstName + lastName
    if (user.name && user.name.startsWith("http")) {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim()
      return fullName || "Usuario Desconocido"
    }
    
    // Si hay un name válido, usarlo
    if (user.name && user.name.trim()) {
      return user.name.trim()
    }
    
    // Fallback a firstName + lastName
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim()
    return fullName || "Usuario Desconocido"
  })()

  // Determinar el avatar
  const avatarUrl = user.avatar || "/default-avatar.png"

  return (
    <motion.div
      className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl p-5 relative overflow-hidden"
      style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 165, 0, 0.2)",
      }}
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-4 relative z-10">
        {/* Círculo de ranking */}
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
          <span className="text-orange-500 text-xl font-bold">
            {user.rank ? `#${user.rank}` : "N/A"}
          </span>
        </div>

        {/* Información del usuario */}
        <div className="flex-1 min-w-0">
          {/* Nombre del usuario */}
          <p className="text-white font-bold text-2xl mb-1 break-words">
            {displayName}
          </p>

          <p className="text-white font-bold text-lg">Estás mejor que el</p>
          <p className="text-white text-2xl font-extrabold">
            {percentile}% de otros jugadores
          </p>

          {/* Información adicional */}
          <div className="mt-3 text-white text-sm space-y-1">
            <p>
              <strong>Experiencia:</strong> {user.experience?.toLocaleString() || 0} XP
            </p>
            
            {user.position && (
              <p>
                <strong>Posición:</strong> {user.position}
              </p>
            )}
            
            {user.team && (
              <p>
                <strong>Equipo:</strong> {user.team}
              </p>
            )}
            
            {user.nationality && (
              <div className="flex items-center gap-2 mt-2">
                <p>
                  <strong>Nacionalidad:</strong> {user.nationality}
                </p>
                <img
                  src={getFlagForUser(user)}
                  alt={user.nationality}
                  className="w-6 h-6 rounded-sm border border-gray-800 object-cover"
                  onError={(e) => {
                    // Fallback si la imagen de la bandera no carga
                    const target = e.target as HTMLImageElement
                    target.src = "https://static.vecteezy.com/system/resources/thumbnails/007/095/871/small/usa-realistic-waving-flag-illustration-national-country-background-symbol-independence-day-free-vector.jpg"
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mt-4 bg-white bg-opacity-30 h-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentile, 100)}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Efecto de brillo de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl -translate-y-8 translate-x-8"></div>
    </motion.div>
  )
}

export default UserStatusCard