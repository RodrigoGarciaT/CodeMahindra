import React from "react"
import { useNavigate } from "react-router-dom"
import CountryName from "../Home/CountryName"

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
    <div className="bg-[#1e1e1e] rounded-2xl p-6 shadow-md border border-[#2e2e2e] text-white">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-white">👤 Profile</h2>
        <button
          className="text-sm text-red-400 hover:text-red-500 font-medium transition"
          onClick={() => navigate("/profile")}
        >
          View more
        </button>
      </div>

      <div className="bg-[#2a2a2a] p-4 rounded-xl mb-6 shadow-inner">
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
            <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-white text-xl font-bold border-2 border-red-500">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </span>
            {user?.nationality ? (
              <CountryName code={user.nationality} />
            ) : (
              <span className="text-sm text-gray-400">Nationality not available</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-white">🔥 Progress</h3>
        <div>
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>
              Level <span className="text-red-400 font-bold">{level}</span>
            </span>
            <span>{user?.experience} XP</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-red-500 to-red-700 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSection
