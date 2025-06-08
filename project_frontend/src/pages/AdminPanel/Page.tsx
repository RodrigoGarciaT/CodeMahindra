import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Store, PlusCircle, Users, BookOpen, ShoppingCart } from 'lucide-react';
import DifficultyBarChart from '@/components/DifficultyBarChart';

const AdminPanel = () => {
  const navigate = useNavigate();

  const adminCards = [
    {
      title: 'Store Management',
      description: 'Manage store items, prices, and inventory',
      icon: Store,
      path: '/store/manage',
      color: 'from-purple-500 to-purple-700',
    },
    {
      title: 'Create Problem',
      description: 'Add new coding problems and challenges',
      icon: PlusCircle,
      path: '/problems/create',
      color: 'from-blue-500 to-blue-700',
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      path: '/manage-users',
      color: 'from-green-500 to-green-700',
    },
    {
      title: 'Manage Problems',
      description: 'Edit and organize coding problems',
      icon: BookOpen,
      path: '/manage-problems',
      color: 'from-red-500 to-red-700',
    },
    {
      title: 'Manage Purchases',
      description: 'View and deliver purchases',
      icon: ShoppingCart,
      path: '/manage-purchase',
      color: 'from-yellow-500 to-yellow-700',
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

  // Función para aplicar efecto 3D dinámico
  const handleMouseMove = (e: React.MouseEvent, cardRef: React.RefObject<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = (cardRef: React.RefObject<HTMLDivElement>) => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 tracking-tight">Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective">
          {adminCards.map((card, index) => {
            const Icon = card.icon;
            const cardRef = useRef<HTMLDivElement>(null);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div
                  ref={cardRef}
                  onMouseMove={(e) => handleMouseMove(e, cardRef)}
                  onMouseLeave={() => handleMouseLeave(cardRef)}
                  onClick={() => navigate(card.path)}
                  className={`bg-gradient-to-br ${card.color} p-5 rounded-xl shadow-xl transition-transform duration-300 cursor-pointer transform-style preserve-3d`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-8 h-8 text-white" />
                    <div className="text-xs font-bold text-white/80">#{index + 1}</div>
                  </div>
                  <h2 className="text-xl font-bold mt-4">{card.title}</h2>
                  <p className="text-sm text-white/80 mt-1">{card.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats & Status */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Platform Stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#1e1e1e] border border-gray-700 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-4">📊 Platform Statistics</h3>
            <div className="space-y-3 text-sm">
              <StatItem label="Total Users" value={stats.totalUsers} color="text-blue-400" />
              <StatItem label="Active Problems" value={stats.activeProblems} color="text-green-400" />
              <StatItem label="Store Items" value={stats.storeItems} color="text-purple-400" />
              <StatItem label="Total Submissions" value={stats.totalSubmissions} color="text-yellow-400" />
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <DifficultyBarChart />
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-[#1e1e1e] border border-gray-700 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-4">🛠️ System Status</h3>
            <div className="space-y-4 text-sm">
              <StatusDot label="System" value={systemStatus.system_status} expected="All systems operational" />
              <StatusDot label="Database" value={systemStatus.database} expected="Connected" />
              <StatusDot label="API" value={systemStatus.api} expected="Connected" />
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .perspective {
          perspective: 1200px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

const StatItem = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className={`font-semibold ${color}`}>{value}</span>
  </div>
);

const StatusDot = ({ label, value, expected }: { label: string; value: string; expected: string }) => {
  const ok = value === expected;
  return (
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full mr-2 ${ok ? 'bg-green-500' : 'bg-red-500'}`} />
      <span>{label}: {value}</span>
    </div>
  );
};

export default AdminPanel;
