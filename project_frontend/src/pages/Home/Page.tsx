// src/pages/Home/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountryName from '../Home/CountryName';
import {
  Bot,
  Star,
  ChevronRight,
  Users,
  ArrowLeft,
} from 'lucide-react';
import type { Bot as BotType } from '../BotStore';
import { useTeamMembers } from '@/hooks/useTeamMembers';

// ——— 1. Definir los tipos que esperamos recibir del backend ———

/** La forma en que tu backend retorna cada logro “ganado” */
interface AchievementMini {
  id: number;
  key: string;
  name: string;
  description?: string;
  category: string;
  topic: string;
  icon?: string; // URL de un icono o null/undefined
}

/** Cada fila de la tabla puente Employee_Achievement tal como tu controlador la envía */
interface EmployeeAchievementOut {
  employee_id: string;      // UUID como texto
  achievement_id: number;
  obtainedDate: string;     // ISO string, p. ej. "2025-06-01T12:00:00Z"
  achievement: AchievementMini;
}

/** La respuesta completa de /achievements/me */
interface UserAchievementsResponse {
  earned: EmployeeAchievementOut[];
  not_earned: AchievementMini[];
}

// ——— 2. Componente Dashboard adaptado ———

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // — Estado del usuario (igual que antes) — 
  const [user, setUser] = useState<{
    photo: string;
    firstName: string;
    lastName: string;
    experience: number;
    nationality: string;
    profilePicture: string;
    team_id: number | null;
  }>({
    photo: '',
    firstName: '',
    lastName: '',
    experience: 0,
    nationality: '',
    profilePicture: '',
    team_id: null,
  });

  // — Estados para el fetch de logros — 
  const [earned, setEarned] = useState<EmployeeAchievementOut[]>([]);
  const [notEarned, setNotEarned] = useState<AchievementMini[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState<boolean>(true);
  const [achievementsError, setAchievementsError] = useState<string | null>(null);

  // — Estados de UI: tile seleccionado y “mostrar todo” — 
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementMini | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState<boolean>(false);

  // — Estado “Bot comprado” (igual que antes) — 
  const [purchasedBot, setPurchasedBot] = useState<BotType | null>(() => {
    const saved = localStorage.getItem('purchasedBots');
    if (saved) {
      const arr: BotType[] = JSON.parse(saved);
      return arr.length > 0 ? arr[0] : null;
    }
    return null;
  });

  // ——— 3. useEffect para cargar datos del usuario (user/me) ———
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then((data) => {
        setUser({
          photo: data.photo ?? '',
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          experience: data.experience ?? 0,
          nationality: data.nationality ?? '',
          profilePicture: data.profilePicture ?? '',
          team_id: data.team_id ?? null,
        });
      })
      .catch(err => {
        console.error('Error en fetch /user/me:', err);
      });
  }, []);

  // ——— 4. useEffect para cargar los logros (earned + not_earned) ———
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAchievementsError('No hay token de autenticación');
      setAchievementsLoading(false);
      return;
    }

    setAchievementsLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/achievements/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }
        return res.json() as Promise<UserAchievementsResponse>;
      })
      .then((response) => {
        setEarned(response.earned);
        setNotEarned(response.not_earned);
        setAchievementsLoading(false);
      })
      .catch(err => {
        console.error('Error cargando logros:', err);
        setAchievementsError(err.message);
        setAchievementsLoading(false);
      });
  }, []);

  // ——— 5. Función auxiliar para agrupar un array por categoría ———
  const groupByCategory = <T extends { category: string }>(list: T[]) => {
    return list.reduce<Record<string, T[]>>((acc, item) => {
      const cat = item.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  };

  // Creamos dos groupBy: earned y notEarned (extraemos el objeto .achievement)
  const earnedByCategory = groupByCategory(
    earned.map(ea => ({
      ...ea.achievement,
      // le añado un campo synthetic para poder marcar "ganado"
      _earnedInfo: ea,
    }))
  );

  const notEarnedByCategory = groupByCategory(notEarned);

  // ——— 6. Hooks para “equipo” ———
  const { members, loading: teamLoading } = useTeamMembers(user.team_id ? String(user.team_id) : '');
  const totalExp = members.reduce((acc, m) => acc + (m.experience ?? 0), 0);
  const teamLevel = Math.floor(totalExp / 2000);
  const teamName = members.length > 0
    ? `Equipo de ${members[0].firstName}`
    : 'Tu equipo';

  // ——— 7. Renderizado condicional ———

  // Si aún está cargando los logros…
  if (achievementsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#363B41]">
        <p className="text-gray-300">Cargando logros…</p>
      </div>
    );
  }

  // Si hubo un error en fetch de logros…
  if (achievementsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#363B41]">
        <p className="text-red-400">Error cargando logros: {achievementsError}</p>
      </div>
    );
  }

  // ——— 7.1. Función para renderizar cada “tile” de logro ———
  const renderAchievementTile = (ach: AchievementMini, earnedFlag: boolean) => (
    <div
      key={ach.id + (earnedFlag ? '_earned' : '_not')}
      className="relative group"
      onMouseEnter={() => setSelectedAchievement(ach)}
      onMouseLeave={() => setSelectedAchievement(null)}
    >
      <div
        className={`
          bg-gray-50
          p-4
          rounded-lg
          flex flex-col items-center
          transform transition-all duration-300
          group-hover:scale-105 group-hover:shadow-lg
          cursor-pointer
          ${earnedFlag ? '' : 'opacity-50'}
        `}
      >
        {ach.icon ? (
          <img
            src={ach.icon}
            alt={ach.name}
            className="w-8 h-8 mb-3 object-contain"
          />
        ) : (
          <div className="text-gray-400 group-hover:text-red-500 transition-colors mb-3">
            <Star className="w-8 h-8" />
          </div>
        )}
        <h3 className="text-sm font-medium text-center">{ach.name}</h3>
      </div>

      {selectedAchievement?.id === ach.id && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-xl p-4 animate-fade-in">
          <h3 className="font-bold text-sm mb-1">{ach.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{ach.topic}</p>
          <p className="text-xs text-gray-500">{ach.description}</p>
        </div>
      )}
    </div>
  );

  // ——— 7.2. Si el usuario solicita “ver todos los logros” ———
  if (showAllAchievements) {
    return (
      <div className="min-h-screen bg-[#363B41] text-black p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setShowAllAchievements(false)}
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 p-2 rounded-md mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          {/* — Logros Ganados — */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Logros Ganados</h2>
            {Object.entries(earnedByCategory).length === 0 && (
              <p className="text-gray-300">No tienes logros ganados aún.</p>
            )}
            {Object.entries(earnedByCategory).map(([category, lista]) => (
              <div key={category} className="bg-white rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {lista.map((ach: AchievementMini) =>
                    renderAchievementTile(ach, true)
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* — Logros Pendientes — */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Logros Pendientes</h2>
            {Object.entries(notEarnedByCategory).length === 0 && (
              <p className="text-gray-300">No hay logros pendientes.</p>
            )}
            {Object.entries(notEarnedByCategory).map(([category, lista]) => (
              <div key={category} className="bg-white rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {lista.map((ach: AchievementMini) =>
                    renderAchievementTile(ach, false)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ——— 7.3. Pantalla principal del Dashboard (vista previa) ———
  return (
    <div className="min-h-screen bg-[#363B41] text-black p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* === PERFIL === */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Perfil</h2>
            <button
              className="text-red-500 hover:text-red-600"
              onClick={() => navigate('/profile')}
            >
              Ver más
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-4">
              {user.profilePicture ? (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600">
                    {user.firstName?.[0] || ''}
                    {user.lastName?.[0] || ''}
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{user.firstName} {user.lastName}</span>
                  {user.nationality ? (
                    <CountryName code={user.nationality} />
                  ) : (
                    <span className="text-sm text-gray-500">Nacionalidad no disponible</span>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <h3 className="font-semibold">Progreso</h3>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Nivel {Math.floor(user.experience / 1000)}</span>
                  <span>{user.experience} XP</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${(user.experience % 1000) / 10}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === DESAFÍOS SEMANALES === */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Desafíos Semanales</h2>
          <div className="space-y-4">
            <button
              className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg flex justify-between items-center"
              onClick={() => navigate('/tasks')}
            >
              <span>Completar tareas</span>
              <ChevronRight />
            </button>
            <button
              className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg flex justify-between items-center"
              onClick={() => navigate('/problems')}
            >
              <span>Resolver problema</span>
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* === BOT === */}
        <div
          className="bg-white rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/bot-store')}
        >
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">
              {purchasedBot ? purchasedBot.name : 'Bot Mahindra'}
            </h2>
            {purchasedBot ? (
              <div>
                <img
                  src={purchasedBot.imageUrl}
                  alt={purchasedBot.name}
                  className="w-32 h-32 mx-auto object-cover rounded-lg mb-4"
                />
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < purchasedBot.proficiency
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  {purchasedBot.abilities.slice(0, 2).map((ability, idx) => (
                    <div key={idx} className="bg-gray-100 p-2 rounded text-sm">
                      {ability}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Bot className="w-32 h-32 mx-auto text-gray-400" />
            )}
          </div>
        </div>

        {/* === EQUIPO === */}
        <div className="bg-white rounded-lg p-6 shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Equipo</h2>
            {user.team_id && (
              <button
                className="text-red-500 hover:text-red-600"
                onClick={() => navigate(`/team/${user.team_id}`)}
              >
                Ver más
              </button>
            )}
          </div>

          {!user.team_id ? (
            <div className="text-center bg-gray-50 rounded-lg p-6">
              <p className="text-lg font-semibold mb-4 text-gray-700">
                Aún no perteneces a un equipo.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => navigate('/teams/create')}
                >
                  Crear equipo
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => navigate('/teams/join')}
                >
                  Unirse a un equipo
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4" />
                  {teamName}
                </h3>
                <div className="flex justify-between text-xs mb-1">
                  <span>Nivel {teamLevel}</span>
                  <span>{totalExp} exp</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(((totalExp % 2000) / 2000) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {teamLoading ? (
                  <p className="text-gray-500">Cargando miembros…</p>
                ) : (
                  members.map(member => (
                    <div
                      key={member.id}
                      className="bg-gray-50 p-4 rounded-lg flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 w-1/3">
                        <img
                          src={member.profilePicture || 'https://via.placeholder.com/40'}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium">
                          {member.firstName} {member.lastName}
                        </span>
                      </div>
                      <div className="w-1/4 text-sm text-gray-500">
                        <CountryName code={member.nationality ?? ''} />
                      </div>
                      <div className="w-1/6 flex items-center gap-1 justify-center">
                        <span className="font-medium">Nivel {member.level ?? 1}</span>
                      </div>
                      <div className="w-1/6 text-right text-gray-500">
                        {member.coins ?? 0} exp
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* === LOGROS E INSIGNIAS (PREVIEW) === */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Logros e Insignias</h2>
            <button
              onClick={() => setShowAllAchievements(true)}
              className="text-red-500 hover:text-red-600"
            >
              Ver más
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {earned.slice(0, 6).map(ea => (
              // ea.achievement es el AchievementMini
              renderAchievementTile(ea.achievement, true)
            ))}
            {/* Si tienes menos de 6 ganados, opcionalmente puedes mostrar algunos “notEarned” aquí */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;