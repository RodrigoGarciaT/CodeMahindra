import {
  ArrowLeft,
  CalendarDays,
  User,
  GitBranch,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import DetailsSection from "./DetailsSection";
import CommitRecommendedResources from "./CommitRecommendedResources";
import CommitSummary from "./CommitSummary";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
//import GitHubDiffViewer from "./GitHubDiffViewer";

type Resource = {
  title: string;
  image: string;
  link: string;
};

type CommitFeedbackData = {
  title: string;
  date: string;
  author: string;
  avatar: string;
  branch: string;
  quality: string;
  summary: string;
  resources: Resource[];
  stats: {
    files_changed: number;
    additions: number;
    deletions: number;
    total: number;
  };
  files: any[];
  file_tree: any[];
};


export default function CommitFeedback() {
  const { repoFullName, sha } = useParams();
  const location = useLocation();
  const branch = new URLSearchParams(location.search).get("branch") || "main";

  const [data, setData] = useState<CommitFeedbackData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommitDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://127.0.0.1:8000/github/commit-feedback", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            repo: repoFullName,
            sha: sha,
          },
        });

        const raw = res.data;
        const parsed: CommitFeedbackData = {
          title: raw.info.title,
          date: raw.info.date,
          author: raw.info.author,
          branch: branch,
          quality: raw.info.quality,
          summary: raw.summary,
          resources: raw.recommended_resources,
          avatar: raw.info.avatar,
          stats: raw.stats,
          files: raw.files,
          file_tree: raw.file_tree,
        };

        setData(parsed);
      } catch (error) {
        console.error("❌ Error fetching commit details:", error);
      }
    };

    if (repoFullName && sha) fetchCommitDetails();
  }, [repoFullName, sha, branch]);

  if (!data) return null;

  return (
    <div className="w-full bg-[#0d1117] text-white px-4 md:px-10 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ArrowLeft
            size={20}
            className="cursor-pointer text-white hover:text-blue-400 transition"
            onClick={() => navigate("/commits")}
          />
          <h1 className="text-xl font-bold">{data.title}</h1>
        </div>
        <div className="flex items-center flex-wrap gap-4 text-sm text-white/80">
          <div className="flex items-center gap-1">
            <CalendarDays size={16} /> {data.date}
          </div>
          <div className="flex items-center gap-1">
            <User size={16} /> {data.author}
          </div>
          <div className="flex items-center gap-1">
            <GitBranch size={16} /> {data.branch}
          </div>
          <div className="flex items-center gap-1">
            <Star size={16} /> <span className="font-semibold">Quality:</span> {data.quality}
          </div>
        </div>
      </div>

      <h2 className="text-red-500 font-semibold text-sm mb-3 mt-10">Summary</h2>
      <CommitSummary summary={data.summary} />

      <h2 className="text-red-500 font-semibold text-sm mb-3 mt-10">Details</h2>
      <DetailsSection files={data.files} fileTree={data.file_tree} stats={data.stats} />
      {/*
      <GitHubDiffViewer/>
      */}

      <h2 className="text-red-500 font-semibold text-sm mb-3 mt-10">Recommended Rosources</h2>
      <CommitRecommendedResources resources={data.resources}/>

    </div>
  );
}
