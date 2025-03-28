const ActionButtons = () => {
  return (
    <div className="bg-gray-100 p-3 border-t">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <button className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
            Upload Code as File
          </button>
          <button className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
            Test against custom input
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
            Run Code
          </button>
          <button className="px-4 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700">
            Submit Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;