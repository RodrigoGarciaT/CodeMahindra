"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CountryName from "../Home/CountryName" // ajusta la ruta según tu estructura

import {
  Bot,
  Star,
  ChevronRight,
  Users,
  Database,
  SquareStackIcon as Stack,
  Link2,
  TreesIcon as Tree,
  FileSearch,
  Package,
  Share2,
  MousePointer2,
  Search,
  Layout,
  Clock,
  GitCompare,
  Workflow,
  BrainCircuit,
  LineChart,
  Binary,
  Calculator,
  ArrowLeft,
} from "lucide-react"
import type { Bot as BotType } from "./BotStore"
import { useTeamMembers } from "@/hooks/useTeamMembers"

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

const staticAchievements: Achievement[] = [
  {
    id: "1",
    name: "Maestro/a del Acceso Rápido",
    category: "Estructuras de Datos Fundamentales",
    topic: "Arrays y Hashing",
    description:
      "Demuestra dominio en el uso eficiente de arrays y tablas hash para almacenar y recuperar datos velozmente.",
    icon: <Database className="w-8 h-8" />,
  },
  {
    id: "2",
    name: "Dominador/a LIFO",
    category: "Estructuras de Datos Fundamentales",
    topic: "Stack (Pila)",
    description: "Utiliza pilas correctamente para resolver problemas de lógica LIFO (Last-In, First-Out).",
    icon: <Stack className="w-8 h-8" />,
  },
  {
    id: "3",
    name: "Navegante de Nodos",
    category: "Estructuras de Datos Fundamentales",
    topic: "Linked List",
    description: "Domina la manipulación y recorrido de listas enlazadas.",
    icon: <Link2 className="w-8 h-8" />,
  },
  {
    id: "4",
    name: "Arquitecto/a Arbóreo/a",
    category: "Estructuras de Datos Fundamentales",
    topic: "Trees",
    description: "Comprende y aplica conceptos de árboles, como recorridos (BFS, DFS) y búsquedas (BST).",
    icon: <Tree className="w-8 h-8" />,
  },
  {
    id: "5",
    name: "Lexicógrafo/a Digital",
    category: "Estructuras de Datos Fundamentales",
    topic: "Tries",
    description: "Implementa o utiliza Tries para resolver problemas de búsqueda de cadenas y prefijos.",
    icon: <FileSearch className="w-8 h-8" />,
  },
  {
    id: "6",
    name: "Guardián/a de la Prioridad",
    category: "Estructuras de Datos Fundamentales",
    topic: "Heap / Priority Queue",
    description: "Aplica montículos o colas de prioridad para gestionar elementos ordenados eficientemente.",
    icon: <Package className="w-8 h-8" />,
  },
  {
    id: "7",
    name: "Cartógrafo/a Conectado/a",
    category: "Estructuras de Datos Fundamentales",
    topic: "Graphs",
    description: "Modela problemas y aplica algoritmos básicos (BFS, DFS) en estructuras de grafos.",
    icon: <Share2 className="w-8 h-8" />,
  },
  {
    id: "8",
    name: "Estratega de Punteros",
    category: "Técnicas y Estrategias Algorítmicas",
    topic: "Two Pointers",
    description: "Optimiza soluciones utilizando la técnica de dos punteros en secuencias.",
    icon: <MousePointer2 className="w-8 h-8" />,
  },
  {
    id: "9",
    name: "¡Eureka Ordenado!",
    category: "Técnicas y Estrategias Algorítmicas",
    topic: "Binary Search",
    description:
      "Implementa y aplica búsqueda binaria para encontrar elementos en espacios ordenados de forma eficiente.",
    icon: <Search className="w-8 h-8" />,
  },
  {
    id: "10",
    name: "Optimizador/a de Ventanas",
    category: "Técnicas y Estrategias Algorítmicas",
    topic: "Sliding Window",
    description: "Resuelve problemas eficientemente procesando subsegmentos con la técnica de ventana deslizante.",
    icon: <Layout className="w-8 h-8" />,
  },
  {
    id: "11",
    name: "Maestro/a de Intervalos",
    category: "Técnicas y Estrategias Algorítmicas",
    topic: "Intervals",
    description: "Domina la lógica para resolver problemas de fusión, solapamiento y gestión de intervalos.",
    icon: <Clock className="w-8 h-8" />,
  },
  {
    id: "12",
    name: "Decisor/a Óptimo Local",
    category: "Técnicas y Estrategias Algorítmicas",
    topic: "Greedy",
    description: "Diseña y aplica algoritmos greedy para encontrar soluciones óptimas (o aproximadas) paso a paso.",
    icon: <GitCompare className="w-8 h-8" />,
  },
  {
    id: "13",
    name: "Explorador/a Exhaustivo/a",
    category: "Técnicas y Estrategias Algorítmicas",
    topic: "Backtracking",
    description:
      "Utiliza backtracking para explorar sistemáticamente todas las posibles soluciones a un problema complejo.",
    icon: <Workflow className="w-8 h-8" />,
  },
  {
    id: "14",
    name: "Constructor/a de Soluciones Lineales",
    category: "Programación Dinámica (DP)",
    topic: "1-D DP",
    description: "Resuelve problemas aplicando programación dinámica con estados que dependen de una sola variable.",
    icon: <BrainCircuit className="w-8 h-8" />,
  },
  {
    id: "15",
    name: "Tejedor/a de Estados",
    category: "Programación Dinámica (DP)",
    topic: "2-D DP",
    description: "Domina la programación dinámica en problemas cuyos estados dependen de dos o más variables (tablas).",
    icon: <LineChart className="w-8 h-8" />,
  },
  {
    id: "16",
    name: "Gurú de Grafos",
    category: "Tópicos Avanzados y Especializados",
    topic: "Advanced Graphs",
    description:
      "Aplica algoritmos avanzados como Dijkstra, Floyd-Warshall, flujo máximo, etc., para resolver problemas complejos de grafos.",
    icon: <Share2 className="w-8 h-8" />,
  },
  {
    id: "17",
    name: "Mago/a Binario/a",
    category: "Tópicos Avanzados y Especializados",
    topic: "Bit Manipulation",
    description:
      "Utiliza operaciones a nivel de bit para crear soluciones eficientes o resolver problemas específicos.",
    icon: <Binary className="w-8 h-8" />,
  },
  {
    id: "18",
    name: "Geómetra Algorítmico/a",
    category: "Tópicos Avanzados y Especializados",
    topic: "Math y Geometry",
    description: "Resuelve problemas aplicando conceptos y algoritmos matemáticos o geométricos.",
    icon: <Calculator className="w-8 h-8" />,
  },
]

function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    photo: "",
    firstName: "",
    lastName: "",
    experience: 0,
    nationality: "",
    profilePicture: "",
    team_id: null,
  })

  // Estados para logros dinámicos
  const [earnedAchievements, setEarnedAchievements] = useState<Achievement[]>([])
  const [unearnedAchievements, setUnearnedAchievements] = useState<Achievement[]>([])

  const [equippedBot, setEquippedBot] = useState<BotType | null>(null)
  const [fetchedTeamName, setFetchedTeamName] = useState<string>("")
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [purchasedBot, setPurchasedBot] = useState<BotType | null>(() => {
    const saved = localStorage.getItem("purchasedBots")
    if (saved) {
      const bots = JSON.parse(saved)
      return bots.length > 0 ? bots[0] : null
    }
    return null
  })

  // Always call useTeamMembers hook, even if team_id is null
  const { members, loading } = useTeamMembers(user?.team_id || "")

  // Fetch de logros dinámicos
  useEffect(() => {
    const userId = localStorage.getItem("user_id")
    if (!userId) return

    fetch(`${import.meta.env.VITE_BACKEND_URL}/achievements/status/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setEarnedAchievements(data.earned || [])
        setUnearnedAchievements(data.unearned || [])
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

  // Combinar logros ganados y no ganados
  const allAchievements = [
    ...earnedAchievements.map((a) => ({ ...a, earned: true })),
    ...unearnedAchievements.map((a) => ({ ...a, earned: false })),
  ]

  const allAchievementsByCategory = allAchievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = []
      }
      acc[achievement.category].push(achievement)
      return acc
    },
    {} as Record<string, (Achievement & { earned?: boolean })[]>,
  )

  // Calcular estadísticas de logros
  const totalAchievements = allAchievements.length
  const earnedCount = allAchievements.filter((a) => a.earned).length
  const achievementProgress = totalAchievements > 0 ? (earnedCount / totalAchievements) * 100 : 0

  // Obtener logros recientes (últimos 3 ganados)
  const recentAchievements = allAchievements.filter((a) => a.earned).slice(-3)

  const renderAchievement = (achievement: Achievement & { earned?: boolean }, showCategory = false) => (
    <div
      key={achievement.id}
      className={`relative group transition-all duration-300 ${!achievement.earned ? "opacity-50" : "hover:scale-105"}`}
      onMouseEnter={() => setSelectedAchievement(achievement)}
      onMouseLeave={() => setSelectedAchievement(null)}
    >
      <div
        className={`
        relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300
        ${
          achievement.earned
            ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-md hover:shadow-lg"
            : "bg-gray-50 border-2 border-gray-200 grayscale"
        }
      `}
      >
        {achievement.earned && (
          <div className="absolute top-2 right-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </div>
        )}

        <div className="flex flex-col items-center text-center space-y-2">
          <div
            className={`
            p-3 rounded-full transition-colors duration-300
            ${
              achievement.earned
                ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg"
                : "bg-gray-300 text-gray-500"
            }
          `}
          >
            {achievement.icon}
          </div>

          <div>
            <h3 className={`text-sm font-semibold ${achievement.earned ? "text-gray-800" : "text-gray-500"}`}>
              {achievement.name}
            </h3>
            {showCategory && <p className="text-xs text-gray-500 mt-1">{achievement.topic}</p>}
          </div>
        </div>

        {achievement.earned && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 ease-out" />
        )}
      </div>

      {selectedAchievement?.id === achievement.id && (
        <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div
              className={`
              p-2 rounded-lg flex-shrink-0
              ${achievement.earned ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}
            `}
            >
              {achievement.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">{achievement.name}</h3>
              <p className="text-xs text-red-600 font-medium mb-2">{achievement.topic}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{achievement.description}</p>
              {achievement.earned && (
                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-medium">¡Completado!</span>
                </div>
              )}
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
        </div>
      )}
    </div>
  )

  if (showAllAchievements) {
    return (
      <div className="min-h-screen bg-[#363B41] text-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setShowAllAchievements(false)}
              className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver</span>
            </button>

            <div className="bg-white rounded-lg px-6 py-3 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{earnedCount}</div>
                  <div className="text-xs text-gray-500">Completados</div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">{totalAchievements - earnedCount}</div>
                  <div className="text-xs text-gray-500">Pendientes</div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(achievementProgress)}%</div>
                  <div className="text-xs text-gray-500">Progreso</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(allAchievementsByCategory).map(([category, categoryAchievements]) => {
              const categoryEarned = categoryAchievements.filter((a) => a.earned).length
              const categoryTotal = categoryAchievements.length
              const categoryProgress = categoryTotal > 0 ? (categoryEarned / categoryTotal) * 100 : 0

              return (
                <div key={category} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{category}</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {categoryEarned} de {categoryTotal} logros completados
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{Math.round(categoryProgress)}%</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${categoryProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {categoryAchievements.map((achievement) => renderAchievement(achievement, true))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const totalExp = members.reduce((sum, m) => sum + (m.experience ?? 0), 0)
  const teamLevel = Math.floor(totalExp / 2000)
  const teamName = fetchedTeamName || (members.length > 0 ? `Equipo de ${members[0].firstName}` : "Tu equipo")

  return (
    <div className="min-h-screen bg-[#363B41] text-black p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Perfil</h2>
            <button className="text-red-500 hover:text-red-600" onClick={() => navigate("/profile")}>
              Ver más
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-4">
              {user?.profilePicture ? (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600">
                    {user?.firstName?.charAt(0) || ""}
                    {user?.lastName?.charAt(0) || ""}
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </span>
                  {user?.nationality ? (
                    <CountryName code={user.nationality} />
                  ) : (
                    <span className="text-sm text-gray-500">Nacionalidad no disponible</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Progreso</h3>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Nivel {Math.floor((user?.experience ?? 0) / 1000)}</span>
                <span>{user?.experience ?? 0} XP</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${((user?.experience ?? 0) % 1000) / 10}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Challenges Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Desafíos Semanales</h2>
          <div className="space-y-4">
            <button
              className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg flex justify-between items-center"
              onClick={() => navigate("/tasks")}
            >
              <span>Completar tareas</span>
              <ChevronRight />
            </button>
            <button
              className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg flex justify-between items-center"
              onClick={() => navigate("/problems")}
            >
              <span>Resolver problema</span>
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Bot Section */}
        <div
          className="bg-white rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/bot-store")}
        >
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">
              {equippedBot ? equippedBot.name : purchasedBot ? purchasedBot.name : "Bot Mahindra"}
            </h2>

            {equippedBot ? (
              <div>
                <img
                  src={equippedBot.image || "/placeholder.svg"}
                  alt={equippedBot.name}
                  className="w-32 h-32 mx-auto object-cover rounded-lg mb-4"
                />
                <div className="bg-gray-100 p-2 rounded text-sm mb-2">{equippedBot.description}</div>
                <div className="text-xs text-green-600 font-medium">EQUIPADO</div>
              </div>
            ) : purchasedBot ? (
              <div>
                <img
                  src={purchasedBot.image || "/placeholder.svg"}
                  alt={purchasedBot.name}
                  className="w-32 h-32 mx-auto object-cover rounded-lg mb-4"
                />
                <div className="bg-gray-100 p-2 rounded text-sm mb-2">{purchasedBot.description}</div>
                <div className="text-xs text-gray-500">No equipado</div>
              </div>
            ) : (
              <Bot className="w-32 h-32 mx-auto text-gray-400" />
            )}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Equipo</h2>
            {user?.team_id && (
              <button className="text-red-500 hover:text-red-600" onClick={() => navigate(`/team/${user.team_id}`)}>
                Ver más
              </button>
            )}
          </div>

          {!user?.team_id ? (
            <div className="text-center bg-gray-50 rounded-lg p-6">
              <p className="text-lg font-semibold mb-4 text-gray-700">Aún no perteneces a un equipo.</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => navigate("/teams/create")}
                >
                  Crear equipo
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => navigate("/teams/join")}
                >
                  Unirse a un equipo
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4" />
                  {teamName || "Equipo"}
                </h3>
                <div className="flex justify-between text-xs mb-1">
                  <span>Nivel {Math.floor((totalExp ?? 0) / 1000)}</span>
                  <span>{totalExp ?? 0} exp</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${((totalExp ?? 0) % 1000) / 10}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-1/3">
                      <img
                        src={member.profilePicture || "https://via.placeholder.com/40"}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium">
                        {member.firstName} {member.lastName}
                      </span>
                    </div>

                    <div className="w-1/4 text-sm text-gray-500">
                      <CountryName code={member.nationality ?? ""} />
                    </div>

                    <div className="w-1/6 flex items-center gap-1 justify-center">
                      <span className="font-medium">Nivel {Math.floor((member.experience ?? 0) / 1000)}</span>
                    </div>

                    <div className="w-1/6 text-right text-gray-500">{member.experience ?? 0} exp</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Logros e insignias</h2>
              <p className="text-sm text-gray-500 mt-1">
                {earnedCount} de {totalAchievements} completados ({Math.round(achievementProgress)}%)
              </p>
            </div>
            <button
              onClick={() => setShowAllAchievements(true)}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Ver todos
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${achievementProgress}%` }}
              />
            </div>
          </div>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Logros recientes
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {recentAchievements.map((achievement) => renderAchievement(achievement))}
              </div>
            </div>
          )}

          {/* Achievement Preview Grid */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Próximos objetivos</h3>
            <div className="grid grid-cols-3 gap-3">
              {allAchievements
                .filter((a) => !a.earned)
                .slice(0, 3)
                .map((achievement) => renderAchievement(achievement))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
