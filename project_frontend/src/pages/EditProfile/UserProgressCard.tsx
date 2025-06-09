import { motion } from "framer-motion";

interface Props {
  experience: number;
}

export default function UserProgressCard({ experience }: Props) {
  const level = Math.floor(experience / 1000);
  const currentXP = experience % 1000;
  const xpToNextLevel = 1000 - currentXP;
  const progressPercent = currentXP / 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mt-8 text-gray-900"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Progress</h2>

      <div className="mb-2 flex justify-between items-center text-sm font-medium text-gray-700">
        <span>Level {level}</span>
        <span>{experience} XP</span>
      </div>

      <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1 }}
        />
      </div>

      <p className="text-sm text-gray-600 mt-3">
        You need <span className="font-semibold text-red-600">{xpToNextLevel} XP</span> to reach the next level.
      </p>
    </motion.div>
  );
}
