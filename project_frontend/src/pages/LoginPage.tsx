"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aquí tu lógica real de login (API, contexto de auth, etc.)
      console.log("Iniciando sesión con:", { email, password })
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#1e1e1e] py-8">
      <div className="relative w-full max-w-md">
        {/* Diagonal red stripe at top */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#E63946] transform -skew-y-2 z-0"></div>

        <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md relative z-10 mt-8">
          <div className="flex justify-center mb-6">
            <img src="/logo-codemahindra.png" alt="CodeMahindra Logo" className="h-12 object-contain" />
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center text-[#2A2D34]">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-[#2A2D34]">Correo electrónico</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-gray-50"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-[#2A2D34]">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-gray-50"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E63946] text-white py-3 px-4 rounded-md hover:bg-[#d32836] transition flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Iniciando...
                </span>
              ) : (
                <>
                  Iniciar sesión <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-[#E63946] hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-[#E63946] hover:underline font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Diagonal red stripe at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#E63946] transform skew-y-2 z-0"></div>
      </div>
    </div>
  )
}

export default LoginPage

