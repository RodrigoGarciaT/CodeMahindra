"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, User, Settings, LogOut } from "lucide-react"

const UserMenu = () => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-600">
          <span className="text-xs font-medium">DC</span>
        </div>
        <span className="text-sm font-medium">Digital Creatives</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="py-2 px-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Digital Creatives</p>
            <p className="text-xs text-gray-500 truncate">usuario@digitalcreatives.com</p>
          </div>
          <div className="py-1">
            <button
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                navigate("/profile")
                setOpen(false)
              }}
            >
              <User className="mr-2 h-4 w-4 text-gray-500" />
              Editar Información
            </button>
            <button
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                navigate("/settings")
                setOpen(false)
              }}
            >
              <Settings className="mr-2 h-4 w-4 text-gray-500" />
              Ajustes
            </button>
          </div>
          <div className="py-1 border-t border-gray-100">
            <button
              className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
