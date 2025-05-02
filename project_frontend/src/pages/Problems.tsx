import { useState, useEffect } from 'react';
import { Resizable } from "re-resizable";
import Sidebar from '../components/Sidebar';
import ProblemStatement from '../components/ProblemStatement';
import CodeEditor from '../components/CodeEditor';
import ActionButtons from '../components/ActionButtons';
import Submissions from '../components/Submissions';
import Leaderboard from '../components/Leaderboard';
import Discussions from '../components/Discussions';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Comment, Submission } from '../types/submission';

const Problems = () => {
  const employeeId = 'f683124d-6fc7-4586-8590-86573f5aa66e'
  const [code, setCode] = useState('// Your code here');
  const [activeTab, setActiveTab] = useState('problem');
  const location = useLocation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("C++");
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);

  const handleSubmissionSelect = (submissionCode: string, language: string) => {
    setCode(submissionCode);
    setSelectedLanguage(language);
  };

  const problemId = location.state?.problemId || 1;

  const getComments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comments/fromProblem/${problemId}`);
      const comments = response.data.map((comment: any) => ({
        id: comment.id,
        userName: comment.firstName + ' ' + comment.lastName,
        profilePic: comment.profilePicture,
        comment: comment.description,
        postDate: comment.messageDate,
        employeeId: comment.employee_id
      }));
      setComments(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const getSubmissions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/solutions/employee/${employeeId}/problem/${problemId}`
      );
      const formattedSubmissions = response.data.map((solution: any) => ({
        id: solution.id.toString(),
        sent_date: solution.submissionDate,
        status: solution.status,
        code: solution.code,
        runtime: `${solution.executionTime}s`,
        memory: `${solution.memory}MB`,
        inTeam: solution.inTeam,
        language: solution.language
      }));
      setSubmissions(formattedSubmissions);
    } catch (err) {
      setSubmissionsError('Failed to fetch submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getComments();
      await getSubmissions();
    };
    fetchData();
  }, [problemId]);

  return (
    <div className="h-screen bg-[#363B41] flex items-center justify-center">
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
              {activeTab === 'problem' && <ProblemStatement problemId={problemId} />}
              {activeTab === 'submissions' && (
                <Submissions 
                  submissions={submissions}
                  loading={loadingSubmissions}
                  error={submissionsError}
                  onSelectSubmission={handleSubmissionSelect}
                />
              )}
              {activeTab === 'leaderboard' && <Leaderboard />}
              {activeTab === 'discussions' && (
                <Discussions 
                  problemId={problemId} 
                  comments={comments}
                  setComments={setComments}
                  employeeId={employeeId}
                />
              )}
            </div>
          </Resizable>
          <div className="flex-1 flex flex-col">
            <CodeEditor code={code} onChange={setCode} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage}  />
            <ActionButtons code={code} problemId={problemId} employeeId={employeeId} language={selectedLanguage}  />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;