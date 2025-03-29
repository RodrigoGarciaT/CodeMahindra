"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    // Aquí tu lógica real de registro (API, contexto de auth, etc.)
    console.log("Registrando usuario:", { email, password })
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

          <h2 className="text-2xl font-bold mb-6 text-center text-[#2A2D34]">Registro</h2>

          {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>}

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
                  placeholder="Crea tu contraseña"
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

            <div>
              <label className="block mb-2 font-medium text-[#2A2D34]">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-gray-50"
                  placeholder="Repite tu contraseña"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E63946] text-white py-3 px-4 rounded-md hover:bg-[#d32836] transition flex items-center justify-center gap-2 font-medium"
            >
              Registrarme <ArrowRight size={18} />
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-[#E63946] hover:underline font-medium">
                Inicia sesión
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

export default RegisterPage

