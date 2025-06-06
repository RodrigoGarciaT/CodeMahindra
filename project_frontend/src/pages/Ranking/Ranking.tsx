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
  avatar?: string
  coins: number
  position?: string
  team?: string
  rank: number
  nationality?: string
  firstName?: string
  lastName?: string
  flag?: string
}

// 🔥 función util para mapear flag desde nationality
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
  const usersPerPage = 6

  // Cargar ranking completo
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/ranking/`)
      .then((res) => res.json())
      .then((data) => {
        const ranked = data
          .sort((a: User, b: User) => b.coins - a.coins)
          .map((user: User, index: number) => ({
            ...user,
            rank: index + 1,
            flag: mapNationalityToFlag(user.nationality)
          }))
        setUserData(ranked)
      })
      .catch((err) => console.error("Error loading ranking:", err))
  }, [])

  // Cargar ranking del usuario actual
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    fetch(`${import.meta.env.VITE_BACKEND_URL}/ranking/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const mappedUser: User = {
          ...data,
          name:
            data.name && data.name.startsWith("http")
              ? `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Unknown User"
              : data.name,
          flag: mapNationalityToFlag(data.nationality),
          nationality: data.nationality || "No especificado"
        }

        setCurrentUser(mappedUser)
      })
      .catch((err) => console.error("Error loading current user ranking:", err))
  }, [])

  const podiumUsers = userData.slice(0, 3)
  const restUsers = userData.slice(3)

  const totalPages = Math.ceil(restUsers.length / usersPerPage)
  const indexOfFirstUser = (currentPage - 1) * usersPerPage
  const indexOfLastUser = indexOfFirstUser + usersPerPage
  const currentUsers = restUsers.slice(indexOfFirstUser, indexOfLastUser)

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // Percentile real
  const percentile =
    currentUser && userData.length > 0
      ? Math.round(100 * (userData.length - currentUser.rank) / userData.length)
      : 0

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
          {/* Left column */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Nueva tarjeta de información personal */}
            {currentUser && (
              <PersonalInfoCard user={currentUser} />
            )}
            
            {/* Tarjeta de estado del usuario (la que ya tenías) */}
            {currentUser && (
              <UserStatusCard user={currentUser} percentile={percentile} />
            )}
            
            {/* Tarjeta del top player (la que ya tenías) */}
            {podiumUsers[0] && <TopPlayerCard user={podiumUsers[0]} />}
          </motion.div>

          {/* Center column */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PodiumView topUsers={podiumUsers} />
          </motion.div>

          {/* Right column */}
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