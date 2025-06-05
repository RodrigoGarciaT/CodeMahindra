"use client"

import { useEffect, useState, useCallback } from "react"
import PodiumView from "./PodiumView"
import RankingList from "./RankingList"
import UserStatusCard from "./UserStatusCard"
import TopPlayerCard from "./TopPlayerCard"
import { motion } from "framer-motion"

interface User {
  id: string
  name: string
  avatar?: string
  experience: number  // Cambiado de coins a experience
  position?: string
  team?: string
  rank: number
}

export default function Ranking() {
  const [userData, setUserData] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true) // Estado para la carga
  const [error, setError] = useState<string | null>(null) // Estado para errores
  const usersPerPage = 6

  useEffect(() => {
    setLoading(true) // Inicia la carga
    fetch(`${import.meta.env.VITE_BACKEND_URL}/ranking/`)
      .then((res) => res.json())
      .then((data) => {
        // Verificamos si los datos son válidos
        if (Array.isArray(data)) {
          const ranked = data
            .sort((a: User, b: User) => b.experience - a.experience) // Ordenado por experiencia
            .map((user: User, index: number) => ({
              ...user,
              rank: index + 1
            }))
          setUserData(ranked)
        } else {
          throw new Error("Invalid data format received from backend")
        }
        setLoading(false) // Finaliza la carga
      })
      .catch((err) => {
        console.error("Error loading ranking:", err)
        setError("Failed to load ranking data.")
        setLoading(false)
      })
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

  const currentUser = userData[3] // simulando que el usuario actual es el #4
  const percentile = 60 // puedes calcularlo si lo deseas

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden py-6">
      {/* Indicador de carga */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="loader">Cargando...</div> {/* Aquí podrías poner un spinner */}
        </div>
      )}

      {/* Error de carga */}
      {error && (
        <div className="text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Main content */}
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
            {currentUser && (
              <UserStatusCard user={currentUser} percentile={percentile} />
            )}
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