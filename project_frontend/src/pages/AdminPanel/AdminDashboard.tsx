import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Store, PlusCircle, Users, BookOpen } from 'lucide-react';
import DifficultyBarChart from '@/components/DifficultyBarChart';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminCards = [
    {
      title: 'Store Management',
      description: 'Manage store items, prices, and inventory',
      icon: Store,
      path: '/store/manage',
      color: 'bg-purple-500',
    },
    {
      title: 'Create Problem',
      description: 'Add new coding problems and challenges',
      icon: PlusCircle,
      path: '/problems/create',
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      path: '/manage-users',
      color: 'bg-green-500',
    },
    {
      title: 'Manage Problems',
      description: 'Edit and organize coding problems',
      icon: BookOpen,
      path: '/manage-problems',
      color: 'bg-red-500',
    },
    {
      title: 'Manage Purchases',
      description: 'View and deliver purchases',
      icon: BookOpen,
      path: '/manage-purchase',
      color: 'bg-red-500',
    }
  ];
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProblems: 0,
    storeItems: 0,
    totalSubmissions: 0,
  });

  const [systemStatus, setSystemStatus] = useState({
    system_status: '',
    database: '',
    api: '',
  });
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/employees/platform-statistics`)
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Failed to fetch stats:', err));
  
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/employees/system-status`)
      .then((res) => setSystemStatus(res.data))
      .catch((err) => console.error('Failed to fetch system status:', err));
  }, []);


  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={`${card.color} rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform cursor-pointer`}
                onClick={() => navigate(card.path)}
              >
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                  <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <span className="text-2xl font-bold">{index + 1}</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2">{card.title}</h2>
                <p className="text-sm text-white text-opacity-80">{card.description}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Platform Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Users</span>
                <span className="text-blue-400">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Problems</span>
                <span className="text-green-400">{stats.activeProblems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Store Items</span>
                <span className="text-purple-400">{stats.storeItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Submissions</span>
                <span className="text-yellow-400">{stats.totalSubmissions}</span>
              </div>
            </div>
          </div>
          <DifficultyBarChart />

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${systemStatus.system_status === 'All systems operational' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                <span>{systemStatus.system_status}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${systemStatus.database === 'Connected' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <span>Database: {systemStatus.database}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>API: {systemStatus.api}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;