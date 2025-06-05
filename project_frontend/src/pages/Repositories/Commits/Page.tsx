import { useState, useEffect } from "react";
import {
  GitCommitHorizontal,
  CheckCircle,
  GitBranch,
  Loader,
  CheckCheck,
  CircleSlash,
  Copy,
  Check
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

type Commit = {
  message: string;
  author: string;
  date: string;
  status: string;
  hash: string;
  verified: boolean;
};

type CommitsGrouped = {
  [date: string]: Commit[];
};

function getRetroBadge(status: string) {
  const base = "text-xs px-2 py-1 rounded-md font-semibold inline-flex items-center gap-1";

  switch (status) {
    case "analyzing":
      return (
        <span className={`${base} bg-blue-700`}>
          <Loader size={14} className="animate-spin" />
          Analyzing
        </span>
      );

    case "analyzed":
      return (
        <span className={`${base} bg-green-600`}>
          <CheckCheck size={14} />
          Analyzed
        </span>
      );

    case "not_analyzed":
      return (
        <span className={`${base} bg-gray-600`}>
          <CircleSlash size={14} />
          Not Analyzed
        </span>
      );

    default:
      return null;
  }
}

export default function Commits() {
  const { repoFullName } = useParams();
  const [branch, setBranch] = useState<string | null>(null);
  const [commitsGrouped, setCommitsGrouped] = useState<CommitsGrouped>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  if (!repoFullName) return null;

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/branches`, {
          params: { repo: repoFullName },
          headers: { Authorization: `Bearer ${token}` }
        });

        const { branches, default_branch } = res.data;
        setBranches(branches);
        setBranch(default_branch);
      } catch (err) {
        console.error("❌ Error fetching branches:", err);
        setBranches(["main"]);
        setBranch("main");
      }
    };

    if (repoFullName) fetchBranches();
  }, [repoFullName]);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No token found in localStorage");
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/commits`, {
          params: {
            repo: repoFullName,
            branch: branch,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCommitsGrouped(res.data);
      } catch (error) {
        console.error("❌ Error fetching commits:", error);
      }
    };

    if (repoFullName && branch) fetchCommits();
  }, [repoFullName, branch]);

  return (
    <div className="px-6 py-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Commits</h1>

      <div className="flex gap-3 mb-6">
        <div className="relative">
          <button
            disabled={!branch}
            onClick={() => setShowDropdown(!showDropdown)}
            className={`text-sm px-4 py-2 rounded-md border flex items-center gap-2
              ${!branch ? "opacity-50 cursor-not-allowed" : "hover:bg-[#21262d]"}
              bg-[#1c2128] border-[#30363d] transition-colors`}
          >
            <GitBranch size={16} />
            {branch ? branch : <span className="italic text-gray-200">Loading...</span>}
            <span className="text-gray-400">▼</span>
          </button>

          {showDropdown && (
            <div className="absolute z-50 mt-2 w-64 bg-[#161b22] border border-[#30363d] rounded-md shadow-lg">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a branch..."
                className="bg-[#0d1117] text-white px-3 py-2 w-full text-sm border-b border-[#30363d] outline-none"
              />
              <div className="text-xs uppercase text-gray-400 px-3 pt-2 pb-1">Branches</div>
              <ul className="max-h-60 overflow-y-auto">
                {(branches || [])
                  .filter((b) => b.toLowerCase().includes(search.toLowerCase()))
                  .map((b) => (
                    <li
                      key={b}
                      onClick={() => {
                        setBranch(b);
                        setShowDropdown(false);
                      }}
                      className={`px-3 py-2 text-sm text-white hover:bg-[#21262d] cursor-pointer flex justify-between items-center ${
                        b === branch ? "bg-[#0d1117] font-semibold" : ""
                      }`}
                    >
                      {b}
                      {b === "main" && (
                        <span className="text-[10px] bg-gray-700 px-2 py-0.5 rounded-full">default</span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-10">
        {Object.keys(commitsGrouped).length > 0 ? (
          Object.entries(commitsGrouped).map(([date, commits]) => (
            <div key={date}>
              <div className="flex items-center gap-2 text-sm text-gray-400 font-semibold mb-2">
                <GitCommitHorizontal size={16} /> Commits on {date}
              </div>

              <div className="border-l-[2px] border-[#30363d] pl-4 space-y-3 relative">
                {commits.map((commit, index) => (
                  <div
                    key={index}
                    className="bg-[#0d1117] p-4 rounded-md border border-[#30363d] text-sm flex justify-between items-start"
                  >
                    <div className="flex flex-col gap-1 max-w-[70%]">
                      <p className="text-white font-semibold leading-snug hover:text-blue-400 transition cursor-pointer text-lg">
                        <Link to={`/repos/${encodeURIComponent(repoFullName!)}/commits/${commit.hash}/feedback`}>
                          {commit.message.includes("http") ? (
                            <>
                              {commit.message.split("http")[0]}
                              <a
                                href={`http${commit.message.split("http")[1]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline"
                              >
                                {`http${commit.message.split("http")[1]}`}
                              </a>
                            </>
                          ) : (
                            commit.message
                          )}
                        </Link>
                      </p>
                      <p className="text-gray-400 text-xs">
                        <span className="text-green-400 font-medium">{commit.author}</span> committed {commit.date}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">{getRetroBadge(commit.status)}</div>
                      <div className="flex items-center gap-2 text-gray-400">
                        {commit.verified && (
                          <span className="bg-[#238636] text-white text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                            <CheckCircle size={12} strokeWidth={2.5} className="text-white" />
                            Verified
                          </span>
                        )}
                        <div className="flex items-center gap-2 relative">
                          <Link
                            to={`/repos/${encodeURIComponent(repoFullName)}/commits/${commit.hash}/feedback`}
                            className="text-gray-300 text-xs px-2 py-1 rounded-md hover:bg-[#30363d] transition-colors font-mono"
                          >
                            {commit.hash.slice(0, 7)}
                          </Link>

                          <button
                            onClick={async () => {
                              await navigator.clipboard.writeText(commit.hash);
                              setCopiedSha(commit.hash);
                              setTimeout(() => setCopiedSha(null), 2000);
                            }}
                            className="text-gray-400 hover:text-white transition-colors relative group"
                          >
                            {copiedSha === commit.hash ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}

                            <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                              Copy full SHA for {commit.hash.slice(0, 7)}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="border border-[#30363d] rounded-md px-4 py-6 text-center text-gray-400">
            No commits found.
          </div>
        )}
      </div>
    </div>
  );
}
