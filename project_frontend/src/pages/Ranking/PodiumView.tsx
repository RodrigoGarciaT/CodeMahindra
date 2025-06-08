import type React from "react"
import type { User } from "@/types/user"
import PodiumUserCard from "./PodiumUserCard"

type PodiumViewProps = {
  topUsers: User[]
}

const PodiumView: React.FC<PodiumViewProps> = ({ topUsers }) => {
  const podiumUsers = [...topUsers].sort((a, b) => b.experience - a.experience).slice(0, 3)

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Background circles */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-gray-700 opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gray-700 opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gray-700 opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-gray-700 opacity-50"></div>
        </div>
      </div>

      {/* Podium */}
      <div className="relative z-10 flex items-end justify-center gap-4 mt-8">
        <PodiumUserCard user={podiumUsers[1]} place={2} />
        <PodiumUserCard user={podiumUsers[0]} place={1} />
        <PodiumUserCard user={podiumUsers[2]} place={3} />
      </div>
    </div>
  )
}

export default PodiumView