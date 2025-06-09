//import React from "react";
import { Github } from "lucide-react";  // usa tu librería actual de íconos

type GitHubLinkButtonProps = {
  redirectUrl: string;
  text?: string;
};

export default function GitHubLinkButton({ redirectUrl, text = "Link GitHub Account" }: GitHubLinkButtonProps) {
  const handleClick = () => {
    window.location.href = redirectUrl;
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition text-base"
    >
      <Github size={20} />
      {text}
    </button>
  );
}
