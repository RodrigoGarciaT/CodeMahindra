export interface TestCase {
    id: string;
    input: string;
    output: string;
  }
  
  export interface Problem {
    id: string;
    title: string;
    description: string;
    input_format: string;
    output_format: string;
    sample_input: string;
    sample_output: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    creation_date: string;
    expiration_date: string | null;
    acceptance_rate: number;
    testcases: TestCase[];
    // No need to include 'solution' and 'language' here
  }
  
  export type ProblemFormData = Omit<Problem, 'id' | 'acceptance_rate'> & {
    solution: string;  // New attribute for the solution code
    language: string;  // New attribute for the language of the solution
  };