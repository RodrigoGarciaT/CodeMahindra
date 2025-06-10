"use client"

import {
  ArrowLeft,
  CalendarDays,
  User,
  GitBranch,
  Star,
  Loader,
  CheckCheck,
  CircleSlash,
  GitCommitHorizontal,
  BookOpen,
} from "lucide-react"
import { useEffect, useState } from "react"
import DetailsSection from "../../FeedbackComponents/DetailsSection"
import FeedbackRecommendedResources from "../../FeedbackComponents/FeedbackRecommendedResources"
import Summary from "../../FeedbackComponents/Summary"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import botImage from "@/images/robot_male_1.svg"

type Resource = {
  title: string
  image: string
  link: string
}

export type FeedbackComment = {
  filePath: string
  lineNumber: number
  type: "insert" | "delete" | "normal"
  comment: string
}

type CommitFeedbackData = {
  title: string
  date: string
  author: string
  avatar: string
  branch: string
  created_at?: string
  analyzed_at?: string
  quality?: number
  summary: string
  status: string
  feedback: FeedbackComment[]
  resources: Resource[]
  stats: {
    files_changed: number
    additions: number
    deletions: number
    total: number
  }
  files: any[]
  file_tree: any[]
}

function getStatusBadge(status: string) {
  console.log(status)
  const base =
    "text-xs px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1.5 transition-all duration-200"

  switch (status) {
    case "analyzing":
      return (
        <span className={`${base} bg-red-500/20 text-red-300 border border-red-500/30`}>
          <Loader size={12} className="animate-spin" />
          Analyzing
        </span>
      )

    case "analyzed":
      return (
        <span className={`${base} bg-red-400/20 text-red-200 border border-red-400/30`}>
          <CheckCheck size={12} />
          Analyzed
        </span>
      )

    case "not_analyzed":
      return (
        <span className={`${base} bg-gray-500/20 text-gray-300 border border-gray-500/30`}>
          <CircleSlash size={12} />
          Not Analyzed
        </span>
      )

    default:
      return null
  }
}

export default function CommitFeedback() {
  const { repoFullName, sha } = useParams()
  const location = useLocation()
  const branch = new URLSearchParams(location.search).get("branch") || "main"

  const [data, setData] = useState<CommitFeedbackData | null>(null)
  const navigate = useNavigate()
  const [botImageUrl, setBotImageUrl] = useState(botImage) // por defecto el actual

  useEffect(() => {
    const fetchEquippedBot = async () => {
      try {
        const employeeId = localStorage.getItem("user_id")
        if (!employeeId) return

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bots/employee/${employeeId}/equipped`)
        if (!res.ok) return

        const data = await res.json()
        if (data.image) {
          setBotImageUrl(data.image) // asegúrate que la propiedad sea `image`
        }
      } catch (error) {
        console.error("Error loading equipped bot:", error)
      }
    }

    fetchEquippedBot()
  }, [])

  useEffect(() => {
    const fetchCommitDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await axios.get(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/commit-feedback`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            repo: repoFullName,
            sha: sha,
          },
        })

        const raw = res.data
        const parsed: CommitFeedbackData = {
          title: raw.info.title,
          date: raw.info.date,
          author: raw.info.author,
          branch: branch,
          quality: raw.info.quality,
          summary: raw.summary,
          resources: Array.isArray(raw.recommended_resources) ? raw.recommended_resources : [],
          avatar: raw.info.avatar,
          stats: raw.stats,
          files: Array.isArray(raw.files) ? raw.files : [],
          file_tree: Array.isArray(raw.file_tree) ? raw.file_tree : [],
          status: raw.status,
          feedback: Array.isArray(raw.feedback) ? raw.feedback : [],
        }

        setData(parsed)
        console.log(parsed.resources)
      } catch (error) {
        console.error("❌ Error fetching commit details:", error)
      }
    }

    if (repoFullName && sha) fetchCommitDetails()
  }, [repoFullName, sha, branch])

  if (!data) return null

  return (
    <div className="w-full bg-[#0d1117] text-white px-4 md:px-10 py-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="mb-8">
        {/* Navigation and Title */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-[#21262d] border border-[#30363d] hover:border-red-500/50 hover:bg-[#161b22] transition-all duration-200 group"
          >
            <ArrowLeft size={20} className="text-gray-400 group-hover:text-red-400 transition-colors" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight truncate">{data.title}</h1>
          </div>
        </div>

        {/* Commit Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {/* Date Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-red-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <CalendarDays size={16} className="text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Date</p>
                <p className="text-sm text-white font-semibold truncate">{data.date}</p>
              </div>
            </div>
          </div>

          {/* Author Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-red-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <User size={16} className="text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Author</p>
                <p className="text-sm text-white font-semibold truncate">{data.author}</p>
              </div>
            </div>
          </div>

          {/* Branch Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-red-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <GitBranch size={16} className="text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Branch</p>
                <p className="text-sm text-white font-semibold truncate">{data.branch}</p>
              </div>
            </div>
          </div>

          {/* Quality Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-red-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Star size={16} className="text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Quality</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-semibold">{data.quality !== undefined ? `${data.quality}/10` : "Not Rated"}</p>
                  <div className="flex-1 bg-[#21262d] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((data.quality ? data.quality : 0) / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-red-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <GitCommitHorizontal size={16} className="text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Status</p>
                <div className="mt-1">{getStatusBadge(data.status)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 mt-10">
        <motion.div
          className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30"
          whileHover={{ scale: 1.1, rotate: -5 }}
        >
          <BookOpen className="w-6 h-6 text-red-400" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-white">Summary</h2>
          <p className="text-gray-400 text-sm">Generated overview of the commit</p>
        </div>
      </div>
      <Summary summary={data.summary} botImage={botImageUrl} />

      <div className="flex items-center gap-4 mb-3 mt-10">
        <motion.div
          className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30"
          whileHover={{ scale: 1.1, rotate: -5 }}
        >
          <GitCommitHorizontal className="w-6 h-6 text-red-400" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-white">Details</h2>
          <p className="text-gray-400 text-sm">Dive into code changes and insights</p>
        </div>
      </div>
      <DetailsSection
        files={data.files}
        fileTree={data.file_tree}
        stats={data.stats}
        feedback={data.feedback}
        botImage={botImageUrl}
      />

      <div className="flex items-center gap-4 mb-3 mt-10">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <BookOpen className="w-6 h-6 text-red-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">Recommended Resources</h2>
            <p className="text-gray-400 text-sm">Curated learning materials for you</p>
          </div>
        </div>
      </div>
      <FeedbackRecommendedResources resources={data.resources} />
    </div>
  )
}
