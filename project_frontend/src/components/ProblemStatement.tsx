const ProblemStatement = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Problem Title</h1>
      <div className="prose max-w-none">
        <p className="mb-4">
          This is a sample problem statement. It should contain all the necessary
          information about the problem, including:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Problem description</li>
          <li>Input format</li>
          <li>Output format</li>
          <li>Constraints</li>
          <li>Sample test cases</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">Input Format</h2>
        <p className="mb-4">Description of input format goes here...</p>
        <h2 className="text-xl font-semibold mb-2">Output Format</h2>
        <p className="mb-4">Description of output format goes here...</p>
        <h2 className="text-xl font-semibold mb-2">Sample Input</h2>
        <pre className="bg-gray-100 p-4 rounded mb-4">
          Sample input goes here...
        </pre>
        <h2 className="text-xl font-semibold mb-2">Sample Output</h2>
        <pre className="bg-gray-100 p-4 rounded mb-4">
          Sample output goes here...
        </pre>
      </div>
    </div>
  );
};

export default ProblemStatement;