"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Trash2,
  GraduationCap,
  Search,
  RotateCcw,
  Code,
  Calendar,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  MoreVertical,
} from "lucide-react"
import axios from "axios"
import Toast from "@/components/Toast"

interface ProblemManage {
  id: string
  difficulty: string
  name: string
  expirationDate: string
  wasGraded: boolean
}

interface ProblemCardProps {
  problem: ProblemManage
  onDelete: (id: string) => void
  onGrade: (id: string) => void
  onActivate: (id: string) => void
  onViewProblem: (id: string) => void
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onDelete, onGrade, onActivate, onViewProblem }) => {
  const [showActions, setShowActions] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
      case "medium":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200"
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200"
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "🟢"
      case "medium":
        return "🟡"
      case "hard":
        return "🔴"
      default:
        return "⚪"
    }
  }

  const isExpired = new Date(problem.expirationDate) < new Date()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3
              className="text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2 leading-tight"
              onClick={() => onViewProblem(problem.id)}
            >
              {problem.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(problem.difficulty)}`}
              >
                <span>{getDifficultyIcon(problem.difficulty)}</span>
                {problem.difficulty}
              </span>
            </div>
          </div>

          {/* Actions dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20">
                <button
                  onClick={() => {
                    onViewProblem(problem.id)
                    setShowActions(false)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-blue-600"
                >
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">View Problem</span>
                </button>
                {!problem.wasGraded && (
                  <button
                    onClick={() => {
                      onGrade(problem.id)
                      setShowActions(false)
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-purple-600"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">Grade Problem</span>
                  </button>
                )}
                {problem.wasGraded && (
                  <button
                    onClick={() => {
                      onActivate(problem.id)
                      setShowActions(false)
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-green-600"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="font-medium">Reactivate</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onDelete(problem.id)
                    setShowActions(false)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-medium">Delete Problem</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expiration date */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={`text-sm ${isExpired ? "text-red-600 font-semibold" : "text-gray-600"}`}>
            {isExpired ? "Expired: " : "Expires: "}
            {new Date(problem.expirationDate).toLocaleDateString()}
          </span>
        </div>

        {/* Status and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${
                !problem.wasGraded
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                  : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200"
              }`}
            >
              {!problem.wasGraded ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {!problem.wasGraded ? "Active" : "Inactive"}
            </div>
            {isExpired && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                <Clock className="w-3 h-3" />
                Expired
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onViewProblem(problem.id)}
              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all duration-200 text-blue-600"
              title="View problem"
            >
              <Eye className="w-4 h-4" />
            </button>
            {!problem.wasGraded && (
              <button
                onClick={() => onGrade(problem.id)}
                className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-all duration-200 text-purple-600"
                title="Grade problem"
              >
                <GraduationCap className="w-4 h-4" />
              </button>
            )}
            {problem.wasGraded && (
              <button
                onClick={() => onActivate(problem.id)}
                className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-all duration-200 text-green-600"
                title="Reactivate problem"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(problem.id)}
              className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-all duration-200 text-red-600"
              title="Delete problem"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close actions */}
      {showActions && <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)}></div>}
    </div>
  )
}

const ManageProblems: React.FC = () => {
  const navigate = useNavigate()
  const [problems, setProblems] = useState<ProblemManage[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const [toast, setToast] = useState<{ show: boolean; success: boolean; msg: string }>({
    show: false,
    success: true,
    msg: "",
  })

  const showToast = (success: boolean, msg: string) => {
    setToast({ show: true, success, msg })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500)
  }

  const fetchProblems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problems/`)
      const fetchedProblems = response.data.map((problem: any) => ({
        id: problem.id,
        name: problem.name,
        difficulty: problem.difficulty,
        expirationDate: problem.expirationDate,
        wasGraded: problem.was_graded,
      }))
      setProblems(fetchedProblems)
    } catch (err) {
      console.error("❌ Error loading problems:", err)
    }
  }

  useEffect(() => {
    fetchProblems()
  }, [])

  const handleDeleteProblem = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/problems/${id}`)
      setProblems(problems.filter((problem) => problem.id !== id))
      showToast(true, "Problem deleted successfully!")
    } catch (error) {
      console.error("Delete failed:", error)
      showToast(false, "Failed to delete the problem.")
    }
  }

  const handleGradeProblem = async (id: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/problems/${id}/grade`)
      setProblems(problems.map((problem) => (problem.id === id ? { ...problem, wasGraded: true } : problem)))
      showToast(true, "Problem graded successfully!")
    } catch (error) {
      console.error("Grading failed:", error)
      showToast(false, "Failed to grade the problem.")
    }
  }

  const handleViewProblem = (id: string) => {
    navigate(`/problemList/problem/${id}`, { state: { problemId: id } })
  }

  const handleActivateProblem = async (id: string) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/problems/${id}`, {
        was_graded: false,
      })
      setProblems(problems.map((problem) => (problem.id === id ? { ...problem, wasGraded: false } : problem)))
      showToast(true, "Problem reactivated!")
    } catch (error) {
      console.error("Activation failed:", error)
      showToast(false, "Failed to reactivate the problem.")
    }
  }

  const filteredProblems = problems
    .filter((problem) => {
      if (filter === "active") return !problem.wasGraded
      if (filter === "inactive") return problem.wasGraded
      return true
    })
    .filter((problem) => problem.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const activeCount = problems.filter((problem) => !problem.wasGraded).length
  const inactiveCount = problems.filter((problem) => problem.wasGraded).length
  const expiredCount = problems.filter((problem) => new Date(problem.expirationDate) < new Date()).length

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Problem Management</h1>
              <p className="text-slate-400">Manage coding challenges and assignments</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Problems</p>
                  <p className="text-3xl font-bold text-gray-900">{problems.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Problems</p>
                  <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Inactive Problems</p>
                  <p className="text-3xl font-bold text-gray-900">{inactiveCount}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Expired Problems</p>
                  <p className="text-3xl font-bold text-gray-900">{expiredCount}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Problems</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by problem name..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="lg:w-64">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none bg-white"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as "all" | "active" | "inactive")}
                  >
                    <option value="all">All Problems</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results summary */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredProblems.length} of {problems.length} problems
              </span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  Search: "{searchTerm}"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        {filteredProblems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No problems found</h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search criteria or filters."
                : "No problems match the selected criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onDelete={handleDeleteProblem}
                onGrade={handleGradeProblem}
                onActivate={handleActivateProblem}
                onViewProblem={handleViewProblem}
              />
            ))}
          </div>
        )}
      </div>

      <Toast
        show={toast.show}
        success={toast.success}
        msg={toast.msg}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  )
}

export default ManageProblems
