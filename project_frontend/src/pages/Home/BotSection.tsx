import React from "react"
import { useNavigate } from "react-router-dom"
import { Bot as BotIcon } from "lucide-react"
import type { Bot as BotType } from "../BotStore/Page"

type Props = {
  equippedBot: BotType | null
  purchasedBot: BotType | null
}

const BotSection: React.FC<Props> = ({ equippedBot, purchasedBot }) => {
  const navigate = useNavigate()

  const currentBot = equippedBot || purchasedBot

  return (
    <div
      className="bg-[#1e1e1e] rounded-2xl p-6 shadow-md border border-[#2e2e2e] text-white cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate("/bot-store")}
    >
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">
          {currentBot ? currentBot.name : "Mahindra Bot"}
        </h2>

        {currentBot ? (
          <div>
            <img
              src={currentBot.image || "/placeholder.svg"}
              alt={currentBot.name}
              className="w-32 h-32 mx-auto object-contain rounded-lg mb-4"
            />
            <div className="bg-[#2a2a2a] p-2 rounded text-sm mb-2 text-gray-300">
              {currentBot.description}
            </div>
            <div
              className={`text-xs font-semibold ${
                equippedBot ? "text-green-400" : "text-gray-500"
              }`}
            >
              {equippedBot ? "Equipped" : "Not Equipped"}
            </div>
          </div>
        ) : (
          <BotIcon className="w-32 h-32 mx-auto text-gray-500" />
        )}
      </div>
    </div>
  )
}

export default BotSection
