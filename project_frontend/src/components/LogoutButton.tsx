import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token guardado
    navigate("/login"); // Redirige al login (ajústalo según tu ruta)
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl shadow"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
