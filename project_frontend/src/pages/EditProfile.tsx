"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Flag,
  Briefcase,
  Coins,
  Upload,
  Loader2,
  Check,
  X,
  Camera,
  Star,
  Trophy,
} from "lucide-react"
import axios from "axios"
import CountryName from "./Home/CountryName"

interface DecodedToken {
  firstName: string
  lastName: string
  sub: string
  nationality: string
  experience?: number
  coins?: number
  phoneNumber: string
  profilePicture?: string
  isAdmin?: boolean
  email?: string
}

export default function EditProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)

  const [user, setUser] = useState<DecodedToken>({
    firstName: "",
    lastName: "",
    sub: "",
    nationality: "",
    experience: 0,
    coins: 0,
    phoneNumber: "",
    profilePicture: "",
    email: "",
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        console.log("Token enviado:", token)

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Error al obtener usuario")

        const data = await res.json()

        setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          sub: data.email,
          nationality: data.nationality || "",
          experience: data.experience || 0,
          coins: data.coins || 0,
          phoneNumber: data.phoneNumber || "",
          profilePicture: data.profilePicture || "",
          email: data.email || "",
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const decoded = jwtDecode<DecodedToken>(token)
          console.log("Decoded:", decoded)
          setUser(decoded)
        }
      } catch (error) {
        console.error("Error decoding token:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          nationality: user.nationality,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
        }),
      })

      if (!res.ok) throw new Error("Error al guardar los datos del usuario")

      setSuccess(true)
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error("Error saving user data:", error)
      setSuccess(false)
      setTimeout(() => setSuccess(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const cloudName = import.meta.env.VITE_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    try {
      const response = await axios.post<{ secure_url: string }>(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      )

      const imageURL = response.data.secure_url

      setUser((prev) => ({
        ...prev,
        profilePicture: imageURL,
      }))
    } catch (error) {
      console.error("Image upload failed:", error)
      alert("Image upload failed. Please try again.")
    }
  }

  const initials = user ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() : "?"

  const currentLevel = Math.floor((user?.experience ?? 0) / 1000)
  const progressToNextLevel = ((user?.experience ?? 0) % 1000) / 10

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center h-20">
            <button
              onClick={() => navigate(-1)}
              className="mr-6 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
              <p className="text-slate-400 text-sm">Update your personal information and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 flex flex-col items-center justify-center min-h-[500px] border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Profile</h3>
            <p className="text-gray-500">Please wait while we fetch your information...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Profile picture and stats section */}
              <div className="xl:col-span-1 space-y-6">
                {/* Profile Picture Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <Camera className="w-6 h-6 mr-3 text-blue-600" />
                    Profile Photo
                  </h2>
                  <div className="flex flex-col items-center">
                    <div className="relative group w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-xl border-4 border-white">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 text-3xl font-bold">{initials}</span>
                      )}
                      <label
                        htmlFor="profile-picture"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
                      >
                        <Upload className="h-8 w-8 text-white" />
                      </label>
                      <input
                        type="file"
                        id="profile-picture"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <p className="text-sm text-gray-500 text-center mt-4 max-w-xs">
                      Click on the image to upload a new profile photo
                    </p>
                  </div>
                </div>

                {/* Coins Card */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-6 border border-yellow-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                      <Coins className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Coins</h3>
                      <p className="text-sm text-gray-600">Your currency</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900">{user.coins}</span>
                    <button
                      type="button"
                      className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold bg-yellow-100 px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                      View Store
                    </button>
                  </div>
                </div>

                {/* Level Progress Card */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-6 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Level Progress</h3>
                      <p className="text-sm text-gray-600">Current level {currentLevel}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{user?.experience ?? 0} XP</span>
                      <span>{1000 - ((user?.experience ?? 0) % 1000)} XP to next level</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressToNextLevel}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal information section */}
              <div className="xl:col-span-3">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                      <User className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                        <p className="text-gray-600">Update your profile details</p>
                      </div>
                    </div>
                    {success === true && (
                      <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                        <Check className="h-5 w-5 mr-2" />
                        <span className="font-semibold">Successfully saved!</span>
                      </div>
                    )}
                    {success === false && (
                      <div className="flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                        <X className="h-5 w-5 mr-2" />
                        <span className="font-semibold">Error saving changes</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-3">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={user.firstName}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-3">
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={user.lastName}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={user.sub || ""}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                          placeholder="your@email.com"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <X className="w-3 h-3 mr-1" />
                        Email address cannot be changed
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-3">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={user.phoneNumber}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                          placeholder="+1 234 567 890"
                        />
                      </div>
                    </div>

                    {/* Nationality */}
                    <div>
                      <label htmlFor="nationality" className="block text-sm font-semibold text-gray-700 mb-3">
                        Nationality
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Flag className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="nationality"
                          name="nationality"
                          value={user.nationality}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 appearance-none bg-white text-gray-900"
                        >
                          <option value="">Select a country</option>
                          <option value="AF">Afghanistan</option>
                          <option value="DE">Germany</option>
                          <option value="AR">Argentina</option>
                          <option value="AU">Australia</option>
                          <option value="BR">Brazil</option>
                          <option value="CA">Canada</option>
                          <option value="CL">Chile</option>
                          <option value="CN">China</option>
                          <option value="CO">Colombia</option>
                          <option value="KR">South Korea</option>
                          <option value="CU">Cuba</option>
                          <option value="DK">Denmark</option>
                          <option value="EC">Ecuador</option>
                          <option value="EG">Egypt</option>
                          <option value="SV">El Salvador</option>
                          <option value="ES">Spain</option>
                          <option value="US">United States</option>
                          <option value="FR">France</option>
                          <option value="GR">Greece</option>
                          <option value="GT">Guatemala</option>
                          <option value="HN">Honduras</option>
                          <option value="IN">India</option>
                          <option value="ID">Indonesia</option>
                          <option value="IE">Ireland</option>
                          <option value="IT">Italy</option>
                          <option value="JP">Japan</option>
                          <option value="MX">Mexico</option>
                          <option value="NI">Nicaragua</option>
                          <option value="NO">Norway</option>
                          <option value="PA">Panama</option>
                          <option value="PY">Paraguay</option>
                          <option value="PE">Peru</option>
                          <option value="PL">Poland</option>
                          <option value="PT">Portugal</option>
                          <option value="GB">United Kingdom</option>
                          <option value="DO">Dominican Republic</option>
                          <option value="RU">Russia</option>
                          <option value="SE">Sweden</option>
                          <option value="CH">Switzerland</option>
                          <option value="TH">Thailand</option>
                          <option value="TR">Turkey</option>
                          <option value="UY">Uruguay</option>
                          <option value="VE">Venezuela</option>
                          <option value="VN">Vietnam</option>
                        </select>
                        {user.nationality && (
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <CountryName code={user.nationality} showCountryName={false} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-3">
                        Experience (XP)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Briefcase className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="experience"
                          name="experience"
                          value={user.experience}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                          placeholder="0"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <Trophy className="w-3 h-3 mr-1" />
                        Experience is earned by completing challenges
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 min-w-[120px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center min-w-[140px] shadow-lg hover:shadow-xl"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
