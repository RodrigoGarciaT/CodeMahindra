import React, { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

type Achievement = {
  id: string
  name: string
  category: string
  topic: string
  description: string
  icon: React.ReactNode
  earned?: boolean
}

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const userId = localStorage.getItem("user_id")
    if (!userId) return

    fetch(`${import.meta.env.VITE_BACKEND_URL}/achievements/status/${userId}`)
      .then(res => res.json())
      .then(data => {
        const earned = data.earned?.map((a: Achievement) => ({ ...a, earned: true })) || []
        const unearned = data.unearned?.map((a: Achievement) => ({ ...a, earned: false })) || []
        setAchievements([...earned, ...unearned])
      })
      .catch(err => console.error("Failed to load achievements:", err))
  }, [])

  const total = achievements.length
  const earned = achievements.filter(a => a.earned).length
  const progress = total > 0 ? Math.round((earned / total) * 100) : 0

  return (
    <motion.div
      className="min-h-screen bg-[#1a1a1a] text-white px-6 py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <motion.div
            className="bg-[#2a2a2a] border border-red-500 text-white px-6 py-3 rounded-xl shadow-xl text-sm flex gap-8 items-center font-semibold"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              <div className="text-red-400 text-lg">{earned}</div>
              <div className="text-xs">Completed</div>
            </div>
            <div className="w-px h-6 bg-gray-500" />
            <div className="text-center">
              <div className="text-white text-lg">{total - earned}</div>
              <div className="text-xs">Pending</div>
            </div>
            <div className="w-px h-6 bg-gray-500" />
            <div className="text-center">
              <div className="text-blue-400 text-lg">{progress}%</div>
              <div className="text-xs">Progress</div>
            </div>
          </motion.div>
        </div>

        {/* Card Container */}
        <motion.div
          className="bg-[#141414] rounded-2xl p-6 shadow-xl"
          initial={{ scale: 0.97 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Progress</h2>
              <p className="text-sm text-gray-400">{earned} of {total} achievements completed</p>
            </div>
            <div className="text-right">
              <p className="text-red-500 font-bold text-lg">{progress}%</p>
              <div className="w-40 bg-gray-700 rounded-full h-2 mt-1">
                <div
                  className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {achievements.map((a) => (
              <motion.div
                key={a.id}
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`group relative p-4 rounded-2xl cursor-pointer text-center border transition-all
                ${a.earned
                    ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-100 text-gray-900"
                    : "border-gray-700 bg-[#2b2b2b] text-gray-400"}`}
              >
                <div className="mb-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-white/10 flex items-center justify-center text-lg">
                    {a.icon}
                  </div>
                </div>
                <div className="font-semibold text-sm truncate">{a.name}</div>
                <div className="text-xs text-gray-400">{a.topic}</div>

                {/* Tooltip on hover */}
                <div className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg text-sm text-white bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl backdrop-blur">
                  <strong className="text-red-400">{a.name}</strong>
                  <p className="mt-1 text-gray-300">{a.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Achievements
