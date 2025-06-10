"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const botImage = "/placeholder.svg?height=112&width=112"

const expressions = [
  "Hi! 🤖", "Yay! 🎉", "?!", ":D", "!!", "Hehe 😄", "<3 ❤️", "Oof 😅", "Bzzt! ⚡", "Uh? 🤔", "*blip*", "+1 👍", "Hey!", "Yo!", "Woop! 🙌",
  ":O 😲", "Eep!", "Ping!", "Zzz 💤", "!", "Boop", "?", ":3", "Ok!", "Ack!", "Wee!", "Woo!", "Yup!", "Bam! 💥", "Ding!", "Nom! 🍪", "Bloop!", "...",
  "Aha!", "Omg! 😱", "O.o", ":)", "Nah", "Yep", "Oops!", "Yikes! 😬", "Huh", "Yo!", "Ssshh 🤫", "Cool 😎", "Bip!", "Gone! 🛸", "Zoom!", "Yeehaw! 🤠",
  "Wow! 🤩", "Nice! 😎", "Glitch? 🤖", "Wait! ⏳", "Flyin'! 🛫", "Spin! 🌀", "Boom! 💣", "Pop! 🎈", "Eek!", "Pow! 💢", "Whoosh! 🌪️", "Shiny! ✨", "Brrr! ❄️",
  "Kaboom! 💥", "Zap! ⚡", "Meep! 🤖", "Nyoom! 🚀", "Blink! 💫",
  "Analyzing PR... 🔍", "Running tests... 🧪", "Merging commits... 🔧", "Review ready! ✅",
  "Leveling up... 🔺", "Ranking updated! 🏆", "Solving problem... 💡", "Task in progress... 📝",
  "Refactor mode! ♻️", "Syntax clean! 🧼", "Clean code vibes ✨", "XP gained! 🧠", "Review bot engaged 🤖",
  "Challenge accepted! 🧩", "Let's code! 👨‍💻", "Evaluating AI feedback... 🤓", "New badge unlocked! 🥇",
  "Retro incoming 🔁", "Commit digest ready 📦", "Diff loaded 🪄", "Rewriting history... ⌛",
  "Error? Never heard of it 🛡️", "Target acquired 🎯", "Deploying suggestions... 🚀",
  "JIRA synced 📋", "One more PR! 🙌", "Refactor complete 💅", "Rank climbing ⛰️",
  "Checklist complete ✅", "Ship it! 🚢", "Pull request approved 👍", "XP overflow! 📈",
  "Unit tests pass! ✔️", "Red to green 🟩", "Code smells detected 👃", "Fixing issues... 🛠️",
  "Achievement unlocked! 🏅", "Just another sprint 🏃‍♂️", "Feedback loop active 🔁",
  "Merge conflict? Nah 😎", "Push complete 🧨", "Awaiting approval 🔒", "Branch dancing 🌿",
  "Learning mode: ON 📚", "Analyzing diff... 🧠", "Code Mahindra at your service 🤖",
  "Retro sent! 📮", "New insight! 🌟", "Optimizing... ⏱️", "Debugger launched 🪲",
  "Another challenge? Bring it! 💪", "Autofix magic 🧙", "Score boosted! 🔢", "Queueing review... 🛤️",
  "Night shift coder 🌙", "Mahindra scanning 👁️", "Ranking you up... ⬆️", "Patch incoming 🧵",
  "Cool commit 😎", "Status: Reviewing 🔍", "Feedback initialized 💬", "XP loaded! ⚡"
];

type Bot = {
  name: string
  image?: string
  description: string
}

type Props = {
  equippedBot: Bot | null
  purchasedBot: Bot | null
}

const BotSection: React.FC<Props> = ({ equippedBot, purchasedBot }) => {
  const navigate = useNavigate()
  const currentBot = equippedBot || purchasedBot
  const botRef = useRef<HTMLImageElement>(null)
  const [dialogue, setDialogue] = useState<string | null>(null)
  const [animationClass, setAnimationClass] = useState("bot-animate-fun")

  useEffect(() => {
    const interval = setInterval(() => {
      const chance = Math.random()
      const expression = expressions[Math.floor(Math.random() * expressions.length)]

      if (chance < 0.6) {
        setDialogue(expression)
        setTimeout(() => {
          setDialogue(null)
        }, 2800)
      }

      if (chance < 0.2) {
        setAnimationClass("bot-bounce")
        setTimeout(() => setAnimationClass("bot-animate-fun"), 1500)
      } else if (chance < 0.4) {
        setAnimationClass("bot-twirl")
        setTimeout(() => setAnimationClass("bot-animate-fun"), 2000)
      } else {
        setAnimationClass("bot-pulse")
        setTimeout(() => setAnimationClass("bot-animate-fun"), 2000)
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 border border-gray-700/50 text-white rounded-3xl p-3 shadow-2xl hover:shadow-red-500/10 transition-all duration-500 cursor-pointer relative overflow-hidden group"
      onClick={() => navigate("/bot-store")}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.05)_25px,rgba(255,255,255,0.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,0.05)_75px,rgba(255,255,255,0.05)_76px,transparent_77px),linear-gradient(rgba(255,255,255,0.05)_24px,transparent_25px,transparent_26px,rgba(255,255,255,0.05)_27px,rgba(255,255,255,0.05)_74px,transparent_75px,transparent_76px,rgba(255,255,255,0.05)_77px)] bg-[length:100px_100px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 text-lg"
            style={{
              left: `${20 + i * 20}%`,
              top: `${15 + (i % 2) * 30}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            {["🤖", "⚡", "💫", "🔧"][i]}
          </motion.div>
        ))}
      </div>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-bold text-center mb-6 relative z-10 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
      >
        {currentBot?.name || "Mahindra Bot"}
      </motion.h2>

      <div className="flex flex-col items-center justify-center relative z-10">
        {/* Dialogue Bubble */}
        <AnimatePresence>
          {dialogue && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20"
            >
              <div className="bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-2xl font-semibold text-sm whitespace-nowrap max-w-xs shadow-2xl border border-white/20 relative">
                💬 {dialogue}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white/95" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bot Image Container */}
        <motion.div
          className="relative mb-6"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-xl"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Bot Image */}
          <motion.img
            ref={botRef}
            src={currentBot?.image || botImage}
            alt="Bot"
            className={`w-32 h-32 object-contain relative z-10 ${animationClass} filter drop-shadow-lg`}
            draggable={false}
            animate={{
              y: [0, -8, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 border-2 border-red-500/30 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Bot Info */}
        {currentBot && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm px-6 py-2 rounded-2xl border border-gray-700/50 mb-2 max-w-xs">
              <p className="text-sm text-gray-300 leading-relaxed">{currentBot.description}</p>
            </div>

            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${
                equippedBot
                  ? "bg-green-500/20 border-green-500/50 text-green-400"
                  : "bg-gray-700/50 border-gray-600/50 text-gray-400"
              }`}
              animate={{
                scale: equippedBot ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: equippedBot ? Number.POSITIVE_INFINITY : 0,
                ease: "easeInOut",
              }}
            >
              <div className={`w-2 h-2 rounded-full ${equippedBot ? "bg-green-400" : "bg-gray-500"}`} />
              {equippedBot ? "Equipped" : "Not Equipped"}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(239, 68, 68, 0.05), transparent, rgba(59, 130, 246, 0.05))",
            "linear-gradient(45deg, rgba(59, 130, 246, 0.05), transparent, rgba(239, 68, 68, 0.05))",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <style>{`
        @keyframes floatRotatePlay {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(3deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        .bot-animate-fun {
          animation: floatRotatePlay 6s ease-in-out infinite;
        }

        @keyframes bot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .bot-bounce {
          animation: bot-bounce 1.5s ease-in-out;
        }

        @keyframes bot-twirl {
          0% { transform: rotate(0); }
          100% { transform: rotate(720deg); }
        }

        .bot-twirl {
          animation: bot-twirl 2s ease-in-out;
        }

        @keyframes pulseAura {
          0% {
            filter: drop-shadow(0 0 0 rgba(239, 68, 68, 0.5));
          }
          70% {
            filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.8));
          }
          100% {
            filter: drop-shadow(0 0 0 rgba(239, 68, 68, 0.5));
          }
        }

        .bot-pulse {
          animation: pulseAura 2s ease-out;
        }
      `}</style>
    </motion.div>
  )
}

export default BotSection
