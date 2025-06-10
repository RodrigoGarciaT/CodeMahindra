"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Zap, Brain, Sparkles, Activity, ChevronRight, MessageSquare, Cpu } from "lucide-react"

type Props = {
  summary: string
}

export default function Summary({ summary }: Props) {
  const [visibleText, setVisibleText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    let i = 0;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      if (i < summary.length) {
        setVisibleText((prev) => prev + summary.charAt(i));
        setProgress((i / summary.length) * 100);
        i++;

        const char = summary.charAt(i);
        const delay = /[\s]/.test(char) ? 0 : 0;
        timeoutId = setTimeout(type, delay);
      } else {
        setIsTyping(false);
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 2000);
      }
    };

    type();
    return () => clearTimeout(timeoutId);
  }, [summary]);

  const particles = Array.from({ length: 8 }, (_, i) => i)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
      }}
      className="relative w-full"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/5 to-red-500/10 rounded-3xl blur-xl"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Main container */}
      <div className="relative flex items-start gap-6 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-8 rounded-3xl border border-red-500/20 shadow-2xl overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.05)_25px,rgba(255,255,255,0.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,0.05)_75px,rgba(255,255,255,0.05)_76px,transparent_77px),linear-gradient(rgba(255,255,255,0.05)_24px,transparent_25px,transparent_26px,rgba(255,255,255,0.05)_27px,rgba(255,255,255,0.05)_74px,transparent_75px,transparent_76px,rgba(255,255,255,0.05)_77px)] bg-[length:100px_100px]" />
        </div>

        {/* Bot Avatar Section */}
        <div className="relative flex flex-col items-center">
          {/* Status indicators */}
          <div className="flex gap-1 mb-3">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="w-2 h-2 bg-yellow-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-red-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
            />
          </div>

          {/* Bot Avatar */}
          <motion.div
            className="relative"
            initial={{ scale: 0.8 }}
            animate={{
              scale: [0.8, 1, 0.8],
              y: [-2, 2, -2],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Bot Icon */}
            <div className="relative w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center border border-red-500/30 shadow-lg">
              <Bot className="w-10 h-10 text-red-400" />

              {/* Processing indicator */}
              {isTyping && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Activity className="w-2 h-2 text-slate-900" />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* AI Status */}
          <motion.div
            className="mt-3 flex items-center gap-2 text-xs text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Cpu className="w-3 h-3" />
            <span>AI Processing</span>
          </motion.div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-red-400" />
                <span className="font-bold text-red-400 text-lg">Bot Mahindra</span>
              </div>
              <motion.div
                className="px-2 py-1 bg-red-500/20 rounded-full text-xs text-red-300 border border-red-500/30"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                AI Assistant
              </motion.div>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Smart Analysis</span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-100, 200] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </motion.div>
          </motion.div>

          {/* Message Bubble */}
          <motion.div
            className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-red-500/20 rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            {/* Message indicator */}
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-400">Analysis Result</span>
              <ChevronRight className="w-3 h-3 text-gray-500" />
            </div>

            {/* Typing text */}
            <div className="relative">
              <p className="whitespace-pre-line font-mono text-gray-100 text-sm leading-relaxed tracking-wide">
                {visibleText}
                {isTyping && (
                  <motion.span
                    className="ml-1 text-red-400"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                  >
                    ▊
                  </motion.span>
                )}
              </p>
            </div>

            {/* Completion indicator */}
            <AnimatePresence>
              {!isTyping && (
                <motion.div
                  className="flex items-center gap-2 mt-4 text-green-400 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Zap className="w-4 h-4" />
                  <span>Analysis Complete</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bubble arrow */}
            <div className="absolute top-8 -left-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-slate-800" />
          </motion.div>
        </div>

        {/* Floating particles */}
        <AnimatePresence>
          {showParticles &&
            particles.map((particle) => (
              <motion.div
                key={particle}
                className="absolute w-1 h-1 bg-red-400 rounded-full"
                initial={{
                  x: Math.random() * 400,
                  y: Math.random() * 200,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  y: [null, -50],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: particle * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
