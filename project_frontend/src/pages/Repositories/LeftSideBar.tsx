import {
  BookOpen,
  GitCommitHorizontal,
  GitPullRequest,
  LayoutDashboard,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";

const navItems = [
  { icon: <LayoutDashboard size={24} />, subpath: "Dashboard", title: "Dashboard" },
  { icon: <GitCommitHorizontal size={24} />, subpath: "Commits", title: "Commits" },
  { icon: <GitPullRequest size={24} />, subpath: "PullRequests", title: "Pull Requests" },
  { icon: <BookOpen size={24} />, subpath: "RecommendedResources", title: "Resources" },
];

export default function LeftSidebar() {
  const { repoFullName } = useParams();

  if (!repoFullName) return null;

  return (
    <div className="fixed top-[60px] left-0 w-16 h-[calc(100vh-60px)] bg-gray-900 text-white border-r border-red-700 z-40 flex flex-col items-center py-6 space-y-6 shadow-md">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={`/repos/${encodeURIComponent(repoFullName)}/${item.subpath}`}
          className={({ isActive }) =>
            `w-full flex justify-center transition-all duration-300 ease-in-out group
             ${isActive ? "bg-red-700 shadow-inner" : "hover:bg-gray-800"}`
          }
        >
          <div
            className="relative flex items-center"
          >
            <div
              className={`
                p-2 rounded-md
                transition-transform duration-300 ease-in-out
                group-hover:scale-110 group-hover:shadow-md
                text-gray-300
              `}
            >
              {item.icon}
            </div>

            {/* Texto oculto que aparece solo en hover del ítem */}
            <span
              className={`
                absolute left-12 top-1/2 -translate-y-1/2
                bg-red-700 text-white text-sm px-3 py-1 rounded-md
                whitespace-nowrap opacity-0 scale-0
                group-hover:opacity-100 group-hover:scale-100
                transition-all duration-300
                origin-left z-50 shadow-md
              `}
            >
              {item.title}
            </span>
          </div>
        </NavLink>
      ))}
    </div>
  );
}
