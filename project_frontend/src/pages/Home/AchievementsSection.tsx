import React from "react"
import { useNavigate } from "react-router-dom"
import { Star } from "lucide-react"

type Achievement = {
  id: string
  name: string
  category: string
  topic: string
  description: string
  icon: React.ReactNode
  earned?: boolean
}

type Props = {
  achievements: Achievement[]
}

const AchievementsSection: React.FC<Props> = ({ achievements }) => {
  const navigate = useNavigate()

  const earned = achievements.filter((a) => a.earned)
  const unearned = achievements.filter((a) => !a.earned)
  const total = achievements.length
  const progress = total > 0 ? (earned.length / total) * 100 : 0

  const renderAchievement = (achievement: Achievement) => (
    <div
      key={achievement.id}
      className={`flex flex-col items-center justify-center p-4 rounded-xl text-center border transition-all duration-300 shadow-sm ${
        achievement.earned
          ? "bg-gradient-to-br from-yellow-100 to-orange-100 text-gray-800 border-yellow-300"
          : "bg-[#2a2a2a] text-gray-400 border-[#3a3a3a] opacity-70"
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-2">
        {achievement.icon}
      </div>
      <span className="font-semibold text-sm">{achievement.name}</span>
      <span className="text-xs text-gray-500">{achievement.topic}</span>
    </div>
  )

  return (
    <div className="bg-[#1e1e1e] text-white rounded-2xl p-6 shadow-md border border-[#2e2e2e]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold">🏅 Achievements</h2>
          <p className="text-sm text-gray-400 mt-1">
            {earned.length} of {total} completed ({Math.round(progress)}%)
          </p>
        </div>
        <button
          onClick={() => navigate("/achievements")}
          className="text-sm text-red-400 hover:text-red-500 font-medium transition"
        >
          View all
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-red-500 to-red-700 h-3 rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Recent Achievements */}
      {earned.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Recent achievements
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {earned.slice(-3).map(renderAchievement)}
          </div>
        </div>
      )}

      {/* Upcoming Goals */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Upcoming goals</h3>
        <div className="grid grid-cols-3 gap-3">
          {unearned.slice(0, 3).map(renderAchievement)}
        </div>
      </div>
    </div>
  )
}

export default AchievementsSection
