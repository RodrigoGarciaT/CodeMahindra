import { useState } from 'react';
import { Resizable } from "re-resizable";
import Sidebar from '../components/Sidebar';
import ProblemStatement from '../components/ProblemStatement';
import CodeEditor from '../components/CodeEditor';
import ActionButtons from '../components/ActionButtons';
import Submissions from '../components/Submissions';
import Leaderboard from '../components/Leaderboard';
import Discussions from '../components/Discussions';

const Problems = () => {
  const [code, setCode] = useState('// Your code here');
  const [activeTab, setActiveTab] = useState('problem');

  const handleSubmissionSelect = (submissionCode: string) => {
    setCode(submissionCode);
  };

  return (
    <div className="h-screen bg-[#363B41] flex items-center justify-center">
      {/* Main Container with White Background */}
      <div className="w-[95%] h-[calc(100vh-64px)] bg-white shadow-lg rounded-lg flex overflow-hidden border border-gray-300">
        <Sidebar onTabChange={setActiveTab} />
        <div className="flex-1 flex">
          <Resizable
            defaultSize={{ width: "40%", height: "100%" }}
            minWidth="30%"
            maxWidth="70%"
            enable={{ right: true }}
            handleClasses={{
              right: "w-1 bg-gray-300 hover:bg-red-500 cursor-col-resize",
            }}
          >
            <div className="h-full overflow-auto pr-1">
              {activeTab === 'problem' && <ProblemStatement />}
              {activeTab === 'submissions' && <Submissions onSelectSubmission={handleSubmissionSelect} />}
              {activeTab === 'leaderboard' && <Leaderboard />}
              {activeTab === 'discussions' && <Discussions />}
            </div>
          </Resizable>
          <div className="flex-1 flex flex-col">
            <CodeEditor code={code} onChange={setCode} />
            <ActionButtons code = ""/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;