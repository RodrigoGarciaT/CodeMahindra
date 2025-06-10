"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, MessageSquare, ChevronDown, Sparkles, Zap, Activity } from "lucide-react"

type BotCommentProps = {
  comment: string
}

const BotCommentBanner = ({ comment }: BotCommentProps) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative my-4"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/5 to-red-500/10 rounded-2xl blur-lg"
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
      <motion.div
        onClick={() => setExpanded(!expanded)}
        className={`
          relative cursor-pointer bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 
          rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300
          ${expanded ? "border-red-500/50 shadow-red-500/20" : "border-red-500/30 hover:border-red-500/50"}
        `}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.05)_25px,rgba(255,255,255,0.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,0.05)_75px,rgba(255,255,255,0.05)_76px,transparent_77px),linear-gradient(rgba(255,255,255,0.05)_24px,transparent_25px,transparent_26px,rgba(255,255,255,0.05)_27px,rgba(255,255,255,0.05)_74px,transparent_75px,transparent_76px,rgba(255,255,255,0.05)_77px)] bg-[length:30px_30px]" />
        </div>

        {/* Header section */}
        <div className="relative p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/30 border-b border-red-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Bot Avatar */}
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-lg opacity-40"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Bot Icon Container */}
                <div className="relative w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center border border-red-500/30 shadow-lg">
                  <Bot className="w-7 h-7 text-red-400" />

                  {/* Activity indicator */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Activity className="w-2 h-2 text-slate-900" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Bot Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-400 text-lg">AI Assistant</span>
                  <motion.div
                    className="px-2 py-1 bg-red-500/20 rounded-full text-xs text-red-300 border border-red-500/30"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    Feedback
                  </motion.div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MessageSquare className="w-3 h-3" />
                  <span>Code Review Comment</span>
                </div>
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <div className="flex items-center gap-2">
              <motion.div
                className="flex items-center gap-1 text-gray-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Zap className="w-3 h-3" />
                <span className="text-xs">Smart</span>
              </motion.div>

              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-red-400"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Comment Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="relative p-4">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5" />

                {/* Comment text */}
                <div className="relative">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-300">Analysis Result</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30"
                  >
                    <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{comment}</p>
                  </motion.div>

                  {/* Decorative elements */}
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>AI Generated</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Powered by AI</span>
                      <Bot className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection indicator */}
        <div className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full transform -translate-y-1/2" />

        {/* Floating particles when collapsed */}
        {!expanded && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-400 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                }}
                animate={{
                  y: [-5, 5, -5],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default BotCommentBanner
