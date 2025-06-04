import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import botImage from "../../../../images/robot_male_1.svg";

type Props = {
  summary: string;
};

export default function CommitSummary({ summary }: Props) {
  const [visibleText, setVisibleText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    const speed = 4;
    const interval = setInterval(() => {
      if (i < summary.length) {
        setVisibleText((prev) => prev + summary.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [summary]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex items-start gap-4 bg-[#12161c] p-6 rounded-2xl shadow-[0_0_12px_rgba(0,0,0,0.4)]"
    >
      {/* Bot avatar with gentle floating */}
      <motion.div
        className="relative"
        initial={{ y: 0 }}
        animate={{ y: -6 }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <img
          src={botImage}
          alt="Bot Mahindra"
          className="w-20 h-20 object-contain drop-shadow-[0_0_10px_rgba(255,75,75,0.35)]"
        />
      </motion.div>

      {/* Chat bubble */}
      <div className="relative bg-[#1b1f27] border border-[#2c313a] rounded-xl px-5 py-4 shadow-md w-full">
        {/* Bot name */}
        <div className="mb-2 text-sm font-semibold text-yellow-500">Bot Mahindra</div>

        {/* Typing text */}
        <p className="whitespace-pre-line font-mono text-gray-100 text-sm leading-relaxed tracking-wide">
          {visibleText}
          {isTyping && <span className="ml-1 text-red-700 animate-pulse">|</span>}
        </p>

        {/* Bubble arrow */}
        <div className="absolute top-6 -left-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#1b1f27]" />
      </div>
    </motion.div>
  );
}
