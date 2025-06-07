"use client"

import { useEffect, useState, useCallback } from "react"
import PodiumView from "./PodiumView"
import RankingList from "./RankingList"
import UserStatusCard from "./UserStatusCard"
import TopPlayerCard from "./TopPlayerCard"
import PersonalInfoCard from "./PersonalInfoCard"
import { motion } from "framer-motion"

interface User {
  id: string
  name: string
  avatar: string
  experience: number // ✅ SOLO experience
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
            experience: user.experience // ✅ SOLO experience
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
    const token = localStorage.getItem("access_token")
    if (!token) return

    if (userData.length === 0) return

    fetch(`${import.meta.env.VITE_BACKEND_URL}/ranking/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) return null
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
          experience: data.experience, // ✅ SOLO experience
          position: data.position ?? null,
          team: data.team ?? null,
          rank: userRank
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
  const currentUsers = restUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const percentile =
    currentUser && userData.length > 0
      ? Math.round(100 * (userData.length - currentUser.rank) / userData.length)
      : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-2xl">Cargando ranking...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden py-6">
      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ranking
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna izquierda */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentUser && (
              <>
                <PersonalInfoCard user={currentUser} />
                <UserStatusCard user={currentUser} percentile={percentile} />
              </>
            )}

            {podiumUsers[0] && <TopPlayerCard user={podiumUsers[0]} />}
          </motion.div>

          {/* Columna central */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PodiumView topUsers={podiumUsers} />
          </motion.div>

          {/* Columna derecha */}
          <motion.div
            className="lg:col-span-3"
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
      </div>
    </div>
  )
}