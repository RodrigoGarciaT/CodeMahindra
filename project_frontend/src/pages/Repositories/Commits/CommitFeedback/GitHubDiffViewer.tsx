import React, { useEffect, useRef, useState } from 'react';
import { Diff, Hunk, parseDiff, getChangeKey } from 'react-diff-view';
import { LayoutPanelLeft } from "lucide-react";
import 'react-diff-view/style/index.css';
import './diff-dark-theme.css';
import { Change } from 'gitdiff-parser';
import BotCommentBanner from './BotCommetBanner';

type FeedbackComment = {
  filePath: string;
  lineNumber: number;
  type: 'insert' | 'delete' | 'normal';
  comment: string;
};

type FileEntry = {
  filename: string;
  patch?: string;
  additions: number;
  deletions: number;
};

type Props = {
  files: FileEntry[];
  selectedPath: string | null;
  feedback?: FeedbackComment[];
  stats: {
    files_changed: number;
    additions: number;
    deletions: number;
    total: number;
  };
};

const GitHubDiffViewer: React.FC<Props> = ({
  files,
  selectedPath,
  stats,
  feedback = [],
}) => {
  const [viewType, setViewType] = useState<'unified' | 'split'>('unified');

  const diffText = files
    .filter((f) => f.patch)
    .map(
      (f) =>
        `diff --git a/${f.filename} b/${f.filename}\n` +
        `--- a/${f.filename}\n` +
        `+++ b/${f.filename}\n` +
        f.patch
    )
    .join('\n');

  const parsedFiles = parseDiff(diffText);
  const selectedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedPath]);

  const buildWidgets = (hunks: any[], filePath: string) => {
    const widgets: Record<string, React.ReactNode> = {};

    hunks.forEach((hunk) => {
      hunk.changes.forEach((change: Change) => {
        const key = getChangeKey(change);

        const line =
          change.type === 'insert'
            ? change.lineNumber
            : change.type === 'delete'
            ? change.lineNumber
            : change.type === 'normal'
            ? change.newLineNumber
            : undefined;

        if (line === undefined) return;

        const feedbackItem = feedback.find(
          (f) =>
            f.lineNumber === line &&
            f.type === change.type &&
            f.filePath === filePath
        );

        if (feedbackItem) {
          widgets[key] = <BotCommentBanner comment={feedbackItem.comment} />;
        }
      });
    });

    return widgets;
  };

  const renderDiffBars = (additions: number, deletions: number) => {
    const total = additions + deletions || 1;
    const totalBars = 5;

    const addCount = Math.round((additions / total) * totalBars);
    const delCount = Math.round((deletions / total) * totalBars);

    const bars = [];

    for (let i = 0; i < totalBars; i++) {
        if (i < addCount) {
        bars.push(<div key={i} className="w-3 h-3 bg-green-500 rounded-sm" />);
        } else if (i < addCount + delCount) {
        bars.push(<div key={i} className="w-3 h-3 bg-red-500 rounded-sm" />);
        } else {
        bars.push(<div key={i} className="w-3 h-3 bg-white/20 rounded-sm" />);
        }
    }

    return <div className="flex gap-[2px] ml-2">{bars}</div>;
  };

  return (
    <div className="space-y-6">
      {/* Top stats bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-md">
        <div className="flex items-center gap-3 text-white">
            <LayoutPanelLeft size={18} />

            <span className="text-sm font-semibold">{stats.files_changed} files changed</span>

            <div className="flex items-baseline gap-2 text-xs text-white/70 ml-2">
                <span className="text-green-500 font-medium">+{stats.additions}</span>
                <span className="text-red-500 font-medium">-{stats.deletions}</span>
                <span>lines changed</span>
            </div>
        </div>

        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setViewType('unified')}
            className={`px-3 py-1 rounded-md ${
              viewType === 'unified'
                ? 'bg-[#238636] text-white'
                : 'bg-[#0d1117] border border-[#30363d] text-white/80'
            }`}
          >
            Unified
          </button>
          <button
            onClick={() => setViewType('split')}
            className={`px-3 py-1 rounded-md ${
              viewType === 'split'
                ? 'bg-[#238636] text-white'
                : 'bg-[#0d1117] border border-[#30363d] text-white/80'
            }`}
          >
            Split
          </button>
        </div>
      </div>

      {/* Diffs */}
      {parsedFiles.map((file, index) => {
        const isSelected = file.newPath === selectedPath;
        return (
          <div
            key={index}
            ref={isSelected ? selectedRef : null}
            className={isSelected ? 'border border-blue-600 rounded-md p-1' : ''}
          >
            <div className="flex justify-between items-center text-sm font-medium mb-1 px-1">
                <span className="text-white/80">
                    {file.oldPath} → {file.newPath}
                </span>
                <span className="text-xs flex gap-2 text-white/60 font-mono">
                    <span className="text-green-500 font-semibold">+{files[index].additions}</span>
                    <span className="text-red-500 font-semibold">-{files[index].deletions}</span>
                    {renderDiffBars(files[index].additions, files[index].deletions)}
                </span>
            </div>

            <Diff
              viewType={viewType}
              diffType={file.type}
              hunks={file.hunks}
              widgets={buildWidgets(file.hunks, file.newPath)}
            >
              {(hunks) =>
                hunks.map((hunk) => (
                  <Hunk key={hunk.content} hunk={hunk} />
                ))
              }
            </Diff>
          </div>
        );
      })}
    </div>
  );
};

export default GitHubDiffViewer;
