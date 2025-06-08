"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Dialog } from "@headlessui/react"
import {
  RefreshCw,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Plus,
  Calendar,
  User,
  Tag,
  Timer,
} from "lucide-react"

import { Avatar } from "@/components/avatar"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/pages/Tasks/Tooltip"
import { Input } from "@/pages/Tasks/Input"

interface Task {
  id: number
  title: string
  status: string
  priority?: string
  tag?: string
  estimatedTime?: number
  createdAt?: string
  description?: string
  sprint?: string
  labels?: string
  reporter?: string
  assignee?: {
    name: string
    avatar?: string
  }
  taskId?: string
  assignee_name?: any
  assignee_avatar?: any
}

const columns = ["To Do", "In Progress", "Code Review", "Done"]

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [jiraModalOpen, setJiraModalOpen] = useState(false)
  const [jiraEmail, setJiraEmail] = useState("")
  const [jiraToken, setJiraToken] = useState("")

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get<Task[]>(`${import.meta.env.VITE_BACKEND_URL}/tasks/`)
      const enhancedData = res.data.map((task) => {
        const normalizedStatus =
          task.status?.toLowerCase() === "in progress"
            ? "In Progress"
            : task.status?.toLowerCase() === "code review"
              ? "Code Review"
              : task.status?.toLowerCase() === "done"
                ? "Done"
                : "To Do"

        return {
          ...task,
          status: normalizedStatus,
          taskId: `TIS-${task.id}`,
          assignee: task.assignee_name
            ? {
                name: task.assignee_name,
                avatar: task.assignee_avatar || "/placeholder.svg",
              }
            : undefined,
        }
      })
      setTasks(enhancedData)
    } catch (err) {
      console.error("❌ Error loading tasks:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem("jira_email")
    const savedToken = localStorage.getItem("jira_api_token")
    if (savedEmail && savedToken) {
      setJiraEmail(savedEmail)
      setJiraToken(savedToken)
    }
    // Load tasks immediately
    fetchTasks()
  }, [])

  const groupByStatus = (status: string) => tasks.filter((task) => task.status.toLowerCase() === status.toLowerCase())

  const getTagColor = (tag?: string) => {
    if (!tag) return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300"
    const colors = [
      "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
      "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300",
      "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300",
    ]
    return colors[tag.length % colors.length]
  }

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case "Alta":
        return <ArrowUp className="text-red-500 w-4 h-4" />
      case "Media":
        return <ArrowUp className="text-amber-500 w-4 h-4" />
      case "Baja":
        return <ArrowDown className="text-emerald-500 w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return <CheckCircle className="text-emerald-500 w-4 h-4" />
      case "In Progress":
        return <Clock className="text-blue-500 w-4 h-4" />
      case "Code Review":
        return <AlertCircle className="text-purple-500 w-4 h-4" />
      default:
        return <Plus className="text-gray-400 w-4 h-4" />
    }
  }

  const getColumnColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "border-t-gray-400 bg-gradient-to-b from-gray-50 to-white"
      case "In Progress":
        return "border-t-blue-400 bg-gradient-to-b from-blue-50 to-white"
      case "Code Review":
        return "border-t-purple-400 bg-gradient-to-b from-purple-50 to-white"
      case "Done":
        return "border-t-emerald-400 bg-gradient-to-b from-emerald-50 to-white"
      default:
        return "border-t-gray-400 bg-gradient-to-b from-gray-50 to-white"
    }
  }

  const handleSubmitJira = async () => {
    if (!jiraEmail || !jiraToken) {
      alert("Please enter both Jira email and token")
      return
    }
    try {
      await axios.put("http://127.0.0.1:8000/employees/jira-auth", {
        jira_email: jiraEmail,
        jira_api_token: jiraToken,
      })
      localStorage.setItem("jira_email", jiraEmail)
      localStorage.setItem("jira_api_token", jiraToken)
      setJiraModalOpen(false)
    } catch (err) {
      alert("Error setting Jira credentials.")
    }
  }

  const handleCloseModal = () => {
    setJiraModalOpen(false)
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Modal de Jira */}
      <Dialog open={jiraModalOpen} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl relative border border-gray-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.232 4.609c0-.733.6-1.326 1.326-1.326s1.326.6 1.326 1.326v4.302c0 .733-.6 1.326-1.326 1.326s-1.326-.6-1.326-1.326V4.609zm7.51 0c0-.733.6-1.326 1.326-1.326s1.326.6 1.326 1.326v4.302c0 .733-.6 1.326-1.326 1.326s-1.326-.6-1.326-1.326V4.609z" />
                </svg>
              </div>
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-2">Connect to Jira</Dialog.Title>
              <p className="text-gray-600">Enter your credentials to sync tasks</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jira Email</label>
                <Input
                  placeholder="your-email@company.com"
                  value={jiraEmail}
                  onChange={(e) => setJiraEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Token</label>
                <Input
                  placeholder="Your Jira API Token"
                  type="password"
                  value={jiraToken}
                  onChange={(e) => setJiraToken(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleSubmitJira}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Continue
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Dashboard Principal */}
      <div className="max-w-[1600px] mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Task Management</h1>
            <p className="text-slate-400">Organize and track your team's progress</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setJiraModalOpen(true)}
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.232 4.609c0-.733.6-1.326 1.326-1.326s1.326.6 1.326 1.326v4.302c0 .733-.6 1.326-1.326 1.326s-1.326-.6-1.326-1.326V4.609zm7.51 0c0-.733.6-1.326 1.326-1.326s1.326.6 1.326 1.326v4.302c0 .733-.6 1.326-1.326 1.326s-1.326-.6-1.326-1.326V4.609z" />
              </svg>
              Connect Jira
            </Button>
            <Button
              variant="outline"
              onClick={fetchTasks}
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((status) => {
            const tasksInColumn = groupByStatus(status)
            return (
              <div
                key={status}
                className={`rounded-2xl shadow-xl border-t-4 ${getColumnColor(status)} backdrop-blur-sm flex flex-col overflow-hidden`}
              >
                <div className="p-5 border-b border-gray-100/50">
                  <h2 className="font-bold text-gray-800 flex items-center gap-3 text-lg">
                    {getStatusIcon(status)}
                    {status}
                    <Badge className="ml-auto bg-gray-100 text-gray-700 font-semibold px-2 py-1">
                      {tasksInColumn.length}
                    </Badge>
                  </h2>
                </div>
                <div className="p-4 flex-1 overflow-auto max-h-[calc(100vh-280px)] space-y-4">
                  {isLoading ? (
                    <div className="text-center text-gray-400 py-8">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p>Loading tasks...</p>
                    </div>
                  ) : tasksInColumn.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Plus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No tasks</p>
                      <p className="text-sm">Tasks will appear here</p>
                    </div>
                  ) : (
                    tasksInColumn.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] group"
                        onClick={() => {
                          setSelectedTask(task)
                          setIsOpen(true)
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                            {task.taskId}
                          </div>
                          {task.priority && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="p-1 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                                    {getPriorityIcon(task.priority)}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Priority: {task.priority}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug">{task.title}</h3>
                        {task.tag && (
                          <Badge
                            variant="outline"
                            className={`${getTagColor(task.tag)} text-xs font-medium mb-3 border`}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {task.tag}
                          </Badge>
                        )}
                        {task.assignee && (
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <Avatar className="w-7 h-7 border-2 border-white shadow-sm">
                              <img
                                src={task.assignee.avatar || "/placeholder.svg"}
                                alt={task.assignee.name}
                                className="rounded-full"
                              />
                            </Avatar>
                            <div className="text-xs font-medium text-gray-600 truncate">{task.assignee.name}</div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Modal de Detalle Mejorado */}
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-0 max-h-[90vh] overflow-hidden border border-gray-200">
              {selectedTask && (
                <>
                  <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-blue-100 text-blue-800 font-bold px-3 py-1">{selectedTask.taskId}</Badge>
                          {selectedTask.tag && (
                            <Badge variant="outline" className={`${getTagColor(selectedTask.tag)} border font-medium`}>
                              <Tag className="w-3 h-3 mr-1" />
                              {selectedTask.tag}
                            </Badge>
                          )}
                        </div>
                        <Dialog.Title className="text-2xl font-bold text-gray-900 leading-tight">
                          {selectedTask.title}
                        </Dialog.Title>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <InfoBlock label="Status" value={selectedTask.status} icon={getStatusIcon(selectedTask.status)} />
                      <InfoBlock
                        label="Priority"
                        value={selectedTask.priority}
                        icon={getPriorityIcon(selectedTask.priority)}
                      />
                      <InfoBlock
                        label="Sprint"
                        value={selectedTask.sprint}
                        icon={<Calendar className="w-4 h-4 text-gray-500" />}
                      />
                      <InfoBlock
                        label="Reporter"
                        value={selectedTask.reporter}
                        icon={<User className="w-4 h-4 text-gray-500" />}
                      />
                      <InfoBlock
                        label="Labels"
                        value={selectedTask.labels}
                        icon={<Tag className="w-4 h-4 text-gray-500" />}
                      />
                      <InfoBlock
                        label="Estimated Time"
                        value={selectedTask.estimatedTime ? `${selectedTask.estimatedTime}h` : "Not set"}
                        icon={<Timer className="w-4 h-4 text-gray-500" />}
                      />
                    </div>

                    {selectedTask.description && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                        <div className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200 leading-relaxed">
                          {selectedTask.description}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Activity</h3>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        {selectedTask.createdAt ? (
                          <div className="flex items-center gap-3 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Created on{" "}
                              {new Date(selectedTask.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        ) : (
                          <div className="text-gray-500">No activity recorded</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Close
                    </Button>
                    <Button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white">Update Status</Button>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  )
}

const InfoBlock = ({ label, value, icon }: { label: string; value?: string; icon?: JSX.Element }) => (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
    <h3 className="text-sm font-semibold text-gray-600 mb-2">{label}</h3>
    <div className="flex items-center gap-2 font-semibold text-gray-900">
      {icon}
      <span className="truncate">{value || "N/A"}</span>
    </div>
  </div>
)
