"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Folder,
  FolderOpen,
  FileIcon,
  Plus,
  Pencil,
  Trash,
  ChevronRight,
  Code,
  ImageIcon,
  FileText,
  Settings,
  Database,
  Zap,
} from "lucide-react"

type FileNode = {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  status?: "added" | "modified" | "removed"
  file?: any
}

type Props = {
  treeData: FileNode[]
  onSelectFile: (path: string) => void
}

const statusConfig = {
  added: {
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    glowColor: "shadow-green-500/20",
    icon: <Plus size={14} />,
    label: "Added",
  },
  modified: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    glowColor: "shadow-yellow-500/20",
    icon: <Pencil size={14} />,
    label: "Modified",
  },
  removed: {
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    glowColor: "shadow-red-500/20",
    icon: <Trash size={14} />,
    label: "Removed",
  },
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
    case "py":
    case "java":
    case "cpp":
      return <Code size={14} className="text-blue-400" />
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return <ImageIcon size={14} className="text-purple-400" />
    case "json":
    case "xml":
    case "yaml":
      return <Database size={14} className="text-orange-400" />
    case "md":
    case "txt":
      return <FileText size={14} className="text-gray-400" />
    case "config":
    case "env":
      return <Settings size={14} className="text-cyan-400" />
    default:
      return <FileIcon size={14} className="text-gray-400" />
  }
}

const FileTreeNavigator = ({ treeData, onSelectFile }: Props) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("");

  const filterTree = (nodes: FileNode[], query: string): FileNode[] => {
    if (!query) return nodes;

    return nodes
      .map((node) => {
        if (node.type === "folder") {
          const filteredChildren = node.children ? filterTree(node.children, query) : [];
          if (filteredChildren.length > 0 || node.name.toLowerCase().includes(query.toLowerCase())) {
            return { ...node, children: filteredChildren };
          }
          return null;
        }

        if (node.name.toLowerCase().includes(query.toLowerCase())) {
          return node;
        }

        return null;
      })
      .filter((n): n is FileNode => n !== null);
  };

  const toggleExpand = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }))
  }

  const renderNode = (node: FileNode, parentPath = "", depth = 0): JSX.Element => {
    const fullPath = `${parentPath}/${node.name}`
    const isOpen = expanded[fullPath]
    const isHovered = hoveredPath === fullPath
    const status = node.status || "modified"
    const config = statusConfig[status] || statusConfig["modified"]

    if (node.type === "folder") {
      return (
        <motion.div
          key={fullPath}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: depth * 0.05 }}
          className="relative"
        >
          <motion.div
            className={`
              relative cursor-pointer flex items-center gap-3 py-3 px-4 mx-2 rounded-xl
              transition-all duration-300 group
              ${
                isHovered
                  ? "bg-gradient-to-r from-red-500/20 via-orange-500/10 to-red-500/20 border border-red-500/30 shadow-lg shadow-red-500/10"
                  : "bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600/30 hover:border-red-500/20"
              }
            `}
            onClick={() => toggleExpand(fullPath)}
            onMouseEnter={() => setHoveredPath(fullPath)}
            onMouseLeave={() => setHoveredPath(null)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-xl opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />

            {/* Expand/Collapse Icon */}
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }} className="text-red-400">
              <ChevronRight size={16} />
            </motion.div>

            {/* Folder Icon */}
            <motion.div
              animate={{
                scale: isOpen ? 1.1 : 1,
                rotateY: isOpen ? 15 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {isOpen ? (
                <FolderOpen size={18} className="text-yellow-400 drop-shadow-lg" />
              ) : (
                <Folder size={18} className="text-blue-400 drop-shadow-lg" />
              )}

              {/* Folder glow effect */}
              <motion.div
                className={`absolute inset-0 ${isOpen ? "bg-yellow-400" : "bg-blue-400"} rounded-full blur-md opacity-20`}
                animate={{ scale: isHovered ? 1.5 : 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Folder Name */}
            <span className="font-semibold text-gray-100 text-sm tracking-wide group-hover:text-white transition-colors">
              {node.name}
            </span>

            {/* File count badge */}
            {node.children && (
              <motion.div
                className="ml-auto px-2 py-1 bg-slate-700/50 rounded-full text-xs text-gray-400 border border-slate-600/50"
                whileHover={{ scale: 1.1 }}
              >
                {node.children.length}
              </motion.div>
            )}

            {/* Connection line */}
            <div className="absolute left-0 top-1/2 w-1 h-6 bg-gradient-to-b from-red-500/50 to-transparent rounded-full transform -translate-y-1/2" />
          </motion.div>

          {/* Children with smooth expand animation */}
          <AnimatePresence>
            {isOpen && node.children && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pl-6 relative">
                  {/* Vertical connection line */}
                  <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-red-500/30 via-orange-500/20 to-transparent" />

                  {node.children.map((child) => renderNode(child, fullPath, depth + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )
    }

    // File rendering
    return (
      <motion.div
        key={fullPath}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.05 }}
        className="relative"
      >
        <motion.div
          className={`
            relative cursor-pointer flex items-center gap-3 py-2.5 px-4 mx-2 rounded-lg
            transition-all duration-300 group
            ${
              isHovered
                ? `bg-gradient-to-r ${config.bgColor} border ${config.borderColor} shadow-lg ${config.glowColor}`
                : "bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/70"
            }
          `}
          onClick={() => onSelectFile(node.file.filename)}
          onMouseEnter={() => setHoveredPath(fullPath)}
          onMouseLeave={() => setHoveredPath(null)}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Status indicator */}
          <motion.div
            className={`flex items-center justify-center w-6 h-6 rounded-full ${config.bgColor} border ${config.borderColor}`}
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            <div className={config.color}>{config.icon}</div>
          </motion.div>

          {/* File type icon */}
          <motion.div whileHover={{ scale: 1.1 }} className="relative">
            {getFileIcon(node.name)}

            {/* File icon glow */}
            <motion.div
              className="absolute inset-0 bg-current rounded-full blur-sm opacity-20"
              animate={{ scale: isHovered ? 1.5 : 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* File name */}
          <span className={`text-sm font-medium transition-colors ${config.color} group-hover:text-white`}>
            {node.name}
          </span>

          {/* Status badge */}
          <motion.div
            className={`ml-auto px-2 py-1 ${config.bgColor} rounded-full text-xs ${config.color} border ${config.borderColor} opacity-0 group-hover:opacity-100`}
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {config.label}
          </motion.div>

          {/* Activity indicator */}
          <motion.div
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Zap size={12} className={config.color} />
          </motion.div>

          {/* Connection dot */}
          <div className="absolute left-0 top-1/2 w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full transform -translate-y-1/2 -translate-x-1" />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative p-4 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-2xl border border-red-500/20 shadow-2xl overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/3 to-red-500/5 rounded-2xl"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.05)_25px,rgba(255,255,255,0.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,0.05)_75px,rgba(255,255,255,0.05)_76px,transparent_77px),linear-gradient(rgba(255,255,255,0.05)_24px,transparent_25px,transparent_26px,rgba(255,255,255,0.05)_27px,rgba(255,255,255,0.05)_74px,transparent_75px,transparent_76px,rgba(255,255,255,0.05)_77px)] bg-[length:50px_50px]" />
      </div>

      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6 pb-4 border-b border-red-500/20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative w-full">
          <input
            type="text"
            placeholder="🔍 Search files..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-red-500/10 text-red-200 placeholder-red-300 border border-red-500/30 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/70 transition-all duration-300 shadow-inner"
          />
        </div>
      </motion.div>


      {/* Tree content */}
      <div className="relative space-y-1">
        {filterTree(treeData, searchQuery).map((node) => renderNode(node))}
      </div>

    </motion.div>
  )
}

export default FileTreeNavigator
