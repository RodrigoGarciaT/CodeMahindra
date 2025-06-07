"use client"

import { useEffect, useState, useCallback } from "react"
import PodiumView from "./PodiumView"
import RankingList from "./RankingList"
import UserStatusCard from "./UserStatusCard"
import { motion } from "framer-motion"

interface User {
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

const mapNationalityToFlag = (nationality: string | undefined): string => {
  const nationalityMap: Record<string, string> = {
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
  return nationalityMap[nationality || "No especificado"] || nationalityMap["No especificado"]
}

export default function Ranking() {
  const [userData, setUserData] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const usersPerPage = 6

  // Cargar ranking completo
  useEffect(() => {
    setIsLoading(true)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/ranking/`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar el ranking")
        return res.json()
      })
      .then((data) => {
        const ranked = data
          .sort((a: User, b: User) => b.experience - a.experience)
          .map((user: any, index: number) => ({
            ...user,
            rank: index + 1,
            flag: mapNationalityToFlag(user.nationality),
            avatar: user.avatar || "/default-avatar.png",
            experience: user.experience,
          }))
        setUserData(ranked)
        setError(null)
      })
      .catch((err) => {
        console.error("Error loading ranking:", err)
        setError("No se pudo cargar el ranking. Intenta más tarde.")
      })
      .finally(() => setIsLoading(false))
  }, [])

  // Cargar ranking del usuario actual
  useEffect(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token")

    if (!token) {
      console.warn("No hay token, no se carga ranking personal")
      return
    }

    if (userData.length === 0) return

    fetch(`${import.meta.env.VITE_BACKEND_URL}/ranking/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.warn("No se pudo obtener el ranking personal", res.status)
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (!data) return

        const foundUser = userData.find((user) => user.id === data.id)
        const userRank = foundUser?.rank || data.rank || userData.length + 1

        const formattedUser: User = {
          ...data,
          name: data.name || `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Usuario",
          flag: mapNationalityToFlag(data.nationality),
          avatar: data.avatar || "/default-avatar.png",
          experience: data.experience,
          position: data.position ?? null,
          team: data.team ?? null,
          rank: userRank,
        }
        setCurrentUser(formattedUser)
      })
      .catch((err) => {
        console.error("Error loading user ranking:", err)
      })
  }, [userData])

  const podiumUsers = userData.slice(0, 3)
  const restUsers = userData.slice(3)
  const totalPages = Math.ceil(restUsers.length / usersPerPage)
  const currentUsers = restUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const percentile =
    currentUser && userData.length > 0 ? Math.round((100 * (userData.length - currentUser.rank)) / userData.length) : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl font-medium">Cargando ranking...</div>
          <div className="text-gray-400 text-sm mt-2">Obteniendo los mejores jugadores</div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
        <motion.div
          className="text-center bg-red-900/20 border border-red-500/30 rounded-2xl p-8 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-red-400 text-xl font-medium mb-2">Error al cargar</div>
          <div className="text-gray-300 text-sm">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 py-4 sm:py-6 lg:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              🏆 Ranking de Jugadores
            </motion.h1>

            <motion.div
              className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">{userData.length} jugadores activos</span>
            </motion.div>
          </div>

          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-6">
            {/* User Status Card - Mobile */}
            {currentUser && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <UserStatusCard user={currentUser} percentile={percentile} />
              </motion.div>
            )}

            {/* Podium - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <PodiumView topUsers={podiumUsers} />
            </motion.div>

            {/* Top Player Card - Mobile */}
            {podiumUsers[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
              </motion.div>
            )}

            {/* Ranking List - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <RankingList
                users={currentUsers}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </motion.div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 xl:gap-8">
            {/* Left Column - Desktop */}
            <motion.div
              className="lg:col-span-3 xl:col-span-3 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentUser && <UserStatusCard user={currentUser} percentile={percentile} />}
            </motion.div>

            {/* Center Column - Desktop */}
            <motion.div
              className="lg:col-span-6 xl:col-span-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <PodiumView topUsers={podiumUsers} />
            </motion.div>

            {/* Right Column - Desktop */}
            <motion.div
              className="lg:col-span-3 xl:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <RankingList
                users={currentUsers}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </motion.div>
          </div>

          {/* Tablet Layout */}
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Tablet */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {currentUser && <UserStatusCard user={currentUser} percentile={percentile} />}
              </motion.div>

              {/* Right Column - Tablet */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <RankingList
                  users={currentUsers}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            </div>

            {/* Podium - Full Width on Tablet */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <PodiumView topUsers={podiumUsers} />
            </motion.div>
          </div>

          {/* Stats Footer */}
          <motion.div
            className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-orange-400">{userData.length}</div>
              <div className="text-sm text-gray-400">Jugadores</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-blue-400">
                {podiumUsers[0]?.experience.toLocaleString() || "0"}
              </div>
              <div className="text-sm text-gray-400">XP Máximo</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(
                  userData.reduce((acc, user) => acc + user.experience, 0) / userData.length,
                ).toLocaleString() || "0"}
              </div>
              <div className="text-sm text-gray-400">XP Promedio</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-400">{totalPages}</div>
              <div className="text-sm text-gray-400">Páginas</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
