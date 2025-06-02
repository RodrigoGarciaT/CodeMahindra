import { useState } from "react";
import { Folder, FolderOpen, File as FileIcon, Plus, Pencil, Trash } from "lucide-react";

type FileNode = {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  status?: "added" | "modified" | "removed";
  file?: any;
};

type Props = {
  treeData: FileNode[];
  onSelectFile: (path: string) => void;
};

const statusColor = {
  added: "text-green-400",
  modified: "text-yellow-400",
  removed: "text-red-400",
};

const statusIcon = {
  added: <Plus size={14} />,
  modified: <Pencil size={14} />,
  removed: <Trash size={14} />,
};

const FileTreeNavigator = ({ treeData, onSelectFile }: Props) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderNode = (node: FileNode, parentPath = ""): JSX.Element => {
    const fullPath = `${parentPath}/${node.name}`;
    const isOpen = expanded[fullPath];

    if (node.type === "folder") {
      return (
        <div key={fullPath} className="pl-2">
          <div
            className="cursor-pointer flex items-center gap-1 py-1 px-2 hover:bg-[#21262d] rounded-md text-white"
            onClick={() => toggleExpand(fullPath)}
          >
            {isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
            <span className="font-semibold text-sm">{node.name}</span>
          </div>
          {isOpen && (
            <div className="pl-3">
              {node.children?.map((child) => renderNode(child, fullPath))}
            </div>
          )}
        </div>
      );
    }

    const status = node.status || "modified";

    return (
      <div
        key={fullPath}
        className={`pl-6 cursor-pointer flex items-center gap-1 py-1 px-2 hover:bg-[#1a1f25] rounded-md text-sm ${statusColor[status]}`}
        onClick={() => onSelectFile(node.file.filename)}
      >
        {statusIcon[status]}
        <FileIcon size={14} />
        <span>{node.name}</span>
      </div>
    );
  };

  return (
    <div className="p-2 text-sm">
      {treeData.map((node) => renderNode(node))}
    </div>
  );
};

export default FileTreeNavigator;
