import React from "react"
import { useNavigate } from "react-router-dom"
import CountryName from "../Home/CountryName"
import { TrendingUp } from "lucide-react"

type Props = {
  user: {
    profilePicture: string
    firstName: string
    lastName: string
    experience: number
    nationality: string
  }
}

const ProfileSection: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate()

  const level = Math.floor((user?.experience ?? 0) / 1000)
  const progress = ((user?.experience ?? 0) % 1000) / 10

  return (
    <div className="bg-[#f4f4f5] rounded-2xl p-6 shadow-md border border-gray-300 text-gray-800">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">👤 Profile</h2>
        <button
          className="text-sm text-red-500 hover:text-red-600 font-medium transition"
          onClick={() => navigate("/profile")}
        >
          View more
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl mb-6 shadow-inner border border-gray-200">
        <div className="flex items-center gap-4">
          {user?.profilePicture ? (
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-red-500">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl font-bold border-2 border-red-500">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </span>
            {user?.nationality ? (
              <CountryName code={user.nationality} />
            ) : (
              <span className="text-sm text-gray-500">Nationality not available</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-500" />
          Progress
        </h3>
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>
              Level <span className="text-red-500 font-bold">{level}</span>
            </span>
            <span>{user?.experience} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSection
