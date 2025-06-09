"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import type { TestCase, ProblemFormData } from "../types/problem"
import {
  PlusCircle,
  Trash2,
  Save,
  Calendar,
  Code,
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react"

const CreateProblem = () => {
  const [problem, setProblem] = useState<ProblemFormData>({
    name: "",
    description: "",
    input_format: "",
    output_format: "",
    sample_input: "",
    sample_output: "",
    difficulty: "Easy",
    creation_date: new Date().toISOString(),
    expiration_date: new Date().toISOString(),
    testcases: [],
    solution: "",
    language: "C++",
  })

  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleProblemChange = (field: keyof ProblemFormData, value: string | null) => {
    setProblem((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addTestCase = () => {
    setProblem((prev) => ({
      ...prev,
      testcases: [
        ...prev.testcases,
        {
          id: crypto.randomUUID(),
          input: "",
          output: "",
        },
      ],
    }))
  }

  const updateTestCase = (id: string, field: keyof Omit<TestCase, "id">, value: string) => {
    setProblem((prev) => ({
      ...prev,
      testcases: prev.testcases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)),
    }))
  }

  const removeTestCase = (id: string) => {
    setProblem((prev) => ({
      ...prev,
      testcases: prev.testcases.filter((tc) => tc.id !== id),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const problemData = {
      name: problem.name,
      description: problem.description,
      input_format: problem.input_format,
      output_format: problem.output_format,
      sample_input: problem.sample_input,
      sample_output: problem.sample_output,
      difficulty: problem.difficulty,
      creationDate: problem.creation_date,
      expirationDate: problem.expiration_date,
      solution: problem.solution,
      language: problem.language,
      testcases: problem.testcases.map((tc) => ({
        input: tc.input,
        output: tc.output,
      })),
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/problems/with_testcases`, problemData)
      setConfirmationMessage("Problem created successfully!")
      setIsModalVisible(true)

      setProblem({
        name: "",
        description: "",
        input_format: "",
        output_format: "",
        sample_input: "",
        sample_output: "",
        difficulty: "Easy",
        creation_date: new Date().toISOString(),
        expiration_date: new Date().toISOString(),
        testcases: [],
        solution: "",
        language: "C++",
      })
    } catch (error) {
      console.error("Error creating problem:", error)
      setConfirmationMessage("Failed to create problem. Please try again.")
      setIsModalVisible(true)
    }
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setConfirmationMessage(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-rose-100 text-rose-800 border-rose-200"
      case "Hard":
        return "bg-red-200 text-red-900 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case "C++":
        return "🔧"
      case "Python":
        return "🐍"
      case "JavaScript":
        return "🟨"
      case "Java":
        return "☕"
      default:
        return "💻"
    }
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Problem</h1>
              <p className="text-gray-600">Design and configure a new coding challenge</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Problem Name</label>
                <input
                  type="text"
                  value={problem.name}
                  onChange={(e) => handleProblemChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter problem name..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Difficulty Level</label>
                <select
                  value={problem.difficulty}
                  onChange={(e) => handleProblemChange("difficulty", e.target.value as "Easy" | "Medium" | "Hard")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900"
                >
                  <option value="Easy">🟢 Easy</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Hard">🔴 Hard</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Problem Description</label>
              <textarea
                value={problem.description}
                onChange={(e) => handleProblemChange("description", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                rows={6}
                placeholder="Describe the problem in detail..."
                required
              />
            </div>
          </div>

          {/* Dates Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Timeline</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Creation Date</label>
                <input
                  type="date"
                  value={problem.creation_date.split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                  required
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Expiration Date</label>
                <input
                  type="date"
                  value={problem.expiration_date?.split("T")[0] || ""}
                  onChange={(e) =>
                    handleProblemChange(
                      "expiration_date",
                      e.target.value ? new Date(e.target.value).toISOString() : null,
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          {/* Input/Output Formats Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Input & Output Specifications</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Input Format</label>
                <textarea
                  value={problem.input_format}
                  onChange={(e) => handleProblemChange("input_format", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                  rows={4}
                  placeholder="Describe the input format..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Output Format</label>
                <textarea
                  value={problem.output_format}
                  onChange={(e) => handleProblemChange("output_format", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                  rows={4}
                  placeholder="Describe the output format..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Sample Input</label>
                <textarea
                  value={problem.sample_input}
                  onChange={(e) => handleProblemChange("sample_input", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500 font-mono text-sm bg-red-50 resize-none"
                  rows={4}
                  placeholder="Enter sample input..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Sample Output</label>
                <textarea
                  value={problem.sample_output}
                  onChange={(e) => handleProblemChange("sample_output", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500 font-mono text-sm bg-red-50 resize-none"
                  rows={4}
                  placeholder="Enter expected output..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Solution Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Solution</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Solution Code</label>
                <textarea
                  value={problem.solution}
                  onChange={(e) => handleProblemChange("solution", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500 font-mono text-sm bg-red-50 resize-none"
                  rows={8}
                  placeholder="Enter the solution code here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Programming Language</label>
                <select
                  value={problem.language}
                  onChange={(e) => handleProblemChange("language", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900"
                >
                  <option value="C++">🔧 C++</option>
                  <option value="Python">🐍 Python</option>
                  <option value="JavaScript">🟨 JavaScript</option>
                  <option value="Java">☕ Java</option>
                </select>

                <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2 text-red-800">
                    <span className="text-2xl">{getLanguageIcon(problem.language)}</span>
                    <span className="font-semibold">{problem.language}</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">Selected language for solution</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Test Cases</h2>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {problem.testcases.length} cases
                </span>
              </div>
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <PlusCircle className="w-5 h-5" />
                Add Test Case
              </button>
            </div>

            <div className="space-y-6">
              {problem.testcases.length === 0 ? (
                <div className="text-center py-12 bg-red-50 rounded-xl border-2 border-dashed border-red-300">
                  <CheckCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-600 mb-2">No test cases yet</h3>
                  <p className="text-red-500">Add test cases to validate solutions</p>
                </div>
              ) : (
                problem.testcases.map((testCase, index) => (
                  <div
                    key={testCase.id}
                    className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-xl border border-red-200 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 font-bold text-sm">#{index + 1}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Test Case {index + 1}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTestCase(testCase.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Input</label>
                        <textarea
                          value={testCase.input}
                          onChange={(e) => updateTestCase(testCase.id, "input", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500 font-mono text-sm bg-white resize-none"
                          rows={4}
                          placeholder="Enter test case input..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Expected Output</label>
                        <textarea
                          value={testCase.output}
                          onChange={(e) => updateTestCase(testCase.id, "output", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500 font-mono text-sm bg-white resize-none"
                          rows={4}
                          placeholder="Enter expected output..."
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
              >
                <Save className="w-6 h-6" />
                Create Problem
              </button>
            </div>
          </div>
        </form>

        {/* Enhanced Confirmation Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 ${
                confirmationMessage?.includes("successfully")
                  ? "border-red-200 bg-gradient-to-br from-red-50 to-rose-50"
                  : "border-red-200 bg-gradient-to-br from-red-50 to-pink-50"
              }`}
            >
              <div className="text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    confirmationMessage?.includes("successfully") ? "bg-red-100" : "bg-red-100"
                  }`}
                >
                  {confirmationMessage?.includes("successfully") ? (
                    <CheckCircle className="w-8 h-8 text-red-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    confirmationMessage?.includes("successfully") ? "text-red-800" : "text-red-800"
                  }`}
                >
                  {confirmationMessage?.includes("successfully") ? "Success!" : "Error!"}
                </h2>
                <p
                  className={`text-lg mb-6 ${
                    confirmationMessage?.includes("successfully") ? "text-red-700" : "text-red-700"
                  }`}
                >
                  {confirmationMessage}
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateProblem
