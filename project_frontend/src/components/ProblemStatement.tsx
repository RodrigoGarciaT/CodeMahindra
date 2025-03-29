import {Problem} from '../types/problem';
const ProblemStatement: React.FC = () => {
  const problem: Problem = {
    id: "1",
    title: "Sample Problem",
    description: "This is a sample problem statement. It should contain all the necessary information about the problem.",
    input_format: "Description of input format goes here...",
    output_format: "Description of output format goes here...",
    sample_input: "1 2 3\n4 5 6\n7 8 9", // Multiline sample input
    sample_output: "Sample output goes here...",
    difficulty: "Easy",
    creation_date: "2025-03-28",
    expiration_date: "2025-03-28",
    acceptance_rate: 85.5,
    testcases: []
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Problem Title</h1>
      <div className="prose max-w-none">
        <p className="mb-4">{problem.description}</p>
        <h2 className="text-xl font-semibold mb-2">Input Format</h2>
        <p className="mb-4">{problem.input_format}</p>
        <h2 className="text-xl font-semibold mb-2">Output Format</h2>
        <p className="mb-4">{problem.output_format}</p>
        <h2 className="text-xl font-semibold mb-2">Sample Input</h2>
        <pre className="bg-gray-100 p-4 rounded mb-4">{problem.sample_input}</pre>
        <h2 className="text-xl font-semibold mb-2">Sample Output</h2>
        <pre className="bg-gray-100 p-4 rounded mb-4">{problem.sample_output}</pre>
      </div>
    </div>
  );
};

export default ProblemStatement;