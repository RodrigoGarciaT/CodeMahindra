import { Link } from "react-router-dom";
import { ArrowLeft, Edit, Mail, MapPin, Phone } from "lucide-react";
import { Progress } from "../components/progress";
import { Card } from "../components/card";
import profilePic from "../images/robot_male_1.svg"; // Asegúrate de tener esta imagen
import coinIcon from "../images/robot_male_1.svg";
import flag from "../images/robot_male_1.svg";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("current");
    interface User {
      firstName: string;
      lastName: string;
      email: string;
      nationality: string;
      experience: number;
      coins: number;
      phoneNumber: string;
      profilePicture: string;
    }

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      const token = localStorage.getItem("token");
      console.log("Token en localStorage:", token);

      if (!token) {
        console.error("No hay token en localStorage");
        return;
      }
    
      axios.get(`http://localhost:8000/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Usuario autenticado:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener el perfil", err.response?.data || err.message);
      });
    }, []);

    return (
      <div className="min-h-screen bg-[#363B41] text-black">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="text-white h-6 w-6" />
            </Link>
            <h1 className="text-white 2xl font-medium">Perfil</h1>
          </div>
  
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6 mt-[120px]">
              <Card className="overflow-hidden bg-[#E6E7E8] p-6">
                  <div className="relative mt-6 w-full max-w-md mx-auto">
                    <div className="flex items-center rounded-full bg-white p-3 shadow-md">
                      <div className="mr-3 h-12 w-12 overflow-hidden rounded-full border-2 border-white">
                      <img src={user?.profilePicture ?? profilePic} alt="Profile" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                        <h2 className="text-lg font-bold text-black">{user?.firstName ?? "Cargando..."}</h2>
                          <img src={flag} alt="Flag" className="h-5 w-6" />
                        </div>
                      </div>
                      <div className="flex items-center text-black">
                        <img src={coinIcon} alt="Coins" className="mr-2 h-6 w-6" />
                        <span>{user?.coins ?? 0}</span>
                      </div>
                    </div>
                </div>
  
                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-medium">Progreso</h3>
                  <Progress value={65} className="h-4 bg-gray-700" indicatorClassName="bg-red-500" />
                  <div className="mt-2 flex justify-between">
                    <span>Nivel 5</span>
                    <span>{user?.experience ?? 0} xp</span>
                  </div>
                </div>
  
                <div className="mt-6 rounded-lg bg-[#FFFF] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    <button className="text-black hover:text-black">
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="mr-3 h-5 w-5 text-black" />
                      <span>{user?.email ?? "Cargando..."}</span>
                    </div>
                    <div className="flex items-center text-black">
                      <Phone className="mr-3 h-5 w-5" />
                      <span>{user?.phoneNumber ?? "No proporcionado"}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-3 h-5 w-5 text-black" />
                      <span>{user?.nationality ?? "No especificado"}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

          {/* Right column - Charts and stats */}
          <div className="space-y-6">
            {/* Line chart */}
            <Card className="bg-[#E6E7E8] p-4">
              <div className="flex justify-end">
                <div className="rounded border border-gray-700 px-2 py-1 text-xs">Only rated</div>
              </div>
              <div className="h-[200px] w-full">
                {/* Placeholder for line chart */}
                <div className="h-full w-full rounded bg-[#222] p-2">
                  <div className="h-full w-full bg-gradient-to-b from-purple-500/30 via-green-500/30 to-transparent rounded"></div>
                </div>
              </div>
            </Card>

            {/* Bar chart */}
            <Card className="bg-[#E6E7E8] p-4">
              <div className="mb-2 flex items-center">
                <h3 className="text-sm font-medium">Problem Ratings</h3>
                <div className="ml-auto flex items-center">
                  <div className="mr-2 h-3 w-3 rounded bg-gray-400"></div>
                  <span className="text-xs text-gray-400">Problems Solved</span>
                </div>
              </div>
              <div className="h-[150px] w-full">
                {/* Placeholder for bar chart */}
                <div className="flex h-full w-full items-end justify-between">
                  {[80, 12, 12, 10, 8, 10, 35, 8, 15, 18, 5, 3, 2, 1, 1].map((height, i) => (
                    <div
                      key={i}
                      className={`w-[5%] ${i === 6 ? "bg-green-500" : "bg-gray-400"}`}
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Activity calendar */}
            <Card className="bg-[#E6E7E8] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2 text-lg font-medium">65</span>
                  <span className="text-sm text-gray-400">submissions in the past one year</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="mr-1 text-xs text-gray-400">Total active days:</span>
                    <span className="text-xs">12</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1 text-xs text-gray-400">Max streak:</span>
                    <span className="text-xs">2</span>
                  </div>
                  <div className="relative">
                    <button
                      className={`rounded border px-2 py-1 text-xs ${activeTab === "current" ? "bg-gray-400" : ""}`}
                      onClick={() => setActiveTab("current")}
                    >
                      Current
                    </button>
                  </div>
                </div>
              </div>
              <div className="h-[100px] w-full">
                {/* Placeholder for activity calendar */}
                <div className="grid h-full w-full grid-cols-12 gap-1">
                  {Array.from({ length: 12 }).map((_, monthIndex) => (
                    <div key={monthIndex} className="flex flex-col space-y-1">
                      {Array.from({ length: 5 }).map((_, weekIndex) => (
                        <div
                          key={weekIndex}
                          className={`h-3 w-3 rounded-sm ${
                            Math.random() > 0.85 ? "bg-green-500" : Math.random() > 0.95 ? "bg-green-700" : "bg-gray-400"
                          }`}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
