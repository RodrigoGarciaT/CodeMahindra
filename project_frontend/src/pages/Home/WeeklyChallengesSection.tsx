import React from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronRight,
  CheckCircle,
  Brain,
  MessageSquareCode
} from "lucide-react"

const WeeklyChallengesSection: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-[#f4f4f5] rounded-2xl p-6 shadow-md border border-gray-300 text-gray-800">
      <h2 className="text-xl font-bold mb-4">🔥 Weekly Challenges</h2>

      <div className="space-y-4">
        {/* Complete tasks */}
        <button
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-xl flex justify-between items-center font-semibold shadow-sm transition-all duration-300"
          onClick={() => navigate("/tasks")}
        >
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Complete tasks
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Solve a problem */}
        <button
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-xl flex justify-between items-center font-semibold shadow-sm transition-all duration-300"
          onClick={() => navigate("/problems")}
        >
          <span className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Solve a problem
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* View code feedback */}
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-4 rounded-xl flex justify-between items-center font-semibold shadow-sm transition-all duration-300"
          onClick={() => navigate("/repos")}
        >
          <span className="flex items-center gap-2">
            <MessageSquareCode className="w-5 h-5" />
            View code feedback
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default WeeklyChallengesSection
