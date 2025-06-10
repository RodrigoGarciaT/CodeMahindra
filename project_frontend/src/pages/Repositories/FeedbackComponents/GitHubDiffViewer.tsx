"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Diff, Hunk, parseDiff, getChangeKey } from "react-diff-view"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutPanelLeft,
  GitCommit,
  Plus,
  Minus,
  Eye,
  FileText,
  ChevronRight,
} from "lucide-react"
import "react-diff-view/style/index.css"
import type { Change } from "gitdiff-parser"
import BotCommentBanner from "./BotCommentBanner"
import "./styles.css"

type FileEntry = {
  filename: string
  patch?: string
  additions: number
  deletions: number
}

type Props = {
  files: FileEntry[]
  selectedPath: string | null
  feedback?: Feedback
  stats: {
    files_changed: number
    additions: number
    deletions: number
    total: number
  }
}

type Feedback = {
  filePath: string
  comments: {
    type: "insert" | "delete" | "normal"
    comment: string
    lineNumber: number
  }[]
}[]

const GitHubDiffViewer: React.FC<Props> = ({ files, selectedPath, stats, feedback = [] }) => {
  const [viewType, setViewType] = useState<"unified" | "split">("unified")
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({})

  const diffText = files
    .filter((f) => f.patch)
    .map(
      (f) =>
        `diff --git a/${f.filename} b/${f.filename}\n` + `--- a/${f.filename}\n` + `+++ b/${f.filename}\n` + f.patch,
    )
    .join("\n")

  const parsedFiles = parseDiff(diffText)
  const selectedRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [selectedPath])

  const buildWidgets = (hunks: any[], filePath: string) => {
    const widgets: Record<string, React.ReactNode> = {}

    hunks.forEach((hunk) => {
      hunk.changes.forEach((change: Change) => {
        const key = getChangeKey(change)

        const line =
          change.type === "insert"
            ? change.lineNumber
            : change.type === "delete"
              ? change.lineNumber
              : change.type === "normal"
                ? change.newLineNumber
                : undefined

        if (line === undefined) return

        // ✅ Cambios aquí
        const fileFeedback = feedback.find((f) => f.filePath === filePath)
        const comment = fileFeedback?.comments.find(
          (c) => c.lineNumber === line && c.type === change.type
        )

        if (comment) {
          widgets[key] = <BotCommentBanner comment={comment.comment} />
        }
      })
    })

    return widgets
  }

  const renderDiffBars = (additions: number, deletions: number) => {
    const total = additions + deletions || 1
    const totalBars = 5

    const addCount = Math.round((additions / total) * totalBars)
    const delCount = Math.round((deletions / total) * totalBars)

    const bars = []

    for (let i = 0; i < totalBars; i++) {
      if (i < addCount) {
        bars.push(
          <motion.div
            key={i}
            className="w-3 h-3 bg-gradient-to-r from-green-600 to-green-700 rounded-sm shadow-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />,
        )
      } else if (i < addCount + delCount) {
        bars.push(
          <motion.div
            key={i}
            className="w-3 h-3 bg-gradient-to-r from-red-600 to-red-700 rounded-sm shadow-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />,
        )
      } else {
        bars.push(
          <motion.div
            key={i}
            className="w-3 h-3 bg-slate-600/40 rounded-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />,
        )
      }
    }

    return <div className="flex gap-[2px] ml-3">{bars}</div>
  }

  const toggleFileExpansion = (filePath: string) => {
    setExpandedFiles((prev) => ({ ...prev, [filePath]: !prev[filePath] }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 relative"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/3 to-red-500/5 rounded-3xl blur-xl"
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

      {/* Top stats bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 border border-red-500/20 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.05)_25px,rgba(255,255,255,0.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,0.05)_75px,rgba(255,255,255,0.05)_76px,transparent_77px),linear-gradient(rgba(255,255,255,0.05)_24px,transparent_25px,transparent_26px,rgba(255,255,255,0.05)_27px,rgba(255,255,255,0.05)_74px,transparent_75px,transparent_76px,rgba(255,255,255,0.05)_77px)] bg-[length:50px_50px]" />
        </div>

        <div className="relative flex items-center gap-4 text-white">
          <div className="flex items-center gap-4 text-sm">
            <motion.div
              className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-600/30"
              whileHover={{ scale: 1.05, borderColor: "rgba(239, 68, 68, 0.3)" }}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="font-semibold">{stats.files_changed} files</span>
            </motion.div>

            <div className="flex items-center gap-3 text-sm">
              <motion.div
                className="flex items-center gap-1 px-2 py-1 bg-green-600/20 rounded-md border border-green-600/30"
                whileHover={{ scale: 1.1 }}
              >
                <Plus className="w-3 h-3 text-green-500" />
                <span className="text-green-500 font-bold">{stats.additions}</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-1 px-2 py-1 bg-red-600/20 rounded-md border border-red-600/30"
                whileHover={{ scale: 1.1 }}
              >
                <Minus className="w-3 h-3 text-red-500" />
                <span className="text-red-500 font-bold">{stats.deletions}</span>
              </motion.div>

              <span className="text-gray-400">lines</span>
            </div>
          </div>
        </div>

        <div className="relative flex gap-2 text-sm">
          <motion.button
            onClick={() => setViewType("unified")}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
              ${
                viewType === "unified"
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25"
                  : "bg-slate-800/50 border border-slate-600/50 text-gray-300 hover:border-red-500/30 hover:text-white"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LayoutPanelLeft className="w-4 h-4" />
            Unified
          </motion.button>

          <motion.button
            onClick={() => setViewType("split")}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
              ${
                viewType === "split"
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25"
                  : "bg-slate-800/50 border border-slate-600/50 text-gray-300 hover:border-red-500/30 hover:text-white"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-4 h-4" />
            Split
          </motion.button>
        </div>
      </motion.div>

      {/* Diffs */}
      <div className="space-y-4">
        {parsedFiles.map((file, index) => {
          const isSelected = file.newPath === selectedPath
          const isExpanded = expandedFiles[file.newPath] !== false

          return (
            <motion.div
              key={index}
              ref={isSelected ? selectedRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-2xl border shadow-2xl overflow-hidden
                ${isSelected ? "border-red-500/50 shadow-red-500/20" : "border-red-500/20 hover:border-red-500/30"}
              `}
            >
              {/* File header */}
              <motion.div
                className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-slate-800/50 to-slate-700/30 border-b border-red-500/20 cursor-pointer"
                onClick={() => toggleFileExpansion(file.newPath)}
                whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.05)" }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-red-400"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>

                  <div className="flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-orange-400" />
                    <span className="text-white font-mono text-sm">
                      {file.oldPath} → {file.newPath}
                    </span>
                  </div>

                  {isSelected && (
                    <motion.div
                      className="px-2 py-1 bg-red-500/20 rounded-full text-xs text-red-300 border border-red-500/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      Selected
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 text-sm font-mono">
                    <motion.div className="flex items-center gap-1 text-green-500" whileHover={{ scale: 1.1 }}>
                      <Plus className="w-3 h-3" />
                      <span className="font-bold">{files[index].additions}</span>
                    </motion.div>

                    <motion.div className="flex items-center gap-1 text-red-500" whileHover={{ scale: 1.1 }}>
                      <Minus className="w-3 h-3" />
                      <span className="font-bold">{files[index].deletions}</span>
                    </motion.div>

                    {renderDiffBars(files[index].additions, files[index].deletions)}
                  </div>
                </div>
              </motion.div>

              {/* Diff content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5" />

                      <div className="relative p-4">
                        <Diff
                          viewType={viewType}
                          diffType={file.type}
                          hunks={file.hunks}
                          widgets={buildWidgets(file.hunks, file.newPath)}
                        >
                          {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
                        </Diff>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Connection indicator */}
              <div className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full transform -translate-y-1/2" />
            </motion.div>
          )
        })}
      </div>

      {/* Estilos CSS integrados */}
      <style>{`
        /* Enhanced GitHub-style dark theme with red accents */
        .diff-view {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .diff-hunk-header {
          background: linear-gradient(90deg, #1e293b 0%, #334155 100%) !important;
          color: #e2e8f0 !important;
          border-bottom: 1px solid rgba(239, 68, 68, 0.2) !important;
          font-family: "JetBrains Mono", "Fira Code", monospace !important;
          font-size: 12px !important;
          padding: 8px 16px !important;
          position: relative;
        }

        .diff-hunk-header::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #ef4444 0%, #f97316 100%);
        }

        .diff-line {
          font-family: "JetBrains Mono", "Fira Code", monospace !important;
          font-size: 13px !important;
          line-height: 1.5 !important;
          border: none !important;
          transition: all 0.2s ease !important;
        }

        .diff-line:hover {
          background-color: rgba(239, 68, 68, 0.05) !important;
          transform: translateX(2px);
        }

        .diff-line-normal {
          background-color: #0f172a !important;
          color: #e2e8f0 !important;
        }

        .diff-line-insert {
          background: linear-gradient(90deg, rgba(21, 128, 61, 0.15) 0%, rgba(21, 128, 61, 0.05) 100%) !important;
          color: #86efac !important;
          border-left: 3px solid #16a34a !important;
          position: relative;
        }

        .diff-line-insert::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          background: linear-gradient(90deg, rgba(21, 128, 61, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .diff-line-delete {
          background: linear-gradient(90deg, rgba(185, 28, 28, 0.15) 0%, rgba(185, 28, 28, 0.05) 100%) !important;
          color: #fca5a5 !important;
          border-left: 3px solid #dc2626 !important;
          position: relative;
        }

        .diff-line-delete::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          background: linear-gradient(90deg, rgba(185, 28, 28, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .diff-gutter {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
          color: #64748b !important;
          border-right: 1px solid rgba(239, 68, 68, 0.2) !important;
          font-family: "JetBrains Mono", "Fira Code", monospace !important;
          font-size: 11px !important;
          text-align: center !important;
          padding: 0 8px !important;
          user-select: none !important;
          position: relative;
        }

        .diff-gutter::after {
          content: "";
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent 0%, rgba(239, 68, 68, 0.3) 50%, transparent 100%);
        }

        .diff-gutter:hover {
          background: linear-gradient(135deg, #334155 0%, #475569 100%) !important;
          color: #e2e8f0 !important;
        }

        .diff-gutter-insert {
          background: linear-gradient(135deg, rgba(21, 128, 61, 0.1) 0%, rgba(21, 128, 61, 0.05) 100%) !important;
          color: #16a34a !important;
        }

        .diff-gutter-delete {
          background: linear-gradient(135deg, rgba(185, 28, 28, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%) !important;
          color: #dc2626 !important;
        }

        .diff-code {
          padding: 0 16px !important;
          white-space: pre-wrap !important;
          word-break: break-all !important;
        }

        .diff-widget {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
          border-top: 1px solid rgba(239, 68, 68, 0.2) !important;
          border-bottom: 1px solid rgba(239, 68, 68, 0.2) !important;
          margin: 4px 0 !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }

        /* Split view enhancements */
        .diff-split .diff-gutter {
          width: 60px !important;
        }

        .diff-split .diff-line {
          border-right: 1px solid rgba(239, 68, 68, 0.1) !important;
        }

        /* Scrollbar styling */
        .diff-view::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .diff-view::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 4px;
        }

        .diff-view::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ef4444 0%, #f97316 100%);
          border-radius: 4px;
        }

        .diff-view::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #dc2626 0%, #ea580c 100%);
        }

        /* Selection highlighting */
        .diff-line::selection {
          background: rgba(239, 68, 68, 0.3) !important;
        }

        .diff-code::selection {
          background: rgba(239, 68, 68, 0.3) !important;
        }

        /* Animation for line numbers */
        .diff-gutter {
          transition: all 0.2s ease !important;
        }

        /* Enhanced focus states */
        .diff-line:focus {
          outline: 2px solid #ef4444 !important;
          outline-offset: -2px !important;
          background-color: rgba(239, 68, 68, 0.1) !important;
        }
      `}</style>
    </motion.div>
  )
}

export default GitHubDiffViewer
