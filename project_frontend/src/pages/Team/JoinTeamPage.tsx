import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Sparkles } from "lucide-react";

export default function JoinTeamPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/teams/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ team_code: code }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to join the team");
      }

      setSuccess("You successfully joined the team!");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err: any) {
      setError(err?.message || "Unknown error occurred");
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
        <div className="absolute -top-6 -left-6 opacity-20 text-red-500">
          <Sparkles size={80} />
        </div>

        {/* Title */}
        <div className="flex items-center justify-center text-red-600 mb-4">
          <Users size={34} className="mr-2" />
          <h2 className="text-3xl font-bold tracking-tight">Join a Team</h2>
        </div>

        <p className="text-center text-sm text-gray-700 mb-6">
          Enter the team code shared with you to join and start your journey.
        </p>

        <input
          type="text"
          placeholder="Team code"
          className="w-full px-4 py-2 rounded-lg border-2 border-red-400 focus:ring-2 focus:ring-red-500 outline-none mb-4 placeholder-gray-500"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mb-2 text-center"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-500 text-sm mb-2 text-center"
          >
            {success}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleJoin}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-pink-600 hover:to-red-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
        >
          <ShieldCheck size={20} />
          Join Team
        </motion.button>
      </motion.div>
    </div>
  );
}
