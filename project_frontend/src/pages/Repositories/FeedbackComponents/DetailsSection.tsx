import { useState } from "react";
import FileTreeNavigator from "./FileTreeNavigator";
import GitHubDiffViewer from "./GitHubDiffViewer";

export type FeedbackComment = {
  filePath: string;
  lineNumber: number;
  type: 'insert' | 'delete' | 'normal';
  comment: string;
};

type Props = {
  files: any[];
  fileTree: any[];
  stats: {
    files_changed: number;
    additions: number;
    deletions: number;
    total: number;
  };
  feedback: FeedbackComment[];
};

export default function DetailsSection({ files, fileTree, stats, feedback }: Props) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  return (
    <div className="flex w-full h-full bg-[#0d1117] border border-[#30363d] rounded-md overflow-hidden text-white">
      <div className="w-1/4 border-r border-[#30363d] overflow-y-auto">
        <FileTreeNavigator treeData={fileTree} onSelectFile={setSelectedPath} />
      </div>

      <div className="w-3/4 overflow-y-auto p-3">
        <GitHubDiffViewer
          files={files}
          selectedPath={selectedPath}
          stats={stats}
          feedback={feedback}
        />
      </div>
    </div>
  );
}
