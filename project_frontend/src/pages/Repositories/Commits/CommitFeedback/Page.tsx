import {
  ArrowLeft,
  CalendarDays,
  User,
  GitBranch,
  Star,
  Loader,
  CheckCheck,
  CircleSlash,
  GitCommitHorizontal,
  BookOpen
} from "lucide-react";
import { useEffect, useState } from "react";
import DetailsSection from "../../FeedbackComponents/DetailsSection";
import FeedbackRecommendedResources from "../../FeedbackComponents/FeedbackRecommendedResources";
import Summary from "../../FeedbackComponents/Summary";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import botImage from '@/images/robot_male_1.svg'

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

type CommitFeedbackData = {
  title: string;
  date: string;
  author: string;
  avatar: string;
  branch: string;
  created_at?: string;
  analyzed_at?: string;
  quality?: number;
  summary: string;
  status: string;
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

function getStatusBadge(status: string) {
  console.log(status)
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


export default function CommitFeedback() {
  const { repoFullName, sha } = useParams();
  const location = useLocation();
  const branch = new URLSearchParams(location.search).get("branch") || "main";

  const [data, setData] = useState<CommitFeedbackData | null>(null);
  const navigate = useNavigate();
  const [botImageUrl, setBotImageUrl] = useState(botImage); // por defecto el actual

  useEffect(() => {
    const fetchEquippedBot = async () => {
      try {
        const employeeId = localStorage.getItem("user_id");
        if (!employeeId) return;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bots/employee/${employeeId}/equipped`);
        if (!res.ok) return;

        const data = await res.json();
        if (data.image) {
          setBotImageUrl(data.image); // asegúrate que la propiedad sea `image`
        }
      } catch (error) {
        console.error("Error loading equipped bot:", error);
      }
    };

    fetchEquippedBot();
  }, []);

  useEffect(() => {
    const fetchCommitDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${import.meta.env.VITE_REPOSITORIES_BACKEND_URL}/github/commit-feedback`, {
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
          resources: Array.isArray(raw.recommended_resources) ? raw.recommended_resources : [],
          avatar: raw.info.avatar,
          stats: raw.stats,
          files: Array.isArray(raw.files) ? raw.files : [],
          file_tree: Array.isArray(raw.file_tree) ? raw.file_tree : [],
          status: raw.status,
          feedback: Array.isArray(raw.feedback) ? raw.feedback : [],
        };

        setData(parsed);
        console.log(parsed.resources)
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
            onClick={() => navigate(-1)}
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
            <Star size={16} /> <span className="font-semibold">Quality:</span> {data.quality}/10
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Status:</span> {getStatusBadge(data.status)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 mt-10">
        <motion.div
          className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30"
          whileHover={{ scale: 1.1, rotate: -5 }}
        >
          <BookOpen className="w-6 h-6 text-red-400" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-white">Summary</h2>
          <p className="text-gray-400 text-sm">Generated overview of the commit</p>
        </div>
      </div>
      <Summary summary={data.summary} botImage={botImageUrl}/>


      <div className="flex items-center gap-4 mb-3 mt-10">
        <motion.div
          className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30"
          whileHover={{ scale: 1.1, rotate: -5 }}
        >
          <GitCommitHorizontal className="w-6 h-6 text-red-400" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-white">Details</h2>
          <p className="text-gray-400 text-sm">Dive into code changes and insights</p>
        </div>
      </div>
      <DetailsSection files={data.files} fileTree={data.file_tree} stats={data.stats} feedback={data.feedback} botImage={botImageUrl}/>
      

      <div className="flex items-center gap-4 mb-3 mt-10">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <BookOpen className="w-6 h-6 text-red-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">Recommended Resources</h2>
            <p className="text-gray-400 text-sm">Curated learning materials for you</p>
          </div>
        </div>
      </div>
      <FeedbackRecommendedResources resources={data.resources}/>

    </div>
  );
}
