import { useState } from 'react';
import { Problem, TestCase, ProblemFormData } from '../types/problem';
import { PlusCircle, Trash2, Save, Edit2 } from 'lucide-react';

const CreateProblem = () => {
  const [problem, setProblem] = useState<ProblemFormData>({
    title: '',
    description: '',
    input_format: '',
    output_format: '',
    sample_input: '',
    sample_output: '',
    difficulty: 'Easy',
    creation_date: new Date().toISOString(),
    expiration_date: new Date().toISOString(),
    testcases: [],
    solution: '', // New field for the solution code
    language: 'C++', // New field for the language of the solution
  });

  const handleProblemChange = (field: keyof ProblemFormData, value: string | null) => {
    setProblem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTestCase = () => {
    setProblem(prev => ({
      ...prev,
      testcases: [
        ...prev.testcases,
        {
          id: crypto.randomUUID(),
          input: '',
          output: ''
        }
      ]
    }));
  };

  const updateTestCase = (id: string, field: keyof Omit<TestCase, 'id'>, value: string) => {
    setProblem(prev => ({
      ...prev,
      testcases: prev.testcases.map(tc => 
        tc.id === id ? { ...tc, [field]: value } : tc
      )
    }));
  };

  const removeTestCase = (id: string) => {
    setProblem(prev => ({
      ...prev,
      testcases: prev.testcases.filter(tc => tc.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Problem data:', problem);
    // Here you would typically send the data to a backend
  };

  return (
    <div className="min-h-screen bg-[#363B41] py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Problem</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Problem Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={problem.title}
                onChange={(e) => handleProblemChange('title', e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={problem.difficulty}
                onChange={(e) => handleProblemChange('difficulty', e.target.value as 'Easy' | 'Medium' | 'Hard')}
                className="w-full p-2 border rounded-md"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creation Date
              </label>
              <input
                type="date"
                value={problem.creation_date.split('T')[0]}
                className="w-full p-2 border rounded-md"
                required
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date
              </label>
              <input
                type="date"
                value={problem.expiration_date?.split('T')[0] || ''}
                onChange={(e) => handleProblemChange('expiration_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
                className="w-full p-2 border rounded-md"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Description and Formats */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={problem.description}
              onChange={(e) => handleProblemChange('description', e.target.value)}
              className="w-full p-2 border rounded-md h-32"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Format
              </label>
              <textarea
                value={problem.input_format}
                onChange={(e) => handleProblemChange('input_format', e.target.value)}
                className="w-full p-2 border rounded-md h-24"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <textarea
                value={problem.output_format}
                onChange={(e) => handleProblemChange('output_format', e.target.value)}
                className="w-full p-2 border rounded-md h-24"
                required
              />
            </div>
          </div>

          {/* Sample Input and Output */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sample Input
              </label>
              <textarea
                value={problem.sample_input}
                onChange={(e) => handleProblemChange('sample_input', e.target.value)}
                className="w-full p-2 border rounded-md h-24"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sample Output
              </label>
              <textarea
                value={problem.sample_output}
                onChange={(e) => handleProblemChange('sample_output', e.target.value)}
                className="w-full p-2 border rounded-md h-24"
                required
              />
            </div>
          </div>

          {/* Solution and Language */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Solution (Code)
              </label>
              <textarea
                value={problem.solution}
                onChange={(e) => handleProblemChange('solution', e.target.value)}
                className="w-full p-2 border rounded-md h-32"
                placeholder="Enter the solution code here..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={problem.language}
                onChange={(e) => handleProblemChange('language', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="C++">C++</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Java">Java</option>
              </select>
            </div>
          </div>

          {/* Test Cases */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Test Cases</h2>
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Test Case
              </button>
            </div>

            <div className="space-y-4">
              {problem.testcases.map((testCase, index) => (
                <div key={testCase.id} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Test Case #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeTestCase(testCase.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Input
                      </label>
                      <textarea
                        value={testCase.input}
                        onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                        className="w-full p-2 border rounded-md h-24"
                        placeholder="Enter test case input..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Output
                      </label>
                      <textarea
                        value={testCase.output}
                        onChange={(e) => updateTestCase(testCase.id, 'output', e.target.value)}
                        className="w-full p-2 border rounded-md h-24"
                        placeholder="Enter expected output..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProblem;
