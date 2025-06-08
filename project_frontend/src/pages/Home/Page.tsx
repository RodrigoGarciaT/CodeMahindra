import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTeamMembers } from "@/hooks/useTeamMembers"
import type { Bot as BotType } from "../BotStore/Page"
import ProfileSection from "./ProfileSection"
import WeeklyChallengesSection from "./WeeklyChallengesSection"
import BotSection from "./BotSection"
import TeamSection from "./TeamSection"
import AchievementsSection from "./AchievementsSection"

interface Achievement {
  id: string
  name: string
  category: string
  topic: string
  description: string
  icon: React.ReactNode
  imageUrl?: string
  earned?: boolean
}

function Home() {
  const [user, setUser] = useState({
    photo: "",
    firstName: "",
    lastName: "",
    experience: 0,
    nationality: "",
    profilePicture: "",
    team_id: null,
  })

  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [equippedBot, setEquippedBot] = useState<BotType | null>(null)
  const [fetchedTeamName, setFetchedTeamName] = useState<string>("")

  const [purchasedBot] = useState<BotType | null>(() => {
    const saved = localStorage.getItem("purchasedBots")
    if (saved) {
      const bots = JSON.parse(saved)
      return bots.length > 0 ? bots[0] : null
    }
    return null
  })

  const { members } = useTeamMembers(user?.team_id || "")

  useEffect(() => {
    const userId = localStorage.getItem("user_id")
    if (!userId) return

    fetch(`${import.meta.env.VITE_BACKEND_URL}/achievements/status/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const earned = data.earned?.map((a: Achievement) => ({ ...a, earned: true })) || []
        const unearned = data.unearned?.map((a: Achievement) => ({ ...a, earned: false })) || []
        setAchievements([...earned, ...unearned])
      })
      .catch((err) => console.error("Error fetching achievements:", err))
  }, [])

  useEffect(() => {
    const fetchEquippedBot = async () => {
      try {
        const employeeId = localStorage.getItem("user_id")
        if (!employeeId) return

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bots/employee/${employeeId}/equipped`)
        if (response.ok) {
          const data = await response.json()
          setEquippedBot(data)
        }
      } catch (error) {
        console.error("Error fetching equipped bot:", error)
      }
    }
    fetchEquippedBot()
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser({
            photo: data.photo || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            experience: data.experience || 0,
            nationality: data.nationality || "",
            profilePicture: data.profilePicture || "",
            team_id: data.team_id || null,
          })
        })
        .catch((err) => console.error(err))
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (user.team_id && token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/teams/${user.team_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFetchedTeamName(data.name || "")
        })
        .catch((err) => console.error("Error al obtener nombre del equipo:", err))
    }
  }, [user.team_id])

  const totalExp = members.reduce((sum, m) => sum + (m.experience ?? 0), 0)
  const teamName = fetchedTeamName || (members.length > 0 ? `Equipo de ${members[0].firstName}` : "Tu equipo")

  return (
    <div className="min-h-screen bg-[#1A1C1E] text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <ProfileSection user={user} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <WeeklyChallengesSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <BotSection equippedBot={equippedBot} purchasedBot={purchasedBot} />
        </motion.div>

        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: -40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <TeamSection user={user} members={members} teamName={teamName} totalExp={totalExp} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <AchievementsSection achievements={achievements} />
        </motion.div>
      </div>
    </div>
  )
}

export default Home
