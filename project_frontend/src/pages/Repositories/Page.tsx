import { useEffect, useState } from "react";
import { FolderGit2, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GitHubLinkButton from '@/components/GitHubLinkButton';

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
  const [githubLinked, setGithubLinked] = useState<boolean | null>(null); // Para verificar si está enlazado
  const navigate = useNavigate();

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔐 Token found in localStorage:", token);

      if (!token) {
        console.warn("⚠️ Token not found. Redirecting to login...");
        navigate("/");  // Si no hay token, redirigimos al login
        return;
      }

      // Hacemos la solicitud para obtener los datos del perfil
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      console.log("🧑‍💻 Profile received:", data);

      // Verificamos si tiene github_username y github_token
      const isLinked = !!data.github_username && !!data.github_token;
      setGithubLinked(isLinked);

      // Si está enlazado, traemos los repos
      if (isLinked) {
        fetchRepos(token); 
      } else {
        setLoading(false); // Si no está enlazado, solo mostramos el botón
      }
    } catch (err: any) {
      console.error("💥 Fetch profile error:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchRepos = async (token: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/repos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data: Repo[] = await res.json();
      console.log("✅ Repositories received:", data);
      setRepos(data);
    } catch (err: any) {
      console.error("💥 Fetch error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] to-[#111827] text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Repositories</h1>

      {/* Si el usuario no tiene GitHub enlazado, mostramos el botón de "Link GitHub Account" */}
      {githubLinked === false && (
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <GitHubLinkButton
            redirectUrl={`${import.meta.env.VITE_BACKEND_URL}/auth/github?link_account=true&token=${localStorage.getItem("token")}`}
          />
        </div>
      )}

      {/* Mostrar repos si están disponibles */}
      {loading ? (
        <p className="text-center text-gray-400">Loading repositories...</p>
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
                <span>{repo.visibility === "private" ? "Private" : "Public"}</span>
              </div>
              <div className="text-right text-[11px] text-gray-600 mt-1">
                Updated: {repo.updated_at}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
