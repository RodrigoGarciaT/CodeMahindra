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
  const [token, setToken] = useState<string | null>(null);

  // Verifica si GitHub está vinculado y carga los repos
  const checkGithubLink = async (token: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const isLinked = !!data.github_username && !!data.github_token;
      setGithubLinked(isLinked);
      return isLinked;
    } catch (err) {
      console.error("Error checking GitHub link:", err);
      return false;
    }
  };

  // Obtiene los repositorios de GitHub
  const fetchRepos = async (token: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/repos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Repo[] = await res.json();
      setRepos(data);
    } catch (err) {
      setError("Failed to fetch repositories");
    } finally {
      setLoading(false);
    }
  };

  // Efecto principal: verifica autenticación y carga datos
    useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/");
      return;
    }

    setToken(storedToken); // ✅ Guardamos el token para uso seguro
    const init = async () => {
      const isLinked = await checkGithubLink(storedToken);
      if (isLinked) await fetchRepos(storedToken);
      else setLoading(false);
    };

    init();

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("linked") === "true") {
      setGithubLinked(true);
      fetchRepos(storedToken);
    }
  }, [navigate]);

  // Si no está vinculado, muestra el modal de GitHub
  if (githubLinked === false) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] to-[#111827] flex items-center justify-center">
      {token && (
        <GitHubLinkButton
          redirectUrl={`${import.meta.env.VITE_BACKEND_URL}/auth/github?state=link_account|${token}`}
        />
      )}
    </div>
  );
}


  return (
        <div className="min-h-screen bg-gradient-to-br from-[#0d1117] to-[#111827] text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Repositories</h1>
      
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
