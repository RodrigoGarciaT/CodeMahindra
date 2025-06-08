import { useEffect, useState } from "react";
import {
  GitPullRequest,
  GitMerge,
  XCircle,
  MessageSquare,
  CheckIcon,
  Loader,
  CheckCheck,
  CircleSlash
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

interface PullRequest {
  title: string;
  number: number;
  author: string;
  date: string;
  retro: string;
  comments: number;
  status: "open" | "closed" | "merged";
}

function RetroBadge({ retro }: { retro: string }) {
  const base = "text-xs px-2 py-1 rounded-md font-semibold inline-flex items-center gap-1";

  switch (retro) {
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

function PullRequestItem({ pr }: { pr: PullRequest }) {
  const { repoFullName } = useParams();

  return (
    <div className="px-4 py-3 flex justify-between items-center hover:bg-[#161b22] transition">
      <div className="flex flex-col">
        <Link
          to={`/repos/${encodeURIComponent(repoFullName!)}/PullRequests/${pr.number}/feedback`}
          className="text-white font-semibold leading-snug hover:text-blue-400 transition cursor-pointer text-lg"
        >
          {pr.status === "open" && <GitPullRequest className="text-green-500" size={16} />}
          {pr.status === "merged" && <GitMerge className="text-purple-500" size={16} />}
          {pr.status === "closed" && <XCircle className="text-red-500" size={16} />}
          {pr.title}
        </Link>
        <p className="text-xs text-gray-400 mt-1">
          #{pr.number} by {pr.author} was {pr.date}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <RetroBadge retro={pr.retro} />
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <MessageSquare size={14} />
          {pr.comments}
        </div>
      </div>
    </div>
  );
}

export default function PullRequests() {
  const { repoFullName } = useParams();
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  
  if (!repoFullName) return null;

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No token found in localStorage");
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/pull-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            repo: repoFullName,
          },
        });

        setPullRequests(res.data);
        console.log(pullRequests)
      } catch (error) {
        console.error("❌ Error fetching pull requests:", error);
      }
    };

    if (repoFullName) fetchPRs();
  }, [repoFullName]);

  const openPRs = pullRequests.filter(pr => pr.status === "open");
  const closedPRs = pullRequests.filter(pr => pr.status === "closed" || pr.status === "merged");
  const visiblePRs = activeTab === "open" ? openPRs : closedPRs;

  return (
    <div className="px-6 py-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Pull Requests</h1>

      {/* GitHub-style tabs */}
      <div className="flex items-center gap-6 text-sm mb-6">
        <button
          onClick={() => setActiveTab("open")}
          className={`flex items-center gap-2 ${
            activeTab === "open" ? "text-white" : "text-gray-400"
          }`}
        >
          <GitPullRequest size={16} />
          <span className="font-medium">{openPRs.length} Open</span>
        </button>

        <button
          onClick={() => setActiveTab("closed")}
          className={`flex items-center gap-2 ${
            activeTab === "closed" ? "text-white" : "text-gray-400"
          }`}
        >
          <CheckIcon size={16} />
          <span className="font-medium">{closedPRs.length} Closed</span>
        </button>
      </div>

      {/* PR list */}
      <div className="divide-y divide-[#30363d] border border-[#30363d] rounded-md">
        {visiblePRs.length > 0 ? (
          visiblePRs.map((pr, index) => (
            <PullRequestItem key={`${activeTab}-${index}`} pr={pr} />
          ))
        ) : (
          <p className="px-4 py-6 text-center text-gray-400">No pull requests found.</p>
        )}
      </div>
    </div>
  );
}
