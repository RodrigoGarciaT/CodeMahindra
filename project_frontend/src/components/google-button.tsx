import { useEffect } from "react";
declare const google: any; // Asegúrate de declarar google de manera global
import { useNavigate } from "react-router-dom";

export default function GoogleButton() {
  const navigate = useNavigate();

  // Aquí defines la función handleGoogleResponse
  const handleGoogleResponse = async (response: any) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirige dependiendo si es un usuario nuevo o ya existente
        if (data.user.firstName === "Google User") {
          navigate("/complete-profile"); // Usuario nuevo sin datos completos
        } else {
          navigate("/dashboard"); // Usuario existente
        }
      } else {
        const errorText = await res.text();
        console.error("Error en el backend:", errorText);
      }
    } catch (error) {
      console.error("Error en login con Google:", error);
    }
  };
  
  // El hook useEffect para inicializar el botón de Google
  useEffect(() => {
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse, // Aquí pasas handleGoogleResponse como el callback
      });

      const googleButtonContainer = document.getElementById("google-button");
      if (googleButtonContainer) {
        google.accounts.id.renderButton(
          googleButtonContainer, // Asegúrate de que el contenedor existe
          { theme: "outline", size: "large" }
        );
      } else {
        console.error("No se encontró el contenedor para el botón de Google.");
      }
    } else {
      console.error("Google SDK no cargado correctamente");
    }
  }, []);

  return (
    <div id="google-button-container" className="w-full">
      <div id="google-button"></div> {/* Este es el contenedor donde se renderiza el botón */}
    </div>
  );
}
