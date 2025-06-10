"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  GitPullRequest,
  GitCommit,
  Star,
  Clock,
  FileText,
  TrendingUp,
  Activity,
  Code,
  AlertCircle,
  CheckCircle,
  XCircle,
  BookOpen,
  ExternalLink,
  Zap,
  BarChart3,
  Calendar,
  User,
  Target,
  Flame,
  Sparkles,
  Trophy,
  Rocket,
  Shield,
  Crown,
  Gamepad2,
  TrendingDown,
} from "lucide-react"

// Custom Card Component
const Card = ({ children, className = "", ...props }: any) => (
  <motion.div
    className={`bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl ${className}`}
    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.25)" }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    {...props}
  >
    {children}
  </motion.div>
)

const CardHeader = ({ children, className = "" }: any) => <div className={`p-6 pb-3 ${className}`}>{children}</div>

const CardContent = ({ children, className = "" }: any) => <div className={`p-6 pt-3 ${className}`}>{children}</div>

const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>
)

// Custom Badge Component
const Badge = ({ children, variant = "default", className = "" }: any) => {
  const variants = {
    default: "bg-red-500/20 text-red-400 border-red-500/30",
    secondary: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    success: "bg-green-500/20 text-green-400 border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

// Custom Avatar Component
const Avatar = ({ src, alt, fallback, className = "" }: any) => (
  <div className={`relative inline-block ${className}`}>
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className="w-full h-full rounded-full object-cover border-2 border-red-500/50"
      onError={(e) => {
        e.currentTarget.style.display = "none"
        e.currentTarget.nextElementSibling.style.display = "flex"
      }}
    />
    <div className="w-full h-full rounded-full bg-red-500 text-white font-bold flex items-center justify-center text-lg hidden">
      {fallback}
    </div>
  </div>
)

// Particle System Component
const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: any[] = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(239, 68, 68, ${particle.opacity})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{count}</span>
}

// Add this new Timeline Chart Component after the AnimatedCounter component
const TimelineChart = ({
  title,
  data,
  color = "#ef4444",
  icon: Icon,
}: {
  title: string
  data: { days: string[]; quality: number[]; count: number[] }
  color?: string
  icon: any
}) => {
  //const maxQuality = Math.max(...data.quality)
  //const minQuality = Math.min(...data.quality)

  if (data.days.length === 0) {
    return (
      <Card>
        <CardHeader className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-b border-red-500/30">
          <CardTitle className="flex items-center text-red-400">
            <Icon className="w-6 h-6 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Icon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">No timeline data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-b border-red-500/30">
        <CardTitle className="flex items-center justify-between text-red-400">
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Icon className="w-6 h-6 mr-2" />
            </motion.div>
            {title}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Avg: {(data.quality.reduce((a, b) => a + b, 0) / data.quality.length).toFixed(1)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative h-64">
          <svg className="w-full h-full" viewBox="0 0 800 200">
            {/* Grid lines */}
            {[0, 2, 4, 6, 8, 10].map((value) => (
              <g key={value}>
                <line
                  x1="50"
                  y1={180 - (value / 10) * 160}
                  x2="750"
                  y2={180 - (value / 10) * 160}
                  stroke="#374151"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text x="40" y={185 - (value / 10) * 160} fill="#9CA3AF" fontSize="12" textAnchor="end">
                  {value}
                </text>
              </g>
            ))}

            {/* Chart line */}
            <motion.path
              d={`M ${data.quality
                .map(
                  (quality, index) =>
                    `${50 + index * (700 / (data.quality.length - 1 || 1))},${180 - (quality / 10) * 160}`,
                )
                .join(" L ")}`}
              fill="none"
              stroke={color}
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Data points */}
            {data.quality.map((quality, index) => (
              <motion.g key={index}>
                <motion.circle
                  cx={50 + index * (700 / (data.quality.length - 1 || 1))}
                  cy={180 - (quality / 10) * 160}
                  r="6"
                  fill={color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.5 }}
                />
                <motion.circle
                  cx={50 + index * (700 / (data.quality.length - 1 || 1))}
                  cy={180 - (quality / 10) * 160}
                  r="12"
                  fill={color}
                  fillOpacity="0.2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                />
              </motion.g>
            ))}

            {/* X-axis labels */}
            {data.days.map((day, index) => (
              <text
                key={index}
                x={50 + index * (700 / (data.days.length - 1 || 1))}
                y="195"
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="middle"
              >
                {new Date(day).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
              </text>
            ))}
          </svg>
        </div>

        {/* Quality trend indicator */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {data.quality[data.quality.length - 1] > data.quality[0] ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className="text-sm text-gray-400">
              {data.quality[data.quality.length - 1] > data.quality[0] ? "Improving" : "Declining"} trend
            </span>
          </div>
          <div className="text-sm text-gray-400">Total items: {data.count.reduce((a, b) => a + b, 0)}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// Add this new Achievement Component after TimelineChart
const AchievementBadge = ({
  title,
  description,
  icon: Icon,
  unlocked = false,
  progress = 0,
}: {
  title: string
  description: string
  icon: any
  unlocked?: boolean
  progress?: number
}) => (
  <motion.div
    className={`p-4 rounded-lg border-2 transition-all ${
      unlocked
        ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50"
        : "bg-gray-800/50 border-gray-600/50"
    }`}
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center space-x-3">
      <motion.div
        className={`p-2 rounded-full ${unlocked ? "bg-yellow-500/30" : "bg-gray-600/30"}`}
        animate={unlocked ? { rotate: [0, 10, -10, 0] } : {}}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <Icon className={`w-5 h-5 ${unlocked ? "text-yellow-400" : "text-gray-500"}`} />
      </motion.div>
      <div className="flex-1">
        <h4 className={`font-semibold ${unlocked ? "text-yellow-400" : "text-gray-400"}`}>{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
        {!unlocked && progress > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <motion.div
                className="bg-yellow-500 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-xs text-gray-500">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
)



import { Lightbulb } from "lucide-react";

export const DeveloperMessageCard = () => {
  return (
    <div className="bg-[#161b22] rounded-xl border border-purple-700/50 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600/20 to-purple-900/10 px-6 py-4 border-b border-purple-700/30">
        <h2 className="text-purple-300 text-xl font-semibold flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <Lightbulb className="w-5 h-5 text-purple-400" />
          </motion.div>
          A Message for You
        </h2>
      </div>

      <div className="px-6 py-5 space-y-4 text-white">
        <p className="text-base leading-relaxed text-gray-300">
          Every commit tells a story. Every pull request is a step toward mastery.
        </p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg italic text-purple-300"
        >
          “Consistency beats perfection. Keep pushing.”
        </motion.p>

        <div className="flex items-center justify-end text-sm text-purple-400">
          <Sparkles className="w-4 h-4 mr-1" />
          You're building more than code — you're building yourself.
        </div>
      </div>
    </div>
  );
};


// Add this new Gamification Stats Component
const GamificationStats = ({ data }: { data: DashboardData }) => {
  const achievements = [
    {
      title: "Code Quality Master",
      description: "Maintain 8+ average quality",
      icon: Crown,
      unlocked: data.kpis.avg_quality_prs >= 8,
      progress: (data.kpis.avg_quality_prs / 10) * 100,
    },
    {
      title: "Prolific Contributor",
      description: "Create 50+ pull requests",
      icon: Rocket,
      unlocked: data.kpis.total_prs >= 50,
      progress: Math.min((data.kpis.total_prs / 50) * 100, 100),
    },
    {
      title: "Code Reviewer",
      description: "Review 100+ commits",
      icon: Shield,
      unlocked: data.kpis.total_commits >= 100,
      progress: Math.min((data.kpis.total_commits / 100) * 100, 100),
    },
    {
      title: "Speed Demon",
      description: "Average merge time < 2 days",
      icon: Zap,
      unlocked: data.kpis.avg_merge_time_days < 2,
      progress: Math.max(100 - (data.kpis.avg_merge_time_days / 5) * 100, 0),
    },
  ]

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalXP = data.kpis.total_prs * 10 + data.kpis.total_commits * 5 + unlockedCount * 100

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-b border-purple-500/30">
        <CardTitle className="flex items-center justify-between text-purple-400">
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Gamepad2 className="w-6 h-6 mr-2" />
            </motion.div>
            Developer Achievements
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span>
                {unlockedCount}/{achievements.length}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4" />
              <span>{totalXP} XP</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <AchievementBadge key={index} {...achievement} />
          ))}
        </div>

        {/* Level Progress */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-400 font-semibold">Developer Level</span>
            <span className="text-purple-400">Level {Math.floor(totalXP / 500) + 1}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((totalXP % 500) / 500) * 100}%` }}
              transition={{ duration: 2 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{totalXP % 500} XP</span>
            <span>{500 - (totalXP % 500)} XP to next level</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Quality Indicator Component
const QualityIndicator = ({ quality }: { quality: number }) => {
  const getColor = (q: number) => {
    if (q >= 8) return "text-green-400"
    if (q >= 6) return "text-yellow-400"
    return "text-red-400"
  }

  const getIcon = (q: number) => {
    if (q >= 8) return <CheckCircle className="w-4 h-4" />
    if (q >= 6) return <AlertCircle className="w-4 h-4" />
    return <XCircle className="w-4 h-4" />
  }

  return (
    <div className={`flex items-center space-x-1 ${getColor(quality)}`}>
      {getIcon(quality)}
      <span className="font-bold">{quality}/10</span>
    </div>
  )
}

// Main Dashboard Component
interface DashboardData {
  user: {
    username: string
    avatar_url: string
    email?: string
  }
  kpis: {
    total_prs: number
    analyzed_prs: number
    total_commits: number
    analyzed_commits: number
    avg_quality_prs: number
    avg_quality_commits: number
    total_recommendations: number
    total_resources: number
    total_lines_added: number
    total_lines_deleted: number
    avg_merge_time_days: number
  }
  timeline: {
    prs: {
      days: string[]
      quality: number[]
      count: number[]
    }
    commits: {
      days: string[]
      quality: number[]
      count: number[]
    }
  }
  feedback_distribution: Record<string, number>
  top_modified_files: Array<{ file: string; count: number }>
  recommendations: string[]
  resources: Array<{ title: string; link: string }>
  recent: {
    prs: Array<{
      title: string
      file: string
      retro: string
      comments: number
      created_at: string
      merged_at: string | null
      state: string
    }>
    commits: Array<{
      sha: string
      message: string
      status: string
      created_at: string
    }>
  }
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { repoFullName } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await fetch(
          `${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/repo-dashboard?repo=${repoFullName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    if (repoFullName) {
      fetchData()
    }
  }, [repoFullName])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <ParticleSystem />
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Dashboard</h2>
          <p className="text-gray-400">Analyzing your repository data...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <ParticleSystem />
        <motion.div
          className="text-center z-10 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    )
  }

  if (!data) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <ParticleSystem />

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Avatar
                  src={data.user.avatar_url}
                  alt={data.user.username}
                  fallback={data.user.username.slice(0, 2).toUpperCase()}
                  className="w-20 h-20"
                />
              </motion.div>
              <div>
                <motion.h1
                  className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent flex items-center space-x-2"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <User className="w-8 h-8 text-red-500" />
                  <span>{data.user.username}</span>
                </motion.h1>
                <motion.p
                  className="text-gray-400 text-lg"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {repoFullName} Analytics Dashboard
                </motion.p>
              </div>
            </div>
            <motion.div
              className="flex items-center space-x-2 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <Activity className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Live Dashboard</span>
            </motion.div>
          </motion.div>

          {/* KPI Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-300 text-sm font-medium mb-1">Total PRs</p>
                    <p className="text-3xl font-bold text-white">
                      <AnimatedCounter value={data.kpis.total_prs} />
                    </p>
                    <div className="flex items-center mt-2 text-green-400 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>{data.kpis.analyzed_prs} analyzed</span>
                    </div>
                  </div>
                  <motion.div
                    className="bg-red-500/20 p-3 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GitPullRequest className="w-8 h-8 text-red-400" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-300 text-sm font-medium mb-1">Total Commits</p>
                    <p className="text-3xl font-bold text-white">
                      <AnimatedCounter value={data.kpis.total_commits} />
                    </p>
                    <div className="flex items-center mt-2 text-green-400 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>{data.kpis.analyzed_commits} analyzed</span>
                    </div>
                  </div>
                  <motion.div
                    className="bg-yellow-500/20 p-3 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GitCommit className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-sm font-medium mb-1">Avg PR Quality</p>
                    <p className="text-3xl font-bold text-white">{data.kpis.avg_quality_prs}/10</p>
                    <QualityIndicator quality={data.kpis.avg_quality_prs} />
                  </div>
                  <motion.div
                    className="bg-green-500/20 p-3 rounded-full"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Star className="w-8 h-8 text-green-400" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium mb-1">Avg Merge Time</p>
                    <p className="text-3xl font-bold text-white">{data.kpis.avg_merge_time_days}d</p>
                    <div className="flex items-center mt-2 text-blue-400 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Average</span>
                    </div>
                  </div>
                  <motion.div
                    className="bg-blue-500/20 p-3 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Clock className="w-8 h-8 text-blue-400" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline Charts Section - ADD THIS AFTER THE KPI CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <TimelineChart
                title="Pull Request Quality Over Time"
                data={data.timeline.prs}
                color="#ef4444"
                icon={GitPullRequest}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <TimelineChart
                title="Commit Quality Over Time"
                data={data.timeline.commits}
                color="#eab308"
                icon={GitCommit}
              />
            </motion.div>
          </div>

          {/* Gamification Section - ADD THIS AFTER THE TIMELINE CHARTS */}
          {
          <motion.div variants={itemVariants}>
            <GamificationStats data={data} />
          </motion.div>
          }
          {/*
          <motion.div variants={itemVariants}>
            <DeveloperMessageCard/>
          </motion.div>
          */}
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feedback Distribution */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-b border-red-500/30">
                  <CardTitle className="flex items-center text-red-400">
                    <BarChart3 className="w-6 h-6 mr-2" />
                    Feedback Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(data.feedback_distribution).length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">No feedback data available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(data.feedback_distribution).map(([status, count], index) => {
                        const maxCount = Math.max(...Object.values(data.feedback_distribution))
                        const percentage = (count / maxCount) * 100

                        const statusColors = {
                          excellent: "bg-green-500",
                          good: "bg-yellow-500",
                          needs_improvement: "bg-red-500",
                          not_analyzed: "bg-gray-500",
                        }

                        const statusIcons = {
                          excellent: <CheckCircle className="w-4 h-4 text-green-400" />,
                          good: <AlertCircle className="w-4 h-4 text-yellow-400" />,
                          needs_improvement: <XCircle className="w-4 h-4 text-red-400" />,
                          not_analyzed: <XCircle className="w-4 h-4 text-gray-400" />,
                        }

                        return (
                          <motion.div
                            key={status}
                            className="flex items-center justify-between"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center space-x-3">
                              {statusIcons[status as keyof typeof statusIcons]}
                              <span className="text-white font-medium capitalize">{status.replace("_", " ")}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                                <motion.div
                                  className={`h-full ${statusColors[status as keyof typeof statusColors]}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                />
                              </div>
                              <span className="text-white font-bold w-8">{count}</span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Modified Files */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-b border-yellow-500/30">
                  <CardTitle className="flex items-center text-yellow-400">
                    <FileText className="w-6 h-6 mr-2" />
                    Top Modified Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.top_modified_files.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">No file data available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.top_modified_files.map((file, index) => (
                        <motion.div
                          key={file.file}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center space-x-3">
                            <motion.div
                              className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {index + 1}
                            </motion.div>
                            <Code className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-sm text-white">{file.file}</span>
                          </div>
                          <Badge variant="secondary">
                            <Flame className="w-3 h-3 mr-1" />
                            {file.count} changes
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent PRs */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-b border-red-500/30">
                  <CardTitle className="flex items-center text-red-400">
                    <GitPullRequest className="w-6 h-6 mr-2" />
                    Recent Pull Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recent.prs.length === 0 ? (
                    <div className="text-center py-8">
                      <GitPullRequest className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">No recent PRs</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.recent.prs.map((pr, index) => (
                        <motion.div
                          key={index}
                          className="border-l-4 border-red-500 pl-4 py-3 bg-gray-800/30 rounded-r-lg"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-2">{pr.title}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <FileText className="w-3 h-3" />
                                  <span>{pr.file}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(pr.created_at).toLocaleDateString()}</span>
                                </div>
                                <span>{pr.comments} comments</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <QualityIndicator quality={8} />
                              <Badge variant={pr.state === "merged" ? "success" : "secondary"}>{pr.state}</Badge>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Commits */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="bg-gradient-to-r from-gray-600/20 to-gray-700/20 border-b border-gray-600/30">
                  <CardTitle className="flex items-center text-gray-400">
                    <GitCommit className="w-6 h-6 mr-2" />
                    Recent Commits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recent.commits.length === 0 ? (
                    <div className="text-center py-8">
                      <GitCommit className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">No recent commits</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.recent.commits.map((commit, index) => (
                        <motion.div
                          key={commit.sha}
                          className="border-l-4 border-gray-500 pl-4 py-3 bg-gray-800/30 rounded-r-lg"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-2">{commit.message}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <code className="bg-gray-700 px-2 py-1 rounded text-xs">{commit.sha.slice(0, 7)}</code>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(commit.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <QualityIndicator quality={7} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recommendations and Resources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Recommendations */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-b border-red-500/30">
                  <CardTitle className="flex items-center text-red-400">
                    <Zap className="w-6 h-6 mr-2" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recommendations.filter((r) => r.trim() !== "").length === 0 ? (
                    <div className="text-center py-8">
                      <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">No recommendations available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.recommendations
                        .filter((r) => r.trim() !== "")
                        .map((rec, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start space-x-3 p-4 bg-red-500/10 rounded-lg border-l-4 border-red-500"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">{rec}</p>
                          </motion.div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Learning Resources */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-b border-yellow-500/30">
                  <CardTitle className="flex items-center text-yellow-400">
                    <BookOpen className="w-6 h-6 mr-2" />
                    Learning Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.resources.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">No resources available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.resources.map((resource, index) => (
                        <motion.a
                          key={index}
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg border-l-4 border-yellow-500 hover:bg-yellow-500/20 transition-colors group"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center space-x-3">
                            <BookOpen className="w-4 h-4 text-yellow-400" />
                            <span className="font-medium text-white">{resource.title}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                        </motion.a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Code Statistics */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="bg-gradient-to-r from-gray-600/20 to-gray-700/20 border-b border-gray-600/30">
                <CardTitle className="flex items-center text-gray-400">
                  <Activity className="w-6 h-6 mr-2" />
                  Code Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <motion.div
                      className="text-4xl font-bold text-green-400 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      +<AnimatedCounter value={data.kpis.total_lines_added} />
                    </motion.div>
                    <p className="text-gray-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Lines Added
                    </p>
                  </motion.div>
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <motion.div
                      className="text-4xl font-bold text-red-400 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                    >
                      -<AnimatedCounter value={data.kpis.total_lines_deleted} />
                    </motion.div>
                    <p className="text-gray-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                      Lines Deleted
                    </p>
                  </motion.div>
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <motion.div
                      className="text-4xl font-bold text-blue-400 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring" }}
                    >
                      {data.kpis.total_lines_added > 0
                        ? (
                            ((data.kpis.total_lines_added - data.kpis.total_lines_deleted) /
                              data.kpis.total_lines_added) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </motion.div>
                    <p className="text-gray-400 flex items-center justify-center">
                      <Target className="w-4 h-4 mr-1" />
                      Net Growth
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
