import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import botImage from '@/images/robot_male_1.svg'

const FloatingBot: React.FC = () => {
  const botRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 400, y: 200 })
  const [velocity, setVelocity] = useState({ x: 0.8, y: 0.6 })
  const [dialogue, setDialogue] = useState<string | null>(null)
  const [animationClass, setAnimationClass] = useState("bot-animate-fun")
  const [visible, setVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [botImageUrl, setBotImageUrl] = useState(botImage); // por defecto el actual

  const expressions = [
    "Hi! 🤖", "Yay! 🎉", "?!", ":D", "!!", "Hehe 😄", "<3 ❤️", "Oof 😅", "Bzzt! ⚡", "Uh? 🤔", "*blip*", "+1 👍", "Hey!", "Yo!", "Woop! 🙌",
    ":O 😲", "Eep!", "Ping!", "Zzz 💤", "!", "Boop", "?", ":3", "Ok!", "Ack!", "Wee!", "Woo!", "Yup!", "Bam! 💥", "Ding!", "Nom! 🍪", "Bloop!", "...",
    "Aha!", "Omg! 😱", "O.o", ":)", "Nah", "Yep", "Oops!", "Yikes! 😬", "Huh", "Yo!", "Ssshh 🤫", "Cool 😎", "Bip!", "Gone! 🛸", "Zoom!", "Yeehaw! 🤠",
    "Wow! 🤩", "Nice! 😎", "Glitch? 🤖", "Wait! ⏳", "Flyin'! 🛫", "Spin! 🌀", "Boom! 💣", "Pop! 🎈", "Eek!", "Pow! 💢",
    "Whoosh! 🌪️", "Shiny! ✨", "Brrr! ❄️", "Kaboom! 💥", "Zap! ⚡", "Meep! 🤖", "Nyoom! 🚀", "Blink! 💫"
  ];

  useEffect(() => {
    const fetchEquippedBot = async () => {
      try {
        const employeeId = localStorage.getItem("user_id");
        if (!employeeId) return;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bots/employee/${employeeId}/equipped`);
        if (!res.ok) return;

        const data = await res.json();
        if (data.image) {
          setBotImageUrl(data.image);
        }
      } catch (error) {
        console.error("Error loading equipped bot:", error);
      }
    };

    fetchEquippedBot();
  }, []);

  // Movement physics
  useEffect(() => {
    const update = () => {
      setPosition((prev) => {
        let newX = prev.x + velocity.x
        let newY = prev.y + velocity.y

        // Bounce off edges with some padding
        if (newX < 50 || newX > window.innerWidth - 50) {
          setVelocity((v) => ({ ...v, x: -v.x }))
        }
        if (newY < 50 || newY > window.innerHeight - 50) {
          setVelocity((v) => ({ ...v, y: -v.y }))
        }

        // Keep within bounds
        newX = Math.max(50, Math.min(window.innerWidth - 50, newX))
        newY = Math.max(50, Math.min(window.innerHeight - 50, newY))

        return { x: newX, y: newY }
      })
    }

    const interval = setInterval(update, 16)
    return () => clearInterval(interval)
  }, [velocity])

  // Random behaviors
  useEffect(() => {
    const interval = setInterval(() => {
      if (isHovered) return // Don't interrupt when user is interacting

      const chance = Math.random()
      const randomExpression = expressions[Math.floor(Math.random() * expressions.length)]

      if (chance < 0.2) {
        setDialogue(randomExpression)
        setTimeout(() => setDialogue(null), 2500)
      } else if (chance < 0.35) {
        setAnimationClass("bot-spin-fast")
        setTimeout(() => setAnimationClass("bot-animate-fun"), 2000)
      } else if (chance < 0.5) {
        setAnimationClass("bot-bounce")
        setTimeout(() => setAnimationClass("bot-animate-fun"), 1800)
      } else if (chance < 0.65) {
        setAnimationClass("bot-twirl")
        setTimeout(() => setAnimationClass("bot-animate-fun"), 3000)
      } else if (chance < 0.75) {
        setAnimationClass("bot-teleport")
        setTimeout(() => {
          setVisible(false)
          setTimeout(() => {
            setPosition({
              x: Math.random() * (window.innerWidth - 200) + 100,
              y: Math.random() * (window.innerHeight - 200) + 100,
            })
            setVisible(true)
            setAnimationClass("bot-appear")
            setTimeout(() => setAnimationClass("bot-animate-fun"), 1000)
          }, 600)
        }, 1200)
      } else if (chance < 0.85) {
        setAnimationClass("bot-pulse")
        setTimeout(() => setAnimationClass("bot-animate-fun"), 2000)
      } else {
        setAnimationClass("bot-cinematic-zoom")
        setTimeout(() => setAnimationClass("bot-animate-fun"), 1800)
      }
    }, 7000)

    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <>
      <motion.div
        ref={botRef}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          pointerEvents: "auto",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{
          scale: 1.2,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
      >
        {/* Floating particles around bot */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs opacity-60"
              style={{
                left: `${-10 + i * 8}px`,
                top: `${-10 + (i % 3) * 8}px`,
              }}
              animate={{
                y: [-5, 5, -5],
                opacity: [0.3, 0.8, 0.3],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            >
              {["✨", "⚡", "💫", "🔧", "🎯", "💎"][i]}
            </motion.div>
          ))}
        </div>

        {/* Bot glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-xl"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Main bot image */}
        <AnimatePresence>
          {visible && (
            <motion.img
              src={botImageUrl}
              alt="Floating Bot"
              className={`w-20 h-20 relative z-10 ${animationClass} bot-trail cursor-pointer`}
              draggable={false}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{
                rotate: [0, 10, -10, 0],
                transition: { duration: 0.5 },
              }}
            />
          )}
        </AnimatePresence>

        {/* Enhanced dialogue bubble */}
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
                {dialogue}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white/95" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 border-2 border-red-500/30 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 border-2 border-blue-500/30 rounded-full"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>

      <style>{`
        @keyframes floatRotatePlay {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-6px) rotate(8deg) scale(1.05);
          }
          50% {
            transform: translateY(3px) rotate(-4deg) scale(1);
          }
          75% {
            transform: translateY(-4px) rotate(12deg) scale(1.08);
          }
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
        }

        .bot-animate-fun {
          animation: floatRotatePlay 8s ease-in-out infinite;
        }

        @keyframes spinFast {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        .bot-spin-fast {
          animation: spinFast 2s ease-in-out;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-25px) scale(1.1);
          }
          50% {
            transform: translateY(-15px) scale(0.95);
          }
          75% {
            transform: translateY(-30px) scale(1.05);
          }
        }

        .bot-bounce {
          animation: bounce 1.8s ease-in-out;
        }

        @keyframes twirl {
          0% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(360deg) scale(1.3);
          }
          50% {
            transform: rotate(720deg) scale(0.8);
          }
          75% {
            transform: rotate(1080deg) scale(1.2);
          }
          100% {
            transform: rotate(1440deg) scale(1);
          }
        }

        .bot-twirl {
          animation: twirl 3s ease-in-out;
        }

        @keyframes cinematicZoom {
          0% {
            transform: scale(1) rotate(0deg);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.5) rotate(10deg);
            filter: brightness(1.3);
          }
          100% {
            transform: scale(1) rotate(0deg);
            filter: brightness(1);
          }
        }

        .bot-cinematic-zoom {
          animation: cinematicZoom 1.8s ease-in-out;
        }

        @keyframes teleport {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
            filter: blur(0px);
          }
          50% {
            transform: scale(0.3) rotate(180deg);
            opacity: 0.5;
            filter: blur(2px);
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
            filter: blur(5px);
          }
        }

        .bot-teleport {
          animation: teleport 1.2s ease-in forwards;
        }

        @keyframes appear {
          0% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
            filter: blur(5px);
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
            filter: blur(1px);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
            filter: blur(0px);
          }
        }

        .bot-appear {
          animation: appear 1s ease-out;
        }

        @keyframes pulseAura {
          0% {
            filter: drop-shadow(0 0 0 rgba(239, 68, 68, 0.5));
          }
          25% {
            filter: drop-shadow(0 0 15px rgba(147, 51, 234, 0.8));
          }
          50% {
            filter: drop-shadow(0 0 25px rgba(59, 130, 246, 0.8));
          }
          75% {
            filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.8));
          }
          100% {
            filter: drop-shadow(0 0 0 rgba(239, 68, 68, 0.5));
          }
        }

        .bot-pulse {
          animation: pulseAura 2s ease-in-out;
        }

        .bot-trail {
          filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
          transition: filter 0.3s ease;
        }

        .bot-trail:hover {
          filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.9));
        }
      `}</style>
    </>
  )
}

export default FloatingBot
