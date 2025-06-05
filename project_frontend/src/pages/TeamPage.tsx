import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { useParams } from "react-router-dom";
import { useTeamMembers } from "../hooks/useTeamMembers";
import { useState, useEffect } from 'react';
import axios from 'axios';

const lineChartData = [
  { name: 'Jan 2024', value: 1200 },
  { name: 'Apr 2024', value: 1600 },
  { name: 'Jul 2024', value: 1550 },
  { name: 'Oct 2024', value: 1700 },
  { name: 'Jan 2025', value: 1800 },
  { name: 'Apr 2025', value: 2000 },
  { name: 'Jul 2025', value: 2200 },
  { name: 'Oct 2025', value: 2400 },
];

function ProfileAndTeamPage() {
  const navigate = useNavigate();
  const { teamId } = useParams();

  if (!teamId) {
    return <div className="text-white p-8">No se proporcionó teamId en la URL.</div>;
  }

  type TeamMember = {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    coins?: number;
    experience?: number;
  };

  const { members, loading } = useTeamMembers(teamId || "") as {
    members: TeamMember[];
    loading: boolean;
  };

  const totalExperience = members.reduce((sum, member) => sum + (member.experience ?? 0), 0);
  const teamLevel = Math.floor(totalExperience / 1000);

  const [teamInfo, setTeamInfo] = useState<{ name: string; code: string; } | null>(null);
  const [difficultyData, setDifficultyData] = useState<{
    Easy: number;
    Medium: number;
    Hard: number;
  } | null>(null);
  const [difficultyLoading, setDifficultyLoading] = useState(true);
  
  useEffect(() => {
    const fetchTeamInfo = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/teams/${teamId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al cargar la información del equipo");
        const data = await res.json();
        setTeamInfo(data);
      } catch (err) {
        console.error("Error obteniendo el equipo:", err);
      }
    };

    if (teamId) {
      fetchTeamInfo();
    }
  }, [teamId]);

  useEffect(() => {
    if (members.length > 0) {
      setDifficultyLoading(true);
      const aggregatedData = {
        Easy: 0,
        Medium: 0,
        Hard: 0
      };

      const fetchPromises = members.map(member => 
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/employees/solved-difficulty/${member.id}`)
          .then(res => {
            aggregatedData.Easy += res.data.Easy || 0;
            aggregatedData.Medium += res.data.Medium || 0;
            aggregatedData.Hard += res.data.Hard || 0;
          })
          .catch(err => {
            console.error(`Error fetching difficulty for member ${member.id}:`, err);
          })
      );

      Promise.all(fetchPromises)
        .then(() => {
          setDifficultyData(aggregatedData);
          setDifficultyLoading(false);
        });
    }
  }, [members]);

  const leaveTeam = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/teams/${teamId}/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("No se pudo salir del equipo");

      navigate("/home");
    } catch (error) {
      console.error("Error al salir del equipo:", error);
      alert("Hubo un error al intentar salir del equipo.");
    }
  };

  const barChartData = difficultyData 
    ? [
        { name: 'Easy', value: difficultyData.Easy, color: '#28a745' },
        { name: 'Medium', value: difficultyData.Medium, color: '#fd7e14' },
        { name: 'Hard', value: difficultyData.Hard, color: '#dc3545' },
      ]
    : [
        { name: 'Easy', value: 0, color: '#28a745' },
        { name: 'Medium', value: 0, color: '#fd7e14' },
        { name: 'Hard', value: 0, color: '#dc3545' },
      ];

  return (
    <div className="min-h-screen bg-[#363B41]">
      <div className="max-w-7xl mx-auto p-6 text-gray-900">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 p-2 rounded-md mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6 text-white">Equipo</h1>
          
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">{teamInfo?.name ?? "Nombre del equipo"}</h2>
            {teamInfo?.code && (
              <div className="text-sm text-gray-500 mb-2">
                Código del equipo: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{teamInfo.code}</span>
              </div>
            )}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Nivel del equipo: {teamLevel}</span>
                <span>Experiencia del equipo: {totalExperience} XP</span>
              </div>
              <div className="bg-red-500 h-2 rounded-full"
                style={{
                  width: `${(totalExperience % 1000) / 10}%`,
                }}
              ></div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Miembro</th>
                    <th className="px-4 py-2 text-left">XP</th>
                    <th className="px-4 py-2 text-left">Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4">Cargando...</td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4">No hay miembros en este equipo.</td>
                    </tr>
                  ) : (
                    members.map((member) => {
                      const experience = member.experience ?? 0;
                      const level = Math.floor(experience / 1000);
                      return (
                        <tr key={member.id}>
                          <td className="border px-4 py-2 flex items-center gap-2">
                            {member.profilePicture && (
                              <img src={member.profilePicture} alt="foto" className="w-6 h-6 rounded-full" />
                            )}
                            {member.firstName} {member.lastName}
                          </td>
                          <td className="border px-4 py-2">{experience}</td>
                          <td className="border px-4 py-2">Nivel {level}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Clasificación por dificultad</h2>
            {difficultyLoading ? (
              <div className="text-center py-8">Cargando datos de dificultad...</div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value">
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={() => {
                const confirmLeave = window.confirm("¿Estás seguro de que quieres salir del equipo?");
                if (confirmLeave) {
                  leaveTeam();
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            >
              Salir del equipo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileAndTeamPage;