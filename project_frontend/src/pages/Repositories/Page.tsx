import { useEffect, useState } from "react";
import { FolderGit2, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type Repo = {
  id: number;
  full_name: string;
  description: string;
  language: string;
  updated_at: string;
  visibility: string;
};

export default function ReposListPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("🔐 Token encontrado en localStorage:", token);

        if (!token) {
          console.warn("⚠️ No se encontró token. Redirigiendo al login...");
          navigate("/"); // redirige al login si no hay token
          return;
        }

        const res = await fetch("http://localhost:8000/github/repos", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📤 Request enviada a backend con headers:", {
          Authorization: `Bearer ${token}`,
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("❌ Error en la respuesta del backend:", text);
          throw new Error("Error al obtener los repositorios");
        }

        const data: Repo[] = await res.json();
        console.log("✅ Repos recibidos:", data);
        setRepos(data);
      } catch (err: any) {
        console.error("💥 Error al hacer fetch:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] to-[#111827] text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Repositorios disponibles</h1>

      {loading ? (
        <p className="text-center text-gray-400">Cargando repositorios...</p>
      ) : error ? (
        <p className="text-center text-red-400">❌ {error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <Link
              key={repo.id}
              to={`/repos/${encodeURIComponent(repo.full_name)}/Dashboard`}
              className="group bg-[#161b22] border border-[#30363d] rounded-2xl p-5 hover:shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <FolderGit2 className="text-red-500" size={24} />
                <h2 className="text-lg font-semibold group-hover:text-red-400 transition-colors">
                  {repo.full_name}
                </h2>
                <ChevronRight className="ml-auto text-gray-500 group-hover:text-white transition" />
              </div>
              <p className="text-sm text-gray-400 mb-2">{repo.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="bg-gray-800 px-2 py-0.5 rounded-full">{repo.language}</span>
                <span>{repo.visibility === "private" ? "Privado" : "Público"}</span>
              </div>
              <div className="text-right text-[11px] text-gray-600 mt-1">
                Actualizado: {repo.updated_at}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
