"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  GitPullRequest,
  GitCommit,
  Star,
  Clock,
  TrendingUp,
  Activity,
  XCircle,
  User,
  Target,
  TrendingDown,
  BarChart3,
  Code,
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

// Custom Avatar Component
const Avatar = ({ src, alt, fallback, className = "" }: any) => (
  <div className={`relative inline-block ${className}`}>
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className="w-full h-full rounded-full object-cover border-2 border-red-500/50"
      onError={(e) => {
        e.currentTarget.style.display = "none"
        const fallbackEl = e.currentTarget.nextElementSibling as HTMLElement | null
        if (fallbackEl) {
          fallbackEl.style.display = "flex"
        }
      }}
    />
    <div className="w-full h-full rounded-full bg-red-500 text-white font-bold items-center justify-center text-lg hidden">
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

// Timeline Chart Component
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

          {/* 1. REPOSITORY OVERVIEW - Métricas generales */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-b border-blue-500/30">
                <CardTitle className="flex items-center text-blue-400">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  Repository Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Activity */}
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="text-center">
                        <motion.div
                          className="text-3xl font-bold text-red-400 mb-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          <AnimatedCounter value={data.kpis.total_prs} />
                        </motion.div>
                        <p className="text-gray-400 text-sm flex items-center justify-center">
                          <GitPullRequest className="w-4 h-4 mr-1" />
                          Total PRs
                        </p>
                      </div>
                      <div className="text-center">
                        <motion.div
                          className="text-3xl font-bold text-yellow-400 mb-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring" }}
                        >
                          <AnimatedCounter value={data.kpis.total_commits} />
                        </motion.div>
                        <p className="text-gray-400 text-sm flex items-center justify-center">
                          <GitCommit className="w-4 h-4 mr-1" />
                          Total Commits
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Analysis Coverage */}
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <motion.div
                      className="text-3xl font-bold text-green-400 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring" }}
                    >
                      {((data.kpis.analyzed_prs / Math.max(data.kpis.total_prs, 1)) * 100).toFixed(0)}%
                    </motion.div>
                    <p className="text-gray-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      PR Analysis Coverage
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {data.kpis.analyzed_prs} of {data.kpis.total_prs} analyzed
                    </p>
                  </motion.div>

                  {/* Commit Coverage */}
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <motion.div
                      className="text-3xl font-bold text-purple-400 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                    >
                      {((data.kpis.analyzed_commits / Math.max(data.kpis.total_commits, 1)) * 100).toFixed(0)}%
                    </motion.div>
                    <p className="text-gray-400 flex items-center justify-center">
                      <Activity className="w-4 h-4 mr-1" />
                      Commit Analysis Coverage
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {data.kpis.analyzed_commits} of {data.kpis.total_commits} analyzed
                    </p>
                  </motion.div>

                  {/* Merge Time */}
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <motion.div
                      className="text-3xl font-bold text-cyan-400 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: "spring" }}
                    >
                      {data.kpis.avg_merge_time_days}d
                    </motion.div>
                    <p className="text-gray-400 flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Avg Merge Time
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 2. QUALITY METRICS - Todo relacionado con calidad */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-500/20 to-green-600/20 border-b border-green-500/30">
                <CardTitle className="flex items-center text-green-400">
                  <Star className="w-6 h-6 mr-2" />
                  Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* PR Quality */}
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <motion.div
                      className="text-4xl font-bold text-red-400 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.0, type: "spring" }}
                    >
                      {data.kpis.avg_quality_prs}/10
                    </motion.div>
                    <p className="text-gray-400 flex items-center justify-center mb-2">
                      <GitPullRequest className="w-4 h-4 mr-1" />
                      Average PR Quality
                    </p>
                  </motion.div>

                  {/* Commit Quality */}
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <motion.div
                      className="text-4xl font-bold text-yellow-400 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.1, type: "spring" }}
                    >
                      {data.kpis.avg_quality_commits}/10
                    </motion.div>
                    <p className="text-gray-400 flex items-center justify-center mb-2">
                      <GitCommit className="w-4 h-4 mr-1" />
                      Average Commit Quality
                    </p>
                  </motion.div>
                </div>

                {/* Quality Timeline Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TimelineChart
                    title="PR Quality Trend"
                    data={data.timeline.prs}
                    color="#ef4444"
                    icon={GitPullRequest}
                  />
                  <TimelineChart
                    title="Commit Quality Trend"
                    data={data.timeline.commits}
                    color="#eab308"
                    icon={GitCommit}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 3. CODE ACTIVITY - Todo relacionado con código y actividad */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-b border-orange-500/30">
                <CardTitle className="flex items-center text-orange-400">
                  <Code className="w-6 h-6 mr-2" />
                  Code Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Code Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <motion.div
                      className="text-4xl font-bold text-green-400 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: "spring" }}
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
                      transition={{ delay: 1.3, type: "spring" }}
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
                      transition={{ delay: 1.4, type: "spring" }}
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
