import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, UserPlus, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';

const lineChartData = [
  { name: 'Jan 2023', value: 1200 },
  { name: 'Apr 2023', value: 1600 },
  { name: 'Jul 2023', value: 1550 },
  { name: 'Oct 2023', value: 1700 },
  { name: 'Jan 2024', value: 1800 },
  { name: 'Apr 2024', value: 2000 },
  { name: 'Jul 2024', value: 2200 },
  { name: 'Oct 2024', value: 2400 },
];

const barChartData = [
  { name: 'Easy', value: 45, color: '#28a745' },
  { name: 'Medium', value: 30, color: '#fd7e14' },
  { name: 'High', value: 50, color: '#dc3545' },
];

interface TeamMember {
  id: string;
  name: string;
  points: number;
  level: number;
  imageUrl: string;
}

function TeamPage() {
  const navigate = useNavigate();
  const [showManageTeam, setShowManageTeam] = React.useState(false);
  const [newMemberName, setNewMemberName] = React.useState('');
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([
    {
      id: '1',
      name: 'Davis Curtis',
      points: 9462,
      level: 5,
      imageUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      points: 8750,
      level: 4,
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    {
      id: '3',
      name: 'Michael Chen',
      points: 9100,
      level: 5,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
    {
      id: '4',
      name: 'Emma Wilson',
      points: 8900,
      level: 4,
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    },
  ]);

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: newMemberName,
        points: 0,
        level: 1,
        imageUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop',
      };
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#363B41]">
      <div className="max-w-7xl mx-auto p-6 text-gray-900">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-200 p-2 rounded-md mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Equipo</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowManageTeam(false)} 
                className={`px-4 py-2 rounded-lg ${!showManageTeam ? 'bg-red-600 text-white' : 'bg-white text-gray-900'}`}
              >
                Ver más
              </button>
              <button 
                onClick={() => setShowManageTeam(true)}
                className={`px-4 py-2 rounded-lg ${showManageTeam ? 'bg-red-600 text-white' : 'bg-white text-gray-900'}`}
              >
                Añadir o eliminar integrantes
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Los fieles y Edsel</h2>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Nivel 5</span>
                <span>9462 exp</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>

            {showManageTeam ? (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Nombre del nuevo miembro"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={handleAddMember}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Añadir</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-4">
                        <img 
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-gray-500">Nivel {member.level}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Miembro</th>
                      <th className="px-4 py-2 text-left">Puntos</th>
                      <th className="px-4 py-2 text-left">Nivel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="border px-4 py-2">{member.name}</td>
                        <td className="border px-4 py-2">{member.points}</td>
                        <td className="border px-4 py-2">Nivel {member.level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Progreso a lo largo del tiempo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
    <h2 className="text-xl font-semibold mb-4">Clasificación por dificultad</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Gráfica para Easy */}
      <div>
        <h3 className="font-semibold text-center mb-2">Easy</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barChartData.filter(data => data.name === 'Easy')}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#28a745" /> {/* Verde */}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica para Medium */}
      <div>
        <h3 className="font-semibold text-center mb-2">Medium</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barChartData.filter(data => data.name === 'Medium')}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#ffc107" /> {/* Amarillo */}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica para High */}
      <div>
        <h3 className="font-semibold text-center mb-2">High</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barChartData.filter(data => data.name === 'High')}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#dc3545" /> {/* Rojo */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;