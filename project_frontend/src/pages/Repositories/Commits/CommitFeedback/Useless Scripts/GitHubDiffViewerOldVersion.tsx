import React, { useState } from 'react';
import { Diff, Hunk, parseDiff, getChangeKey } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import axios from 'axios';
import './diff-dark-theme.css';
import { Change } from 'gitdiff-parser';
import BotCommentBanner from '../BotCommetBanner';

const GitHubDiffViewer: React.FC = () => {
  const [owner, setOwner] = useState('RodrigoGarciaT');
  const [repo, setRepo] = useState('CodeMahindra');
  const [sha, setSha] = useState('58fd90d9fe01509bb13e3ad0bb0fe4d944128a09');
  const [viewType, setViewType] = useState<'unified' | 'split'>('unified');

  const [diffText, setDiffText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDiff = async () => {
    setLoading(true);
    setError('');
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`;
      const res = await axios.get(url);
      const files = res.data.files;

      const fullDiff = files
        .filter((f: any) => f.patch)
        .map(
          (f: any) =>
            `diff --git a/${f.filename} b/${f.filename}\n` +
            `--- a/${f.filename}\n` +
            `+++ b/${f.filename}\n` +
            f.patch
        )
        .join('\n');

      setDiffText(fullDiff);
    } catch (err) {
      console.error(err);
      setError('No se pudo obtener el diff. Verifica el owner, repo y SHA.');
      setDiffText('');
    } finally {
      setLoading(false);
    }
  };

  const files = diffText ? parseDiff(diffText) : [];

  // Comentarios simulados por el bot
  const feedback = [
    {
        filePath: 'backend/routes/employee_routes.py',
        lineNumber: 70,
        type: 'delete',
        comment: '✅ Buena práctica: Se añadió una respuesta clara para el usuario.'
    },
    {
        filePath: 'backend/controllers/employee_controller.py',
        lineNumber: 85,
        type: 'insert',
        comment: '🔍 Sugerencia: Validar que `employee_id` no sea null antes de usarlo.'
    },
    {
        filePath: 'backend/controllers/employee_controller.py',
        type: 'normal',
        lineNumber: 2,
        comment: '📌 Considera dividir esta función para mayor claridad.'
    },
  ];


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


  return (
    <div className="bg-[#0d1117] text-white p-6 font-mono min-h-screen space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Visualizador de Commits GitHub</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Owner (e.g., RodrigoGarciaT)"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="p-2 bg-[#161b22] border border-gray-700 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Repo (e.g., CodeMahindra)"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="p-2 bg-[#161b22] border border-gray-700 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="SHA del Commit"
            value={sha}
            onChange={(e) => setSha(e.target.value)}
            className="p-2 bg-[#161b22] border border-gray-700 rounded-md w-full"
          />
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value as 'unified' | 'split')}
            className="p-2 bg-[#161b22] border border-gray-700 rounded-md w-full"
          >
            <option value="unified">Unified</option>
            <option value="split">Split</option>
          </select>
        </div>
        <button
          onClick={fetchDiff}
          className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-semibold"
        >
          Ver Diff
        </button>
      </div>

      {loading && <p className="text-gray-400">Cargando diff...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {files.length > 0 &&
        files.map((file, index) => (
          <div key={index}>
            <div className="text-sm font-bold text-gray-400 mb-1">
              {file.oldPath} → {file.newPath}
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
        ))}
    </div>
  );
};

export default GitHubDiffViewer;
