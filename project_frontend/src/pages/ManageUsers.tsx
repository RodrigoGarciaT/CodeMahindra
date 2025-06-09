"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Shield, ShieldOff, Trash2, Search, Users, Crown, User, Mail, Filter, MoreVertical } from "lucide-react"
import Toast from "@/components/Toast"

interface UserManage {
  profileEpic: string
  firstName: string
  lastName: string
  email: string
  isAdmin: boolean
  id: string
}

interface UserCardProps {
  user: UserManage
  onDelete: (id: string) => void
  onToggleAdmin: (id: string) => void
}

const UserCard: React.FC<UserCardProps> = ({ user, onDelete, onToggleAdmin }) => {
  const [showActions, setShowActions] = useState(false)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        {/* Header with profile and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.profileEpic || "/placeholder.svg"}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center ${
                  user.isAdmin
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                    : "bg-gradient-to-r from-gray-400 to-gray-500"
                }`}
              >
                {user.isAdmin ? <Crown className="w-3 h-3 text-white" /> : <User className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{`${user.firstName} ${user.lastName}`}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
              </div>
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
                    onToggleAdmin(user.id)
                    setShowActions(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    user.isAdmin ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {user.isAdmin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  <span className="font-medium">{user.isAdmin ? "Remove Admin" : "Make Admin"}</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(user.id)
                    setShowActions(false)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-medium">Delete User</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Role badge */}
        <div className="flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              user.isAdmin
                ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border border-orange-200"
                : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200"
            }`}
          >
            {user.isAdmin ? <Crown className="w-4 h-4" /> : <User className="w-4 h-4" />}
            {user.isAdmin ? "Administrator" : "Regular User"}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onToggleAdmin(user.id)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                user.isAdmin
                  ? "bg-orange-100 hover:bg-orange-200 text-orange-600"
                  : "bg-green-100 hover:bg-green-200 text-green-600"
              }`}
              title={user.isAdmin ? "Remove admin status" : "Make admin"}
            >
              {user.isAdmin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onDelete(user.id)}
              className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-all duration-200 text-red-600"
              title="Delete user"
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

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserManage[]>([])
  const [filter, setFilter] = useState<"all" | "admin" | "user">("all")
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employees/`)
      const fetchedUsers = response.data.map((user: any) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        profileEpic:
          user.profilePicture ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkshh0IMgSA8yw_1JFALVsXFojVdR88C05Fw&s",
      }))
      setUsers(fetchedUsers)
    } catch (err) {
      console.error("❌ Error loading users:", err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/employees/${id}`)
      setUsers(users.filter((user) => user.id !== id))
      showToast(true, "User deleted successfully")
    } catch (err) {
      console.error("❌ Error deleting user:", err)
      showToast(false, "Error deleting user")
    }
  }

  const handleToggleAdmin = async (id: string) => {
    const userToUpdate = users.find((user) => user.id === id)
    if (!userToUpdate) return

    const newIsAdmin = !userToUpdate.isAdmin

    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/employees/${id}/admin-status`, {
        is_admin: newIsAdmin,
      })
      setUsers(users.map((user) => (user.id === id ? { ...user, isAdmin: newIsAdmin } : user)))
      showToast(true, "Updated admin status successfully")
    } catch (err) {
      console.error("❌ Error updating admin status:", err)
      showToast(false, "Error updating admin status")
    }
  }

  const filteredUsers = users
    .filter((user) => {
      if (filter === "admin") return user.isAdmin
      if (filter === "user") return !user.isAdmin
      return true
    })
    .filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const adminCount = users.filter((user) => user.isAdmin).length
  const userCount = users.filter((user) => !user.isAdmin).length

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-slate-400">Manage user roles and permissions</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Administrators</p>
                  <p className="text-3xl font-bold text-gray-900">{adminCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Regular Users</p>
                  <p className="text-3xl font-bold text-gray-900">{userCount}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Users</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="lg:w-64">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Role</label>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none bg-white"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as "all" | "admin" | "user")}
                  >
                    <option value="all">All Users</option>
                    <option value="admin">Administrators</option>
                    <option value="user">Regular Users</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results summary */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredUsers.length} of {users.length} users
              </span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  Search: "{searchTerm}"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search criteria or filters." : "No users match the selected criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} onDelete={handleDeleteUser} onToggleAdmin={handleToggleAdmin} />
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

export default ManageUsers
