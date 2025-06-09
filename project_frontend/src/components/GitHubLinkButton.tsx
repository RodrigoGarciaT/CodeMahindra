import { Github } from "lucide-react"
import { motion } from "framer-motion"

type GitHubLinkButtonProps = {
  redirectUrl: string
  text?: string
}

export default function GitHubLinkButton({
  redirectUrl,
  text = "Link GitHub Account",
}: GitHubLinkButtonProps) {
  const handleClick = () => {
    window.location.href = redirectUrl
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{
        scale: 1.1,
        rotateX: 5,
        rotateY: -5,
        boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
      }}
      whileTap={{ scale: 0.95, rotateX: 0, rotateY: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="relative flex items-center gap-3 px-6 py-3 text-white bg-[#171515] rounded-xl font-bold shadow-xl transition-all overflow-hidden border border-white/10"
    >
      <div className="absolute -inset-px bg-gradient-to-br from-gray-800 to-black rounded-xl blur-sm opacity-30 z-0" />
      <Github size={22} className="z-10" />
      <span className="z-10">{text}</span>
    </motion.button>
  )
}
