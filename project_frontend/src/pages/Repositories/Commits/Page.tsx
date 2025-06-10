"use client"

import { useState, useEffect } from "react"
import {
  GitCommitHorizontal,
  CheckCircle,
  GitBranch,
  Loader,
  CheckCheck,
  CircleSlash,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"

type Commit = {
  message: string
  author: string
  date: string
  status: string
  hash: string
  verified: boolean
}

type CommitsGrouped = {
  [date: string]: Commit[]
}

function getRetroBadge(status: string) {
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

function CommitSkeleton() {
  return (
    <div className="bg-[#0d1117] p-6 rounded-lg border border-[#30363d] animate-pulse">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-[#21262d] rounded w-3/4"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 bg-[#21262d] rounded w-24"></div>
            <div className="h-4 bg-[#21262d] rounded w-32"></div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="h-7 bg-[#21262d] rounded-full w-24"></div>
          <div className="flex items-center gap-2">
            <div className="h-6 bg-[#21262d] rounded w-16"></div>
            <div className="h-8 bg-[#21262d] rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DateGroupSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-4 bg-[#21262d] rounded w-48"></div>
      </div>
      <div className="border-l-2 border-[#30363d] pl-6 space-y-4">
        <CommitSkeleton />
        <CommitSkeleton />
      </div>
    </div>
  )
}

export default function Commits() {
  const { repoFullName } = useParams()
  if (!repoFullName) {
    console.error("Missing repoFullName");
    return;
  }
  const [branch, setBranch] = useState<string | null>(null)
  const [commitsGrouped, setCommitsGrouped] = useState<CommitsGrouped>({})
  const [showDropdown, setShowDropdown] = useState(false)
  const [search, setSearch] = useState("")
  const [branches, setBranches] = useState<string[]>([])
  const [copiedSha, setCopiedSha] = useState<string | null>(null)
  const [loadingBranches, setLoadingBranches] = useState(true)
  const [loadingCommits, setLoadingCommits] = useState(false)

  useEffect(() => {
    const fetchBranches = async () => {
      setLoadingBranches(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await axios.get(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/branches`, {
          params: { repo: repoFullName },
          headers: { Authorization: `Bearer ${token}` },
        })

        const { branches, default_branch } = res.data
        setBranches(branches)
        setBranch(default_branch)
        setLoadingBranches(false)
      } catch (err) {
        console.error("❌ Error fetching branches:", err)
        setBranches(["main"])
        setBranch("main")
        setLoadingBranches(false)
      }
    }

    if (repoFullName) fetchBranches()
  }, [repoFullName])

  useEffect(() => {
    const fetchCommits = async () => {
      setLoadingCommits(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("❌ No token found in localStorage")
          setLoadingCommits(false)
          return
        }

        const res = await axios.get(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/commits`, {
          params: {
            repo: repoFullName,
            branch: branch,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setCommitsGrouped(res.data)
        setLoadingCommits(false)
      } catch (error) {
        console.error("❌ Error fetching commits:", error)
        setLoadingCommits(false)
      }
    }

    if (repoFullName && branch) fetchCommits()
  }, [repoFullName, branch])

  return (
    <div className="px-8 py-8 text-white max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Commits</h1>
      </div>

      <div className="mb-8">
        <div className="relative inline-block">
          <button
            disabled={loadingBranches}
            onClick={() => setShowDropdown(!showDropdown)}
            className={`text-sm px-4 py-3 rounded-lg border flex items-center gap-3 min-w-[200px] justify-between transition-all duration-200
              ${loadingBranches ? "opacity-50 cursor-not-allowed" : "hover:bg-[#21262d] hover:border-red-500/50"}
              bg-[#1c2128] border-[#30363d] shadow-lg`}
          >
            <div className="flex items-center gap-2">
              <GitBranch size={16} className="text-red-400" />
              {loadingBranches ? (
                <span className="flex items-center gap-2">
                  <Loader size={14} className="animate-spin" />
                  Loading branches...
                </span>
              ) : (
                <span className="font-medium">{branch || "Select branch"}</span>
              )}
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {showDropdown && !loadingBranches && (
            <div className="absolute z-50 mt-2 w-80 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl overflow-hidden">
              <div className="p-3 border-b border-[#30363d]">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find a branch..."
                  className="bg-[#0d1117] text-white px-3 py-2 w-full text-sm rounded-md border border-[#30363d] outline-none focus:border-red-500/50 transition-colors"
                />
              </div>
              <div className="text-xs uppercase text-gray-400 px-3 pt-3 pb-2 font-semibold">Branches</div>
              <ul className="max-h-60 overflow-y-auto">
                {(branches || [])
                  .filter((b) => b.toLowerCase().includes(search.toLowerCase()))
                  .map((b) => (
                    <li
                      key={b}
                      onClick={() => {
                        setBranch(b)
                        setShowDropdown(false)
                        setSearch("")
                      }}
                      className={`px-3 py-2.5 text-sm text-white hover:bg-[#21262d] cursor-pointer flex justify-between items-center transition-colors ${
                        b === branch ? "bg-[#0d1117] font-semibold border-r-2 border-red-500" : ""
                      }`}
                    >
                      <span>{b}</span>
                      {b === "main" && (
                        <span className="text-[10px] bg-red-600/20 text-red-300 px-2 py-0.5 rounded-full border border-red-600/30">
                          default
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {loadingCommits ? (
          <>
            <DateGroupSkeleton />
            <DateGroupSkeleton />
          </>
        ) : Object.keys(commitsGrouped).length > 0 ? (
          Object.entries(commitsGrouped).map(([date, commits]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-300 font-semibold bg-[#161b22] px-4 py-2 rounded-lg border border-[#30363d]">
                <GitCommitHorizontal size={16} className="text-red-400" />
                <span>Commits on {date}</span>
                <span className="text-xs bg-[#21262d] px-2 py-1 rounded-full text-gray-400">{commits.length}</span>
              </div>

              <div className="border-l-2 border-red-500/30 pl-6 space-y-4 relative">
                {commits.map((commit, index) => (
                  <div
                    key={index}
                    className="group bg-[#0d1117] p-6 rounded-lg border border-[#30363d] hover:border-[#40464d] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1 min-w-0 space-y-3">
                        <Link
                          to={`/repos/${encodeURIComponent(repoFullName!)}/commits/${commit.hash}/feedback`}
                          className="text-white font-semibold text-base leading-tight hover:text-red-400 transition-colors duration-200 cursor-pointer block group-hover:underline"
                        >
                          {commit.message.includes("http") ? (
                            <>
                              {commit.message.split("http")[0]}
                              <a
                                href={`http${commit.message.split("http")[1]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-400 underline hover:text-red-300"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {`http${commit.message.split("http")[1]}`}
                              </a>
                            </>
                          ) : (
                            commit.message
                          )}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="text-red-300 font-medium">{commit.author}</span>
                          <span>committed</span>
                          <span>{commit.date}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <div className="flex items-center gap-2">{getRetroBadge(commit.status)}</div>
                        <div className="flex items-center gap-3 text-xs">
                          {commit.verified && (
                            <span className="bg-green-600/20 text-green-300 text-xs px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1.5 border border-green-600/30">
                              <CheckCircle size={12} strokeWidth={2.5} />
                              Verified
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/repos/${encodeURIComponent(repoFullName)}/commits/${commit.hash}/feedback`}
                              className="text-gray-300 text-xs px-3 py-1.5 rounded-md hover:bg-[#30363d] transition-colors font-mono bg-[#21262d] border border-[#30363d]"
                            >
                              {commit.hash.slice(0, 7)}
                            </Link>

                            <button
                              onClick={async () => {
                                await navigator.clipboard.writeText(commit.hash)
                                setCopiedSha(commit.hash)
                                setTimeout(() => setCopiedSha(null), 2000)
                              }}
                              className="text-gray-400 hover:text-white transition-colors relative group p-2 rounded-md hover:bg-[#21262d]"
                            >
                              {copiedSha === commit.hash ? (
                                <Check size={16} className="text-green-400" />
                              ) : (
                                <Copy size={16} />
                              )}

                              <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                                Copy full SHA for {commit.hash.slice(0, 7)}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg px-8 py-12 text-center shadow-xl">
            <div className="mb-4">
              <GitCommitHorizontal size={48} className="mx-auto text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium mb-2">No commits found</p>
            <p className="text-gray-500 text-sm">There are no commits in the selected branch.</p>
          </div>
        )}
      </div>
    </div>
  )
}
