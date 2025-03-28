import type React from "react"
import type { User } from "../types/user";
import { motion } from "framer-motion"

type PodiumViewProps = {
  topUsers: User[]
}

const PodiumView: React.FC<PodiumViewProps> = ({ topUsers }) => {
  // Aseguramos que tenemos exactamente 3 usuarios
  const podiumUsers = topUsers.slice(0, 3)

  // Definimos las alturas y posiciones
  const positions = [
    { number: 1, height: "h-[280px]", user: podiumUsers[0], zIndex: "z-30", delay: 0 },
    { number: 2, height: "h-[200px]", user: podiumUsers[1], zIndex: "z-20", delay: 0.1 },
    { number: 3, height: "h-[160px]", user: podiumUsers[2], zIndex: "z-10", delay: 0.2 },
  ]

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Timer */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-red-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">15m</span>
        </div>
      </motion.div>

      {/* Avatares flotantes */}
      <div className="relative h-[80px] mb-4">
        {positions.map((position, idx) => (
          <motion.div
            key={`avatar-${position.number}`}
            className={`absolute ${idx === 0 ? "left-1/2 transform -translate-x-1/2" : idx === 1 ? "left-[25%] transform -translate-x-1/2" : "left-[75%] transform -translate-x-1/2"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: position.delay + 0.3 }}
          >
            <div className="relative">
              {position.number === 1 && (
                <motion.div
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.7)]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 015 2.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </motion.div>
              )}
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] p-[2px]">
                <img
                  src={position.user.avatar || "/placeholder.svg?height=50&width=50"}
                  alt={position.user.name}
                  className="w-full h-full rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={position.user.flag || "/placeholder.svg?height=20&width=20"}
                    alt="flag"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Podio */}
      <div className="flex justify-center items-end gap-6 h-[350px]">
        {positions.map((position) => (
          <motion.div
            key={position.number}
            className={`${position.zIndex} relative`}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: position.delay + 0.5,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              y: -10,
              transition: { duration: 0.2 },
            }}
          >
            <div
              className={`${position.height} w-28 flex flex-col items-center justify-end rounded-t-lg overflow-hidden`}
              style={{
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(220, 38, 38, 0.3)",
                background: "linear-gradient(to bottom, #e74c3c, #c0392b)",
              }}
            >
              <div className="flex-1 w-full flex items-center justify-center">
                <motion.span
                  className="text-white text-8xl font-bold"
                  style={{
                    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                  }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: position.delay + 0.8,
                  }}
                >
                  {position.number}
                </motion.span>
              </div>
              <div
                className="bg-gradient-to-r from-red-700 to-red-600 w-full py-3 px-1 flex flex-col items-center"
                style={{
                  boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                <span className="text-white text-sm font-medium truncate w-full text-center">{position.user.name}</span>
                <span className="text-white text-xs">{position.user.points.toLocaleString()} QP</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default PodiumView