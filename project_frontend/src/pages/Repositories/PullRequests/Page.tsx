"use client"

import { useEffect, useState } from "react"
import {
  GitPullRequest,
  GitMerge,
  XCircle,
  MessageSquare,
  CheckIcon,
  Loader,
  CheckCheck,
  CircleSlash,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"

interface PullRequest {
  title: string
  number: number
  author: string
  date: string
  retro: string
  comments: number
  status: "open" | "closed" | "merged"
}

function RetroBadge({ retro }: { retro: string }) {
  const base =
    "text-xs px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1.5 transition-all duration-200"

  switch (retro) {
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

function PullRequestItem({ pr }: { pr: PullRequest }) {
  const { repoFullName } = useParams()

  const getStatusIcon = () => {
    switch (pr.status) {
      case "open":
        return <GitPullRequest className="text-green-400 flex-shrink-0" size={16} />
      case "merged":
        return <GitMerge className="text-purple-400 flex-shrink-0" size={16} />
      case "closed":
        return <XCircle className="text-red-400 flex-shrink-0" size={16} />
      default:
        return null
    }
  }

  return (
    <div className="group px-6 py-4 hover:bg-[#161b22]/80 transition-all duration-200 border-b border-[#30363d] last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            {getStatusIcon()}
            <div className="flex-1 min-w-0">
              <Link
                to={`/repos/${encodeURIComponent(repoFullName!)}/PullRequests/${pr.number}/feedback`}
                className="text-white font-semibold text-base leading-tight hover:text-red-400 transition-colors duration-200 cursor-pointer block group-hover:underline"
              >
                {pr.title}
              </Link>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <span className="font-mono text-xs bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">
                  #{pr.number}
                </span>
                <span>by</span>
                <span className="font-medium text-gray-300">{pr.author}</span>
                <span>•</span>
                <span>{pr.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <RetroBadge retro={pr.retro} />
          <div className="flex items-center gap-1.5 text-gray-400 text-sm bg-[#21262d] px-3 py-1.5 rounded-full border border-[#30363d] hover:border-[#40464d] transition-colors duration-200">
            <MessageSquare size={14} />
            <span className="font-medium">{pr.comments}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PullRequestSkeleton() {
  return (
    <div className="px-6 py-4 border-b border-[#30363d] last:border-b-0 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-4 h-4 bg-[#21262d] rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-5 bg-[#21262d] rounded w-3/4 mb-2"></div>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-4 bg-[#21262d] rounded w-16"></div>
                <div className="h-4 bg-[#21262d] rounded w-24"></div>
                <div className="h-4 bg-[#21262d] rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="h-7 bg-[#21262d] rounded-full w-24"></div>
          <div className="h-7 bg-[#21262d] rounded-full w-16"></div>
        </div>
      </div>
    </div>
  )
}

export default function PullRequests() {
  const { repoFullName } = useParams()
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([])
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open")
  const [loading, setLoading] = useState(true)

  const [shouldFetch, setShouldFetch] = useState(!!repoFullName)

  useEffect(() => {
    setShouldFetch(!!repoFullName)
  }, [repoFullName])

  useEffect(() => {
    if (!shouldFetch) return

    const fetchPRs = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("❌ No token found in localStorage")
          setLoading(false)
          return
        }

        const res = await axios.get(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/pull-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            repo: repoFullName,
          },
        })

        setPullRequests(res.data)
        console.log(pullRequests)
        setLoading(false)
      } catch (error) {
        console.error("❌ Error fetching pull requests:", error)
        setLoading(false)
      }
    }

    fetchPRs()
  }, [shouldFetch, repoFullName])

  const openPRs = pullRequests.filter((pr) => pr.status === "open")
  const closedPRs = pullRequests.filter((pr) => pr.status === "closed" || pr.status === "merged")
  const visiblePRs = activeTab === "open" ? openPRs : closedPRs

  return (
    <div className="px-8 py-8 text-white max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Pull Requests</h1>
      </div>

      {/* Enhanced GitHub-style tabs */}
      <div className="flex items-center gap-8 text-sm mb-8 border-b border-[#30363d]">
        <button
          onClick={() => setActiveTab("open")}
          className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-all duration-200 ${
            activeTab === "open"
              ? "text-white border-red-500 font-semibold"
              : "text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-600"
          }`}
        >
          <GitPullRequest size={16} />
          <span>{openPRs.length} Open</span>
        </button>

        <button
          onClick={() => setActiveTab("closed")}
          className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-all duration-200 ${
            activeTab === "closed"
              ? "text-white border-red-500 font-semibold"
              : "text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-600"
          }`}
        >
          <CheckIcon size={16} />
          <span>{closedPRs.length} Closed</span>
        </button>
      </div>

      {/* Enhanced PR list */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden shadow-xl">
        {loading ? (
          // Skeleton loaders mientras se cargan los datos
          <>
            <PullRequestSkeleton />
            <PullRequestSkeleton />
            <PullRequestSkeleton />
          </>
        ) : visiblePRs.length > 0 ? (
          visiblePRs.map((pr, index) => <PullRequestItem key={`${activeTab}-${index}`} pr={pr} />)
        ) : (
          <div className="px-8 py-12 text-center">
            <div className="mb-4">
              <GitPullRequest size={48} className="mx-auto text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium mb-2">No pull requests found</p>
            <p className="text-gray-500 text-sm">There are no {activeTab} pull requests in this repository.</p>
          </div>
        )}
      </div>
    </div>
  )
}
