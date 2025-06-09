import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, Sparkles, Users } from "lucide-react";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setError("Team name cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/teams/create-and-assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: teamName,
          creationDate: new Date().toISOString(),
          terminationDate: null,
          experience: 0,
          level: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to create and assign the team");

      const team = await res.json();
      navigate(`/team/${team.id}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1C1E] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-2xl bg-white text-[#1A1C1E] shadow-[0_0_30px_rgba(255,0,0,0.25)] border-2 border-red-600 overflow-hidden p-8"
      >
        {/* Decorative Sparkle */}
        <div className="absolute -top-6 -right-6 opacity-20 text-red-600">
          <Sparkles size={80} />
        </div>

        {/* Title */}
        <div className="flex items-center justify-center text-red-600 mb-4">
          <Users size={34} className="mr-2" />
          <h2 className="text-3xl font-bold tracking-tight">Create a New Team</h2>
        </div>

        <p className="text-center text-sm text-gray-700 mb-6">
          Give your team a strong identity and start earning XP together.
        </p>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter your team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-red-400 focus:ring-2 focus:ring-red-500 outline-none mb-4 placeholder-gray-400"
        />

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mb-2 text-center"
          >
            {error}
          </motion.p>
        )}

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleCreateTeam}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-pink-600 hover:to-red-700 text-white font-semibold shadow-md transition-all duration-300"
        >
          <PlusCircle size={20} />
          Create Team
        </motion.button>
      </motion.div>
    </div>
  );
}
