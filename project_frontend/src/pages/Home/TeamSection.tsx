import React from "react"
import { useNavigate } from "react-router-dom"
import { Users } from "lucide-react"
import CountryName from "../Home/CountryName"

type Member = {
  id: string
  firstName: string
  lastName?: string
  profilePicture?: string
  experience?: number
  nationality?: string
}

type Props = {
  user: {
    team_id: string | null
  }
  members: Member[]
  teamName: string
  totalExp: number
}

const TeamSection: React.FC<Props> = ({ user, members, teamName, totalExp }) => {
  const navigate = useNavigate()

  const teamLevel = Math.floor((totalExp ?? 0) / 1000)
  const teamProgress = ((totalExp ?? 0) % 1000) / 10

  return (
    <div className="bg-[#f4f4f5] rounded-2xl p-6 shadow-md border border-gray-300 text-gray-800 md:col-span-2">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">🛡️ Team</h2>
        {user?.team_id && (
          <button
            className="text-sm text-red-500 hover:text-red-600 font-medium transition"
            onClick={() => navigate(`/team/${user.team_id}`)}
          >
            View more
          </button>
        )}
      </div>

      {!user?.team_id ? (
        <div className="text-center bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-lg font-semibold mb-4 text-gray-600">
            You’re not part of a team yet.
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
              onClick={() => navigate("/teams/create")}
            >
              Create Team
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
              onClick={() => navigate("/teams/join")}
            >
              Join Team
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-red-500" />
              {teamName}
            </h3>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>
                Level <span className="text-red-500 font-bold">{teamLevel}</span>
              </span>
              <span>{totalExp} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-red-500 to-red-700 h-3 rounded-full transition-all duration-500"
                style={{ width: `${teamProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white p-4 rounded-xl flex items-center justify-between gap-4 text-gray-800 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-3 w-1/3">
                  <img
                    src={member.profilePicture || "https://via.placeholder.com/40"}
                    alt={`${member.firstName} ${member.lastName ?? ""}`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-red-500"
                  />
                  <span className="font-medium">
                    {member.firstName} {member.lastName ?? ""}
                  </span>
                </div>

                <div className="w-1/4 text-sm text-gray-500">
                  <CountryName code={member.nationality ?? ""} />
                </div>

                <div className="w-1/6 flex items-center justify-center text-sm text-gray-600 font-medium">
                  Lv. {Math.floor((member.experience ?? 0) / 1000)}
                </div>

                <div className="w-1/6 text-right text-sm text-gray-500 font-medium">
                  {member.experience ?? 0} XP
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TeamSection
