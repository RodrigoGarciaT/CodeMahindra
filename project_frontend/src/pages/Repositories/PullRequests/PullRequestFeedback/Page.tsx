import {
  ArrowLeft,
  CalendarDays,
  User,
  GitBranch,
  Star,
  Loader,
  CheckCheck,
  CircleSlash,
  GitPullRequest,
  XCircle,
  GitMerge
} from "lucide-react";
import { useEffect, useState } from "react";
import DetailsSection from "../../FeedbackComponents/DetailsSection";
import FeedbackRecommendedResources from "../../FeedbackComponents/FeedbackRecommendedResources";
import Summary from "../../FeedbackComponents/Summary";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

type Resource = {
  title: string;
  image: string;
  link: string;
};

export type FeedbackComment = {
  filePath: string;
  lineNumber: number;
  type: 'insert' | 'delete' | 'normal';
  comment: string;
};

type PRFeedbackData = {
  title: string;
  date: string;
  author: string;
  avatar: string;

  branch_from: string;
  branch_to: string;

  created_at?: string;
  analyzed_at?: string;
  quality?: number;

  summary: string;
  status: string;
  retro: string;

  feedback: FeedbackComment[];
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


function getStatusBadge(retro: string) {
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


export default function PullRequestFeedback() {
  const { repoFullName, pr_number } = useParams();
  const [data, setData] = useState<PRFeedbackData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommitDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/pull-request-feedback`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            repo: repoFullName,
            pr_number: pr_number,
          },
        });

        const raw = res.data;
        const parsed: PRFeedbackData = {
          title: raw.info.title,
          date: raw.info.date,
          author: raw.info.author,
          avatar: raw.info.avatar,

          branch_from: raw.info.branch_from,
          branch_to: raw.info.branch_to,

          created_at: raw.info.created_at,
          analyzed_at: raw.info.analyzed_at,
          quality: raw.info.quality,

          summary: raw.summary,
          status: raw.status,
          retro: raw.retro,

          feedback: Array.isArray(raw.feedback) ? raw.feedback : [],
          resources: Array.isArray(raw.recommended_resources) ? raw.recommended_resources : [],

          stats: raw.stats,
          files: raw.files,
          file_tree: raw.file_tree
        };

        setData(parsed);
        console.log(parsed.status)
      } catch (error) {
        console.error("❌ Error fetching commit details:", error);
      }
    };

    if (repoFullName && pr_number) fetchCommitDetails();
  }, [repoFullName, pr_number]);

  if (!data) return null;

  return (
    <div className="w-full bg-[#0d1117] text-white px-4 md:px-10 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ArrowLeft
            size={20}
            className="cursor-pointer text-white hover:text-blue-400 transition"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-xl font-bold">{data.title}</h1>
        </div>

        <div className="flex items-center flex-wrap gap-4 text-sm text-white/80">
          <div className="flex items-center gap-2">
            {data.status === "open" && (
              <span className="flex items-center gap-1 text-green-500">
                <GitPullRequest size={16} /> Open
              </span>
            )}
            {data.status === "merged" && (
              <span className="flex items-center gap-1 text-purple-500">
                <GitMerge size={16} /> Merged
              </span>
            )}
            {data.status === "closed" && (
              <span className="flex items-center gap-1 text-red-500">
                <XCircle size={16} /> Closed
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <CalendarDays size={16} /> {data.date}
          </div>
          <div className="flex items-center gap-1">
            <User size={16} /> {data.author}
          </div>
          <div className="flex items-center gap-1">
            <GitBranch size={16} /> {data.branch_from}
            <span className="text-white">→</span>
            {data.branch_to}
          </div>
          <div className="flex items-center gap-1">
            <Star size={16} /> <span className="font-semibold">Quality:</span> {data.quality}/10
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Status:</span> {getStatusBadge(data.retro)}
          </div>
        </div>
      </div>

      <h2 className="text-red-500 font-semibold text-sm mb-3 mt-10">Summary</h2>
      <Summary summary={data.summary} />

      <h2 className="text-red-500 font-semibold text-sm mb-3 mt-10">Details</h2>
      <DetailsSection files={data.files} fileTree={data.file_tree} stats={data.stats} feedback={data.feedback}/>
      {/*
      <GitHubDiffViewer/>
      */}

      <h2 className="text-red-500 font-semibold text-sm mb-3 mt-10">Recommended Rosources</h2>
      <FeedbackRecommendedResources resources={data.resources}/>

    </div>
  );
}
