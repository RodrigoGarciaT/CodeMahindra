"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Users, Crown, Zap } from "lucide-react"
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const memberVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-red-100 text-gray-800 md:col-span-2 relative overflow-hidden"
    >
      <motion.div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-red-100/40 to-transparent rounded-full blur-3xl" animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div variants={itemVariants} className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-xl">🛡️</span> Team
        </h2>
        {user?.team_id && (
          <motion.button className="text-xs z-30 text-red-500 hover:text-red-600 font-medium transition-all duration-300 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 flex items-center gap-2" onClick={() => navigate(`/team/${user.team_id}`)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span>View more</span>
          </motion.button>
        )}
      </motion.div>

      {!user?.team_id ? (
        <motion.div variants={itemVariants} className="text-center bg-gradient-to-br from-white to-red-50 rounded-2xl p-5 border border-red-200 relative overflow-hidden">
          <motion.div className="absolute inset-0 bg-gradient-to-r from-red-100/20 via-transparent to-red-100/20" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          <div className="relative z-10">
            <motion.div className="text-5xl mb-3" animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>🏴‍️</motion.div>
            <p className="text-base font-semibold mb-4 text-gray-700 flex items-center justify-center gap-2">
              <span className="text-lg">🤝</span> You're not part of a team yet.
            </p>
            <div className="flex justify-center gap-3">
              <motion.button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-md shadow-red-500/25 flex items-center gap-2" onClick={() => navigate("/teams/create")} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <span className="text-base">⚔️</span> Create Team
              </motion.button>
              <motion.button className="bg-white text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold border border-gray-300 shadow-md flex items-center gap-2" onClick={() => navigate("/teams/join")} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <span className="text-base">🚪</span> Join Team
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div variants={itemVariants} className="mb-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-4 border border-red-200 relative overflow-hidden">
              <motion.div className="absolute inset-0 bg-gradient-to-r from-red-100/50 via-transparent to-red-100/50" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
              <div className="relative z-10">
                <h3 className="font-semibold text-base flex items-center gap-3 mb-3">
                  <motion.div className="p-2 bg-red-200 rounded-xl border border-red-300" whileHover={{ rotate: 10, scale: 1.1 }}>
                    <Users className="w-5 h-5 text-red-600" />
                  </motion.div>
                  <span className="text-gray-800">{teamName}</span>
                  <motion.span className="text-xl" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>👑</motion.span>
                </h3>
                <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>Level <span className="text-red-600 font-semibold text-base">{teamLevel}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">{totalExp} XP</span>
                  </div>
                </div>
                <div className="w-full bg-red-200 rounded-full h-3 overflow-hidden shadow-inner border border-red-300 relative">
                  <motion.div className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 h-3 rounded-full relative" initial={{ width: 0 }} animate={{ width: `${teamProgress}%` }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}>
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" animate={{ x: [-100, 200] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                  </motion.div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>Progress to Level {teamLevel + 1}</span>
                  <span>{Math.round(teamProgress)}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">👥</span>
              <h4 className="font-semibold text-gray-700 text-sm">Team Members</h4>
              <motion.span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>{members.length} members</motion.span>
            </div>
            {members.map((member, index) => (
              <motion.div key={member.id} variants={memberVariants} className="bg-gradient-to-r from-white to-red-50 p-4 rounded-2xl flex items-center justify-between gap-3 text-gray-800 border border-red-200 shadow-md hover:shadow-red-200/50 transition-all duration-300 relative overflow-hidden group" whileHover={{ scale: 1.02, y: -2, transition: { type: "spring", stiffness: 300, damping: 20 } }}>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-transparent to-red-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }} />
                <div className="flex items-center gap-3 w-1/3 relative z-10">
                  <motion.div className="relative" whileHover={{ scale: 1.1, rotate: 5 }}>
                    <img src={member.profilePicture || "https://via.placeholder.com/40"} alt={`${member.firstName} ${member.lastName ?? ""}`} className="w-10 h-10 rounded-full object-cover border-2 border-red-300 shadow-md" />
                    <motion.div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }} />
                  </motion.div>
                  <span className="font-semibold text-gray-700 text-sm">{member.firstName} {member.lastName ?? ""}</span>
                </div>
                <div className="w-1/4 text-xs text-gray-600 relative z-10 flex items-center gap-2">
                  <span className="text-sm">🌍</span>
                  <CountryName code={member.nationality ?? ""} />
                </div>
                <div className="w-1/6 flex items-center justify-center text-xs text-gray-700 font-semibold relative z-10">
                  <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full border border-amber-200">
                    <Crown className="w-3 h-3 text-amber-600" /> <span>Lv. {Math.floor((member.experience ?? 0) / 1000)}</span>
                  </div>
                </div>
                <div className="w-1/6 text-right text-xs text-gray-600 font-semibold relative z-10">
                  <div className="flex items-center justify-end gap-1">
                    <Zap className="w-3 h-3 text-blue-500" /> <span>{member.experience ?? 0} XP</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  {index === 0 && <span className="text-base">🥇</span>}
                  {index === 1 && <span className="text-base">🥈</span>}
                  {index === 2 && <span className="text-base">🥉</span>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

export default TeamSection