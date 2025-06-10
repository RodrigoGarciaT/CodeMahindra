"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { FolderGit2, ChevronRight, Search, Star, GitFork, Calendar, Code, Lock, Globe, RefreshCw } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import GitHubLinkButton from "@/components/GitHubLinkButton"

// Componentes UI básicos con tema GitHub + rojo
const Card = ({
  children,
  className = "",
  ...props
}: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`bg-[#0d1117] border border-[#30363d] rounded-lg ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pb-3 ${className}`}>{children}</div>
)

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
)

const CardDescription = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-[#8b949e] ${className}`}>{children}</p>
)

const Input = ({ className = "", ...props }: { className?: string; [key: string]: any }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] placeholder:text-[#7d8590] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  ...props
}: {
  children: React.ReactNode
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  disabled?: boolean
  [key: string]: any
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#0d1117] disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    default: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-[#30363d] text-[#f0f6fc] hover:bg-[#21262d] hover:border-[#8b949e]",
    ghost: "text-[#f0f6fc] hover:bg-[#21262d]",
  }

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode
  variant?: "default" | "secondary" | "outline"
  className?: string
}) => {
  const variants = {
    default: "bg-red-600 text-white",
    secondary: "bg-[#21262d] text-[#f0f6fc]",
    outline: "border border-[#30363d] text-[#8b949e]",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  )
}

const Select = ({
  children,
  value,
  onValueChange,
  className = "",
}: {
  children: React.ReactNode
  value: string
  onValueChange: (value: string) => void
  className?: string
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`flex h-10 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${className}`}
  >
    {children}
  </select>
)

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-[#21262d] ${className}`} />
)

type Repo = {
  id: number
  full_name: string
  description: string
  language: string
  updated_at: string
  visibility: string
  stargazers_count?: number
  forks_count?: number
  watchers_count?: number
  size?: number
  default_branch?: string
  topics?: string[]
}

export default function ReposListPage() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [githubLinked, setGithubLinked] = useState<boolean | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [languageFilter, setLanguageFilter] = useState("all")
  const [visibilityFilter, setVisibilityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updated")
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(null)

  // Verifica si GitHub está vinculado y carga los repos
  const checkGithubLink = async (token: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      const isLinked = !!data.github_username && !!data.github_token
      setGithubLinked(isLinked)
      return isLinked
    } catch (err) {
      console.error("Error checking GitHub link:", err)
      return false
    }
  }

  // Obtiene los repositorios de GitHub
  const fetchRepos = async (token: string) => {
    try {
      setLoading(true)
      const res = await fetch(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/repos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data: Repo[] = await res.json()
      setRepos(data)
      setFilteredRepos(data)
      setError("")
    } catch (err) {
      setError("Failed to fetch repositories")
    } finally {
      setLoading(false)
    }
  }

  // Efecto principal: verifica autenticación y carga datos
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      navigate("/")
      return
    }

    setToken(storedToken)
    const init = async () => {
      const isLinked = await checkGithubLink(storedToken)
      if (isLinked) await fetchRepos(storedToken)
      else setLoading(false)
    }

    init()

    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.get("linked") === "true") {
      setGithubLinked(true)
      fetchRepos(storedToken)
    }
  }, [navigate])

  // Filtrar y ordenar repositorios
  useEffect(() => {
    let filtered = [...repos]

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (repo) =>
          repo.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          repo.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por lenguaje
    if (languageFilter !== "all") {
      filtered = filtered.filter((repo) => repo.language === languageFilter)
    }

    // Filtrar por visibilidad
    if (visibilityFilter !== "all") {
      filtered = filtered.filter((repo) => repo.visibility === visibilityFilter)
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.full_name.localeCompare(b.full_name)
        case "stars":
          return (b.stargazers_count || 0) - (a.stargazers_count || 0)
        case "updated":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })

    setFilteredRepos(filtered)
  }, [searchTerm, languageFilter, visibilityFilter, sortBy, repos])

  // Obtener lenguajes únicos
  const uniqueLanguages = Array.from(new Set(repos.map((repo) => repo.language).filter(Boolean)))

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
    return `${Math.ceil(diffDays / 365)} years ago`
  }

  // Componente de carga
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Search and filters skeleton */}
      <div className="flex flex-col lg:flex-row gap-4">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-12 w-40" />
      </div>
      {/* Repository cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 flex-1" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  // Si no está vinculado, muestra el modal de GitHub
  if (githubLinked === false) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center border-[#30363d]">
          <div className="mb-6">
            <FolderGit2 className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">Connect GitHub</h2>
            <p className="text-[#8b949e]">Link your GitHub account to view and manage your repositories</p>
          </div>
          {token && (
            <div className="mt-6 flex justify-center">
              <GitHubLinkButton
                redirectUrl={`${import.meta.env.VITE_BACKEND_URL}/auth/github?state=link_account|${token}`}
              />
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#010409] text-[#f0f6fc]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FolderGit2 className="h-10 w-10 text-red-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">
              Repositories
            </h1>
          </div>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto">
            Dive into intelligent analysis of your repositories
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Card className="max-w-md mx-auto p-8 text-center border-red-800 bg-red-900/10">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-300 mb-3">Oops! Something went wrong</h3>
            <p className="text-red-200 mb-6">{error}</p>
            <Button
              onClick={() => token && fetchRepos(token)}
              variant="outline"
              className="border-red-600 text-red-300 hover:bg-red-900/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </Card>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-[#161b22] backdrop-blur-sm rounded-lg p-6 mb-8 border border-[#30363d]">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7d8590] h-5 w-5" />
                  <Input
                    placeholder="Search repositories by name or description..."
                    value={searchTerm}
                    onChange={(e : any) => setSearchTerm(e.target.value)}
                    className="pl-11 h-12 text-base"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={languageFilter} onValueChange={setLanguageFilter}>
                    <option value="all">All Languages</option>
                    {uniqueLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </Select>
                  <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                    <option value="all">All Repos</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <option value="updated">Recently Updated</option>
                    <option value="name">Name</option>
                    <option value="stars">Most Stars</option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Repository Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="text-[#8b949e]">
                <span className="text-2xl font-bold text-[#f0f6fc]">{filteredRepos.length}</span>
                <span className="ml-2">{filteredRepos.length === 1 ? "repository" : "repositories"}</span>
                {repos.length !== filteredRepos.length && (
                  <span className="text-[#7d8590] ml-1">(filtered from {repos.length})</span>
                )}
              </div>
              {searchTerm && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm("")
                    setLanguageFilter("all")
                    setVisibilityFilter("all")
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/10"
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Repository Grid */}
            {filteredRepos.length === 0 ? (
              <Card className="max-w-md mx-auto p-12 text-center">
                <Search className="h-16 w-16 text-[#7d8590] mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-[#f0f6fc] mb-3">No repositories found</h3>
                <p className="text-[#8b949e] mb-6">
                  {searchTerm || languageFilter !== "all" || visibilityFilter !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "You don't have any repositories yet"}
                </p>
                {(searchTerm || languageFilter !== "all" || visibilityFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setLanguageFilter("all")
                      setVisibilityFilter("all")
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRepos.map((repo) => (
                  <Link
                    key={repo.id}
                    to={`/repos/${encodeURIComponent(repo.full_name)}/Dashboard`}
                    className="group block"
                  >
                    <Card className="h-full hover:bg-[#161b22] hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <FolderGit2 className="text-red-500 h-6 w-6 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-[#f0f6fc] group-hover:text-red-400 transition-colors truncate text-base">
                                {repo.full_name.split("/")[1] || repo.full_name}
                              </CardTitle>
                              <div className="text-xs text-[#7d8590] truncate">{repo.full_name.split("/")[0]}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {repo.visibility === "private" ? (
                              <Lock className="h-4 w-4 text-amber-400" />
                            ) : (
                              <Globe className="h-4 w-4 text-green-400" />
                            )}
                            <ChevronRight className="h-5 w-5 text-[#7d8590] group-hover:text-[#f0f6fc] group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                          {repo.description || "No description available"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Stats */}
                          {(repo.stargazers_count !== undefined || repo.forks_count !== undefined) && (
                            <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                              {repo.stargazers_count !== undefined && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4" />
                                  <span>{repo.stargazers_count.toLocaleString()}</span>
                                </div>
                              )}
                              {repo.forks_count !== undefined && (
                                <div className="flex items-center gap-1">
                                  <GitFork className="h-4 w-4" />
                                  <span>{repo.forks_count.toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Language and Topics */}
                          <div className="flex flex-wrap gap-2">
                            {repo.language && (
                              <Badge variant="secondary" className="text-xs">
                                <Code className="h-3 w-3 mr-1" />
                                {repo.language}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {repo.visibility === "private" ? "Private" : "Public"}
                            </Badge>
                            {repo.topics?.slice(0, 1).map((topic) => (
                              <Badge key={topic} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>

                          {/* Updated date */}
                          <div className="flex items-center gap-2 text-xs text-[#7d8590] pt-2 border-t border-[#30363d]">
                            <Calendar className="h-3 w-3" />
                            <span>Updated {formatDate(repo.updated_at)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
