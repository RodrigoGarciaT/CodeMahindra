"use client"
import CodeMirror from "@uiw/react-codemirror"
import { cpp } from "@codemirror/lang-cpp"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
}

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <div className="h-full w-full border border-border rounded-md overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2 bg-[#1e1e1e] text-white">
        <div className="flex items-center space-x-4">
          <span>Language: C++14</span>
          <button className="p-1 hover:bg-gray-700 rounded">
            <span className="text-sm">Change Theme</span>
          </button>
        </div>
      </div>

      {/* CodeMirror Wrapper */}
      <div className="w-full h-full overflow-auto">
        <CodeMirror
          value={code}
          height="calc(100vh - 190px)"
          theme={vscodeDark}
          extensions={[cpp()]}
          onChange={onChange}
          className="w-full"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            syntaxHighlighting: true,
            foldGutter: true,
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor