import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { Loader2 } from "lucide-react"
import axios from "axios"
import UserProgressCard from "./UserProgressCard"
import UserProfileCard from "./UserProfileCard"
import PersonalInfoForm from "./PersonalInfoForm"
import GoBackButton from "@/components/GoBackButton"

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
    email: ""
  })

useEffect(() => {
  const fetchUser = async () => {
  try {
    
    const token = localStorage.getItem("token");
    console.log("Token enviado:", token);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Error al obtener usuario");

    const data = await res.json();

    setUser({
      firstName: data.firstName,
      lastName: data.lastName,
      sub: data.email,
      nationality: data.nationality || "",
      experience: data.experience || 0,
      coins: data.coins || 0,
      phoneNumber: data.phoneNumber || "",
      profilePicture: data.profilePicture || "",
      email: data.email || ""
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    setLoading(false);
  }
};

  fetchUser()
}, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const decoded = jwtDecode<DecodedToken>(token)
          console.log("Decoded:", decoded);
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
      // Replace with actual API call
      const token = localStorage.getItem("token")

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          nationality: user.nationality,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture, // en base64 si estás usando eso temporalmente
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
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post<{ secure_url: string }>(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const imageURL = response.data.secure_url;

      setUser((prev) => ({
        ...prev,
        profilePicture: imageURL,
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    }
  };


const initials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "?"
    
  return (
    <div className="min-h-screen bg-gray-800 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4">
        <GoBackButton />
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 mt-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-10 w-10 text-red-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading user information...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <UserProfileCard
                user={{
                  profilePicture: user?.profilePicture,
                  coins: user?.coins ?? 0,
                }}
                initials={initials}
                handleImageUpload={handleImageUpload}
                onStoreClick={() => navigate("/store")}
              />

              <PersonalInfoForm
                user={{
                  ...user,
                  experience: user.experience ?? 0
                }}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                saving={saving}
                success={success}
              />
            </div>
          </form>
        )}

        <UserProgressCard experience={user.experience ?? 0} />
      </div>
    </div>
  )
}