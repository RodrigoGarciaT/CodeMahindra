import { Link, useNavigate } from 'react-router-dom';
import { XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { useParams } from "react-router-dom";
import { useTeamMembers } from "../../hooks/useTeamMembers";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-[#1f1f22] to-[#363B41] text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex items-center">
          <Link
            to="/home"
            className="mr-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="text-white h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-white text-3xl font-bold">Team</h1>
            <p className="text-slate-400">Manage your team and track its performance</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          {/* Team Info */}
          <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl mb-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">{teamInfo?.name ?? "Team Name"}</h2>
            {teamInfo?.code && (
              <p className="text-sm text-gray-500 mb-2">
                Team Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{teamInfo.code}</span>
              </p>
            )}

            <div className="mb-4">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Team Level: <span className="font-bold">{teamLevel}</span></span>
                <span>Total XP: {totalExperience} XP</span>
              </div>
              <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-700 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalExperience % 1000) / 10}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full text-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Member</th>
                    <th className="px-4 py-3 text-left">XP</th>
                    <th className="px-4 py-3 text-left">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6">Loading...</td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6">No members in this team.</td>
                    </tr>
                  ) : (
                    members.map((member) => {
                      const experience = member.experience ?? 0;
                      const level = Math.floor(experience / 1000);
                      return (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="border-b px-4 py-3 flex items-center gap-2">
                            {member.profilePicture && (
                              <img src={member.profilePicture} alt="Profile" className="w-6 h-6 rounded-full shadow" />
                            )}
                            <span>{member.firstName} {member.lastName}</span>
                          </td>
                          <td className="border-b px-4 py-3">{experience}</td>
                          <td className="border-b px-4 py-3">Level {level}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Difficulty Chart */}
          <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 mb-10">
            <h2 className="text-2xl font-bold mb-4">Performance by Difficulty</h2>
            {difficultyLoading ? (
              <div className="text-center py-12 text-gray-500">Loading difficulty data...</div>
            ) : (
              <div className="h-72">
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

          {/* Leave Team Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              onClick={() => {
                if (window.confirm("Are you sure you want to leave the team?")) {
                  leaveTeam();
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
            >
              Leave Team
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfileAndTeamPage