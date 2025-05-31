import React from "react";
import { Github } from "lucide-react";

const GitHubButton: React.FC = () => {
  const handleGitHubLogin = () => {
    window.location.href = "https://code-mahindra-backend.vercel.app/auth/github"; // 🔁 cambia a tu dominio en producción
  };

  return (
    <button
      onClick={handleGitHubLogin}
      className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
    >
      <Github className="w-5 h-5 mr-2" />
      Iniciar sesión con GitHub
    </button>
  );
};

export default GitHubButton;

import React from "react";
import { Github } from "lucide-react";

const GitHubButton: React.FC = () => {
  const handleGitHubLogin = () => {
    window.location.href = "http://code-mahindra-w4lk.vercel.app/auth/github"; // 🔁 cambia a tu dominio en producción
  };

  return (
    <button
      onClick={handleGitHubLogin}
      className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
    >
      <Github className="w-5 h-5 mr-2" />
      Iniciar sesión con GitHub
    </button>
  );
};

export default GitHubButton;
