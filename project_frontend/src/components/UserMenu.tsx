"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, Settings, LogOut, Crown, Coins } from "lucide-react"
import { LucideUser } from "lucide-react"
import axios from "axios"

interface UserType {
  firstName: string
  lastName: string
  email: string
  nationality: string
  experience?: number
  coins?: number
  phoneNumber: string
  profilePicture?: string
}

const UserMenu = () => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    console.log("Token in localStorage:", token)
    console.log("user id: ", localStorage.getItem("user_id"))

    if (!token) {
      console.error("No token in localStorage")
      return
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Authenticated user:", res.data)
        setUser(res.data)
      })
      .catch((err) => {
        console.error("Error fetching profile", err.response?.data || err.message)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const initials = user ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() : "US"

  const currentLevel = Math.floor((user?.experience ?? 0) / 1000)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 rounded-full bg-white px-3 py-1.5 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture || "/placeholder.svg"}
              alt="Profile picture"
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium">{initials}</span>
          )}
        </div>
        <span className="text-sm font-medium">{`${user?.firstName || "User"}`}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-5 duration-200 overflow-hidden">
          {/* User Info Header */}
          <div className="p-4 bg-red-50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt="Profile picture"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-lg">
                    {initials}
                  </div>
                )}
                {user?.coins && user.coins > 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-orange-400 rounded-full p-1">
                    <Coins className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 truncate">
                  {`${user?.firstName || "User"} ${user?.lastName || ""}`}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email || "Email not available"}</p>
                <div className="flex items-center space-x-3 mt-1">
                  {user?.experience !== undefined && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Crown className="w-3 h-3 mr-1 text-red-500" />
                      <span>Level {currentLevel}</span>
                    </div>
                  )}
                  {user?.coins !== undefined && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Coins className="w-3 h-3 mr-1 text-orange-500" />
                      <span>{user.coins} coins</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              className="flex w-full items-center px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                navigate("/profile/view")
                setOpen(false)
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <LucideUser className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <div className="font-medium">Edit Profile</div>
                <div className="text-xs text-gray-500">Update your information</div>
              </div>
            </button>

            <button
              className="flex w-full items-center px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                navigate("/settings")
                setOpen(false)
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <Settings className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <div className="font-medium">Settings</div>
                <div className="text-xs text-gray-500">Preferences and configuration</div>
              </div>
            </button>
          </div>

          {/* Logout Section */}
          <div className="py-1 border-t border-gray-100">
            <button
              className="flex w-full items-center px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-3">
                <LogOut className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <div className="font-medium">Sign Out</div>
                <div className="text-xs text-red-500">End your current session</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
