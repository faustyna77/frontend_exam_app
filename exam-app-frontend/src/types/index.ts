// Auth types
export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  tokenExpiry?: string;
  user?: User;
  message?: string;
}

// Physics types
export interface TaskGenerationRequest {
  taskTopic: string;
  difficultyLevel: string;
  physicsSubject: string;
  taskCount: number;
}

export interface ExamTask {
  content: string;
  answers: string[];
  correctAnswer: string;
  solution: string;
  source: string;
}

export interface TaskGenerationResponse {
  success: boolean;
  tasks: ExamTask[];
  message?: string;
}

// Physics types
export interface TaskGenerationRequest {
  taskTopic: string;
  difficultyLevel: string;
  physicsSubject: string;
  taskCount: number;
  taskType?: string;  // opcjonalne
}

export interface ExamTask {
  content: string;
  answers: string[];
  correctAnswer: string;
  solution: string;
  source: string;
}

// Generated Tasks types
export interface GeneratedTask {
  id: number;
  prompt: string;
  generatedText: string;
  createdAt: string;
}

export interface GeneratedTasksResponse {
  tasks: GeneratedTask[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ParsedTask {
  content: string;
  answers: string[] | null;
  correctAnswer: string;
  solution: string;
  source: string;
  pointsAvailable?: number;
}