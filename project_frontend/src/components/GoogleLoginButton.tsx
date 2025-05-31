import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google: any;
  }
}

function GoogleLoginButton() {
  const navigate = useNavigate();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      { theme: "outline", size: "large" }
    );
  }, []);

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

        // Aquí redirigimos siempre a /home después de login exitoso
        navigate("/home");
      } else {
        const errorText = await res.text();
        console.error("Error en el backend:", errorText);
      }
    } catch (error) {
      console.error("Error en login con Google:", error);
    }
  };

  return <div id="google-login-button"></div>;
}

export default GoogleLoginButton;
