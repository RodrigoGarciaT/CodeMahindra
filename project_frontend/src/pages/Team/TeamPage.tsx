"use client"

import { Link, useNavigate } from "react-router-dom"
import { XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, Cell } from "recharts"
import { useParams } from "react-router-dom"
import { useTeamMembers } from "../../hooks/useTeamMembers"
import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

function ProfileAndTeamPage() {
  const navigate = useNavigate()
  const { teamId } = useParams()

  type TeamMember = {
    id: string
    firstName: string
    lastName: string
    profilePicture?: string
    coins?: number
    experience?: number
  }

  const [teamInfo, setTeamInfo] = useState<{ name: string; code: string } | null>(null)
  const [difficultyData, setDifficultyData] = useState<{
    Easy: number
    Medium: number
    Hard: number
  } | null>(null)
  const [difficultyLoading, setDifficultyLoading] = useState(true)

  const { members, loading } = useTeamMembers(teamId || "") as {
    members: TeamMember[]
    loading: boolean
  }

  const totalExperience = members.reduce((sum, member) => sum + (member.experience ?? 0), 0)
  const teamLevel = Math.floor(totalExperience / 1000)

  useEffect(() => {
    if (!teamId) {
      return
    }

    const fetchTeamInfo = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/teams/${teamId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Error al cargar la información del equipo")
        const data = await res.json()
        setTeamInfo(data)
      } catch (err) {
        console.error("Error obteniendo el equipo:", err)
      }
    }

    fetchTeamInfo()
  }, [teamId])

  useEffect(() => {
    if (members.length > 0) {
      setDifficultyLoading(true)
      const aggregatedData = {
        Easy: 0,
        Medium: 0,
        Hard: 0,
      }

      const fetchPromises = members.map((member) =>
        axios
          .get(`${import.meta.env.VITE_BACKEND_URL}/employees/solved-difficulty/${member.id}`)
          .then((res) => {
            aggregatedData.Easy += res.data.Easy || 0
            aggregatedData.Medium += res.data.Medium || 0
            aggregatedData.Hard += res.data.Hard || 0
          })
          .catch((err) => {
            console.error(`Error fetching difficulty for member ${member.id}:`, err)
          }),
      )

      Promise.all(fetchPromises).then(() => {
        setDifficultyData(aggregatedData)
        setDifficultyLoading(false)
      })
    }
  }, [members])

  const leaveTeam = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/teams/${teamId}/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("No se pudo salir del equipo")

      navigate("/home")
    } catch (error) {
      console.error("Error al salir del equipo:", error)
      alert("Hubo un error al intentar salir del equipo.")
    }
  }

  const barChartData = difficultyData
    ? [
        { name: "Easy", value: difficultyData.Easy, color: "#ef4444" },
        { name: "Medium", value: difficultyData.Medium, color: "#dc2626" },
        { name: "Hard", value: difficultyData.Hard, color: "#b91c1c" },
      ]
    : [
        { name: "Easy", value: 0, color: "#ef4444" },
        { name: "Medium", value: 0, color: "#dc2626" },
        { name: "Hard", value: 0, color: "#b91c1c" },
      ]

  return (
    <div className="min-h-screen bg-[#1f1f22] text-white">
      <div className="max-w-6xl mx-auto p-6">
        {teamId ? (
          <motion.div
            className="mb-8 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/home"
              className="mr-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="text-white h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-white text-3xl font-bold">Team</h1>
              <p className="text-slate-400">Manage your team and track its performance</p>
            </div>
          </motion.div>
        ) : (
          <div className="text-white p-8">No se proporcionó teamId en la URL.</div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Team Info */}
          <motion.div
            className="bg-white text-black rounded-2xl p-6 shadow-xl border border-gray-200"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold">🏆 {teamInfo?.name ?? "Team Name"}</h2>
            </div>

            {teamInfo?.code && (
              <p className="text-sm text-gray-600 mb-4">
                Team Code:{" "}
                <span className="font-mono bg-red-50 text-red-700 px-3 py-1 rounded-lg border border-red-200">
                  {teamInfo.code}
                </span>
              </p>
            )}

            <div className="mb-6">
              <div className="flex justify-between text-sm font-medium text-gray-800 mb-2">
                <span className="flex items-center gap-1">
                  Team Level: <span className="font-bold text-red-600 text-lg">{teamLevel}</span> 🎯
                </span>
                <span className="flex items-center gap-1">
                  Total XP: <span className="font-bold text-red-600">{totalExperience.toLocaleString()}</span> ⚡
                </span>
              </div>
              <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalExperience % 1000) / 10}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{totalExperience % 1000} XP</span>
                <span>{1000 - (totalExperience % 1000)} XP to next level</span>
              </div>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                👨‍💻 Team Members ({members.length})
              </h3>
              <table className="min-w-full text-sm rounded-lg overflow-hidden">
                <thead className="bg-red-50 text-gray-800 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Member</th>
                    <th className="px-4 py-3 text-left">XP</th>
                    <th className="px-4 py-3 text-left">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-600">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="inline-block w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full mr-2"
                        />
                        Loading members...
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-600">
                        😔 No members in this team yet.
                      </td>
                    </tr>
                  ) : (
                    members.map((member, index) => {
                      const experience = member.experience ?? 0
                      const level = Math.floor(experience / 1000)
                      return (
                        <motion.tr
                          key={member.id}
                          className="hover:bg-red-50 transition-colors border-b border-gray-100"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <td className="px-4 py-4 flex items-center gap-3">
                            {member.profilePicture && (
                              <img
                                src={member.profilePicture || "/placeholder.svg"}
                                alt="Profile"
                                className="w-8 h-8 rounded-full shadow-sm border-2 border-red-200"
                              />
                            )}
                            <span className="font-medium">
                              {member.firstName} {member.lastName}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-red-600 font-semibold">{experience.toLocaleString()}</td>
                          <td className="px-4 py-4">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              Level {level} 🎖️
                            </span>
                          </td>
                        </motion.tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Difficulty Chart */}
          <motion.div
            className="bg-white text-black rounded-2xl p-6 shadow-xl border border-gray-200"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">📊 Performance by Difficulty</h2>
            {difficultyLoading ? (
              <div className="text-center py-16 text-gray-600">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="inline-block w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full mb-3"
                />
                <p>Loading performance data...</p>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#374151", fontSize: 12 }}
                      tickFormatter={(value: 'Easy' | 'Medium' | 'Hard') => {
                        const emojis: Record<'Easy' | 'Medium' | 'Hard', string> = {
                          Easy: "🟢",
                          Medium: "🟡",
                          Hard: "🔴"
                        }
                        return `${emojis[value]} ${value}`
                      }}
                    />
                    <YAxis allowDecimals={false} tick={{ fill: "#374151", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "2px solid #ef4444",
                        borderRadius: "12px",
                        color: "#000",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value, name) => [`${value} solved`, `${name} Problems`]}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Leave Team Button */}
          <div className="flex justify-center pt-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              onClick={() => {
                if (window.confirm("😢 Are you sure you want to leave the team?")) {
                  leaveTeam()
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              🚪 Leave Team
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfileAndTeamPage
