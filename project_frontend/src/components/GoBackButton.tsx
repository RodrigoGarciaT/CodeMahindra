import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GoBackButtonProps {
  to?: any;
  label?: string;
}

export default function GoBackButton({ to = -1, label = "Go back" }: GoBackButtonProps) {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(to)}
      initial={{ scale: 1, y: 0 }}
      whileHover={{
        scale: 1.06,
        y: -4,
        boxShadow: "0px 10px 20px rgba(255, 94, 58, 0.6)",
        backgroundPosition: "100% 0",
      }}
      whileTap={{
        scale: 0.94,
        y: 1,
        boxShadow: "0px 4px 8px rgba(255, 94, 58, 0.3)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative px-6 py-3 mb-6 rounded-xl border border-red-500 text-white font-semibold tracking-wide
                 bg-gradient-to-r from-[#ff003c] to-[#ff5e3a] 
                 shadow-[0_6px_0_#b91c1c] 
                 hover:shadow-[0_10px_20px_rgba(255,94,58,0.5)] 
                 active:shadow-[0_3px_0_#991b1b] 
                 focus:outline-none overflow-hidden"
    >
      <span className="relative z-10 flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" />
        {label}
      </span>

      {/* Highlight beam */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.15, x: "120%" }}
        transition={{
          duration: 1.4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="absolute top-0 left-[-75%] w-[50%] h-full bg-white opacity-10 rotate-[25deg] blur-xl z-0"
      />

      {/* Glow outer ring */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut",
        }}
        className="absolute -inset-2 rounded-xl bg-gradient-to-r from-[#ff003c] to-[#ff5e3a] blur-2xl opacity-30 z-[-1]"
      />
    </motion.button>
  );
};
