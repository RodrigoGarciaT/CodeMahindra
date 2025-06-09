"use client"

import { Link } from "react-router-dom"
import { ArrowLeft, Edit, Mail, MapPin, Phone, Trophy, Target, Calendar, TrendingUp, Award, Star, Coins } from "lucide-react"
import { Progress } from "../components/progress"
import profilePic from "../images/robot_male_1.svg"
//import coinIcon from "../images/coin.svg"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import CountryName from "../pages/Home/CountryName"
import CalendarHeatmap from "react-calendar-heatmap"
import "react-calendar-heatmap/dist/styles.css"
import { parse, format } from "date-fns"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const formatDate = (date: Date) => date.toISOString().split("T")[0]

export default function ProfilePage() {
  //const [activeTab, setActiveTab] = useState("current")
  interface User {
    firstName: string
    lastName: string
    email: string
    nationality: string
    experience: number
    coins: number
    phoneNumber: string
    profilePicture: string
  }

  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    console.log("Token en localStorage:", token)

    if (!token) {
      console.error("No hay token en localStorage")
      return
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Usuario autenticado:", res.data)
        setUser(res.data)
      })
      .catch((err) => {
        console.error("Error al obtener el perfil", err.response?.data || err.message)
      })
  }, [])

  const [xpHistory, setXpHistory] = useState<{ date: string; experience: number }[]>([])

  useEffect(() => {
    const userId = localStorage.getItem("user_id")
    if (!userId) return

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/xp-history/employee/${userId}`)
      .then((res) => {
        const formatted = res.data.map((entry: any) => ({
          date: new Date(entry.date).toLocaleDateString(),
          experience: entry.experience,
        }))
        setXpHistory(formatted)
      })
      .catch((err) => {
        console.error("Error fetching XP history", err)
      })
  }, [])

  const [ratingHistory, setRatingHistory] = useState<string[]>([])

  useEffect(() => {
    const userId = localStorage.getItem("user_id")
    if (!userId) return

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/solutions/employee/${userId}`)
      .then((res) => {
        const sortedSolutions = res.data
          .filter((sol: any) => sol.status === "Accepted")
          .sort((a: any, b: any) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime())

        const datesOnly = sortedSolutions.map((sol: any) => new Date(sol.submissionDate).toLocaleDateString())

        setRatingHistory(datesOnly)
      })
      .catch((err) => {
        console.error("Error fetching rating history", err)
      })
  }, [])

  const [difficultyData, setDifficultyData] = useState<{ Easy: number; Medium: number; Hard: number } | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem("user_id")
    if (!userId) return
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/employees/solved-difficulty/${userId}`)
      .then((res) => {
        setDifficultyData(res.data)
      })
      .catch((err) => {
        console.error("Error fetching difficulty data", err)
      })
  }, [])

  //const chartHeightPx = 90
  console.log("this is the data: ", difficultyData)
  const allZero = difficultyData !== null && Object.values(difficultyData).every((v) => v === 0)

  const dateCounts: { [key: string]: number } = {}

  ratingHistory.forEach((dateStr) => {
    const parsedDate = parse(dateStr, "M/d/yyyy", new Date())
    const formattedDate = format(parsedDate, "yyyy-MM-dd")
    dateCounts[formattedDate] = (dateCounts[formattedDate] || 0) + 1
  })

  //const currentYear = new Date().getFullYear()

  const years = useMemo(() => {
    const yearSet = new Set(ratingHistory.map((dateStr) => new Date(dateStr).getFullYear()))
    return Array.from(yearSet).sort((a, b) => b - a)
  }, [ratingHistory])

  const [selectedYear, setSelectedYear] = useState<number>(years[0] ?? new Date().getFullYear())

  const heatmapValues = useMemo(() => {
    const counts: Record<string, number> = {}

    ratingHistory.forEach((dateStr) => {
      const date = new Date(dateStr)
      if (date.getFullYear() === selectedYear) {
        const key = formatDate(date)
        counts[key] = (counts[key] || 0) + 1
      }
    })

    return Object.entries(counts).map(([date, count]) => ({ date, count }))
  }, [ratingHistory, selectedYear])

  const startDate = `${selectedYear}-01-01`
  const endDate = `${selectedYear}-12-31`

  const currentLevel = Math.floor((user?.experience ?? 0) / 1000)
  const progressToNextLevel = ((user?.experience ?? 0) % 1000) / 10
  const totalProblems = difficultyData ? Object.values(difficultyData).reduce((a, b) => a + b, 0) : 0

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <Link to="/home" className="mr-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
            <ArrowLeft className="text-white h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-white text-3xl font-bold">Profile</h1>
            <p className="text-slate-400">Manage your account and track your progress</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Profile Header with Gradient */}
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                      <img
                        src={user?.profilePicture ?? profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{user ? `${user.firstName} ${user.lastName}` : "Loading..."}</h2>
                    <div className="flex items-center mt-2">
                      {user?.nationality ? (
                        <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                          <CountryName code={user.nationality} />
                        </div>
                      ) : (
                        <span className="text-white/80">No country specified</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coins Display */}
                <div className="mt-4 bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Coins className="h-8 w-8 mr-3 text-yellow-300" />
                      <div>
                        <p className="text-white/80 text-sm">Total Coins</p>
                        <p className="text-2xl font-bold">{user?.coins ?? 0}</p>
                      </div>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-300" />
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-6 h-6 text-yellow-500 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900">Level Progress</h3>
                  </div>
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Level {currentLevel}
                  </div>
                </div>
                <Progress
                  value={progressToNextLevel}
                  className="h-3 bg-gray-200"
                  indicatorClassName="bg-gradient-to-r from-red-500 to-rose-600"
                />
                <div className="mt-3 flex justify-between text-sm text-gray-600">
                  <span>{user?.experience ?? 0} XP</span>
                  <span>{1000 - ((user?.experience ?? 0) % 1000)} XP to next level</span>
                </div>
              </div>

              {/* Personal Information */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Edit className="w-5 h-5 mr-2 text-gray-600" />
                    Personal Information
                  </h3>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => navigate("/profile/view")}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">{user?.email ?? "Loading..."}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">{user?.phoneNumber ?? "Not provided"}</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                    {user?.nationality ? <CountryName code={user.nationality} /> : <span>Not specified</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Charts and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Problems</p>
                    <p className="text-3xl font-bold text-gray-900">{totalProblems}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Current Level</p>
                    <p className="text-3xl font-bold text-gray-900">{currentLevel}</p>
                  </div>
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-rose-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total XP</p>
                    <p className="text-3xl font-bold text-gray-900">{user?.experience ?? 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Experience Progress</h2>
                  <p className="text-gray-600 text-sm">Track your XP growth over time</p>
                </div>
              </div>
              {xpHistory && xpHistory.length > 0 ? (
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={xpHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="experience"
                        stroke="url(#gradient)"
                        strokeWidth={3}
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#dc2626" }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No experience data available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Problem Difficulty Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <Target className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Problem Difficulty Distribution</h3>
                  <p className="text-gray-600 text-sm">Problems solved by difficulty level</p>
                </div>
              </div>
              {difficultyData && !allZero ? (
                <div className="relative h-[150px] bg-gray-50 rounded-xl p-4">
                  <div className="flex items-end justify-between h-full">
                    {["Easy", "Medium", "Hard"].map((level) => {
                      const value = difficultyData[level as keyof typeof difficultyData]
                      const max = Math.max(...Object.values(difficultyData))
                      const heightPercentage = max === 0 ? 0 : (value / max) * 100

                      const barColor =
                        level === "Easy"
                          ? "bg-gradient-to-t from-green-400 to-green-500"
                          : level === "Medium"
                            ? "bg-gradient-to-t from-orange-400 to-orange-500"
                            : "bg-gradient-to-t from-red-500 to-red-600"

                      const bgColor =
                        level === "Easy"
                          ? "bg-green-100 text-green-800"
                          : level === "Medium"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"

                      return (
                        <div key={level} className="flex flex-col items-center w-[30%] group relative h-full">
                          <div className="flex flex-col items-center justify-end h-full">
                            {/* Tooltip */}
                            <div className="absolute -top-12 hidden group-hover:block px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg z-10">
                              {value} {value === 1 ? "problem" : "problems"}
                            </div>

                            {/* Bar */}
                            <div
                              className={`w-full rounded-t-lg ${barColor} transition-all duration-500 hover:scale-105 min-h-[4px]`}
                              style={{ height: `${Math.max(heightPercentage, 4)}%` }}
                            ></div>

                            {/* Label and Value */}
                            <div className="mt-3 flex flex-col items-center">
                              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${bgColor}`}>{level}</div>
                              <div className="text-lg font-bold text-gray-900 mt-1">{value}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-[150px] flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No difficulty data available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Calendar */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Activity Calendar</h2>
                    <p className="text-gray-600 text-sm">Your coding activity throughout the year</p>
                  </div>
                </div>
                <select
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-red-100 focus:border-red-500 transition-all duration-200"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto bg-gray-50 rounded-xl p-4">
                <CalendarHeatmap
                  startDate={startDate}
                  endDate={endDate}
                  values={heatmapValues}
                  classForValue={(value) => {
                    if (!value || value.count === 0) return "fill-gray-200"
                    if (value.count === 1) return "fill-red-200"
                    if (value.count === 2) return "fill-red-400"
                    return "fill-red-600"
                  }}
                  titleForValue={(value) => (value ? `${value.date}: ${value.count} submission(s)` : "No submissions")}
                />
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>Less</span>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                  <div className="w-3 h-3 bg-red-200 rounded-sm"></div>
                  <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
                  <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
