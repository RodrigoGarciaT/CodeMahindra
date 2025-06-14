import React from "react"
import { motion } from "framer-motion"
import type { User } from "@/types/user"

const getFlagForUser = (user: User | undefined): string => {
  if (!user || !user.nationality) {
    return "https://flagcdn.com/w320/us.png"
  }

  const nationalityToFlag: Record<string, string> = {
    // América
    AR: "https://flagcdn.com/w320/ar.png",
    BO: "https://flagcdn.com/w320/bo.png",
    BR: "https://flagcdn.com/w320/br.png",
    CL: "https://flagcdn.com/w320/cl.png",
    CO: "https://flagcdn.com/w320/co.png",
    CR: "https://flagcdn.com/w320/cr.png",
    CU: "https://flagcdn.com/w320/cu.png",
    DO: "https://flagcdn.com/w320/do.png",
    EC: "https://flagcdn.com/w320/ec.png",
    SV: "https://flagcdn.com/w320/sv.png",
    GT: "https://flagcdn.com/w320/gt.png",
    HN: "https://flagcdn.com/w320/hn.png",
    MX: "https://flagcdn.com/w320/mx.png",
    NI: "https://flagcdn.com/w320/ni.png",
    PA: "https://flagcdn.com/w320/pa.png",
    PY: "https://flagcdn.com/w320/py.png",
    PE: "https://flagcdn.com/w320/pe.png",
    PR: "https://flagcdn.com/w320/pr.png",
    UY: "https://flagcdn.com/w320/uy.png",
    VE: "https://flagcdn.com/w320/ve.png",
    US: "https://flagcdn.com/w320/us.png",
    CA: "https://flagcdn.com/w320/ca.png",

    // Europa
    DE: "https://flagcdn.com/w320/de.png",
    ES: "https://flagcdn.com/w320/es.png",
    FR: "https://flagcdn.com/w320/fr.png",
    GB: "https://flagcdn.com/w320/gb.png",
    IT: "https://flagcdn.com/w320/it.png",
    NL: "https://flagcdn.com/w320/nl.png",
    PT: "https://flagcdn.com/w320/pt.png",
    BE: "https://flagcdn.com/w320/be.png",
    CH: "https://flagcdn.com/w320/ch.png",
    AT: "https://flagcdn.com/w320/at.png",
    SE: "https://flagcdn.com/w320/se.png",
    NO: "https://flagcdn.com/w320/no.png",
    DK: "https://flagcdn.com/w320/dk.png",
    FI: "https://flagcdn.com/w320/fi.png",
    IE: "https://flagcdn.com/w320/ie.png",
    PL: "https://flagcdn.com/w320/pl.png",
    CZ: "https://flagcdn.com/w320/cz.png",
    HU: "https://flagcdn.com/w320/hu.png",
    RO: "https://flagcdn.com/w320/ro.png",

    // Asia
    CN: "https://flagcdn.com/w320/cn.png",
    JP: "https://flagcdn.com/w320/jp.png",
    KR: "https://flagcdn.com/w320/kr.png",
    IN: "https://flagcdn.com/w320/in.png",

    // Otros
    AU: "https://flagcdn.com/w320/au.png",
    NZ: "https://flagcdn.com/w320/nz.png",
    ZA: "https://flagcdn.com/w320/za.png",

    // Fallback
    "NO ESPECIFICADO": "https://flagcdn.com/w320/us.png",
  }

  return (
    nationalityToFlag[user.nationality?.toUpperCase?.()] ||
    nationalityToFlag["NO ESPECIFICADO"]
  )
}

type PodiumUserCardProps = {
  user?: User
  place: number
}

const PodiumUserCard: React.FC<PodiumUserCardProps> = ({ user, place }) => {
  const pedestalHeights: Record<number, number> = {
    1: 260,
    2: 200,
    3: 160
  }
  const positions: Record<number, { order: number; marginTop: number }> = {
    1: { order: 2, marginTop: 0 },
    2: { order: 1, marginTop: 60 },
    3: { order: 3, marginTop: 100 }
  }

  return (
    <div
      className="flex flex-col items-center"
      style={{ order: positions[place].order }}
    >
      {/* Crown for first place */}
      {place === 1 && (
        <motion.div
          className="mb-2 w-14 h-14 bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg flex items-center justify-center text-3xl"
          style={{
            clipPath: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
          }}
          initial={{ y: -10 }}
          animate={{ y: [-5, 0, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          👑
        </motion.div>
      )}

      {/* User info */}
      <div
        className="flex flex-col items-center mb-4"
        style={{ marginTop: positions[place].marginTop }}
      >
        <img
          src={user?.profileEpic || "/default-avatar.png"}
          alt={user?.name || `Player ${place}`}
          className={`w-20 h-20 rounded-full object-cover mb-2 ${
            place === 1 ? "border-4 border-yellow-400" : "border-2 border-red-500"
          }`}
        />
        <img
          src={getFlagForUser(user)}
          alt="Flag"
          className="w-10 h-10 rounded-md border border-gray-800 mb-2"
        />
        <p className="text-white text-xl font-bold text-center">
          {user?.name || "Anonymous"}
        </p>
        <p className="text-sm text-gray-300 text-center mb-1">
          {user?.team || "Sin equipo"}
        </p>
        <p className="bg-red-500 text-white px-5 py-2 rounded-full font-bold">
          {user?.experience?.toLocaleString() || "0"} XP
        </p>
      </div>

      {/* Pedestal */}
      <motion.div
        className={`w-[180px] mx-2 ${
          place === 1 ? "z-10" : ""
        } ${
          place === 1
            ? "bg-gradient-to-b from-red-400 to-red-500"
            : "bg-gradient-to-b from-red-500 to-red-600"
        } rounded-t-md shadow-xl flex items-center justify-center text-white text-[120px] font-bold`}
        style={{ height: pedestalHeights[place] }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: place === 2 ? 0.1 : place === 3 ? 0.2 : 0,
          type: "spring"
        }}
      >
        {place}
      </motion.div>
    </div>
  )
}

export default PodiumUserCard
