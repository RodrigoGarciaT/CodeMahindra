import React from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"

const WeeklyChallengesSection: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-[#1e1e1e] rounded-2xl p-6 shadow-md border border-[#2e2e2e] text-white">
      <h2 className="text-xl font-bold mb-4 text-white">🔥 Weekly Challenges</h2>

      <div className="space-y-4">
        <button
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-xl flex justify-between items-center font-medium transition-all"
          onClick={() => navigate("/tasks")}
        >
          <span>Complete tasks</span>
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-xl flex justify-between items-center font-medium transition-all"
          onClick={() => navigate("/problems")}
        >
          <span>Solve a problem</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default WeeklyChallengesSection
