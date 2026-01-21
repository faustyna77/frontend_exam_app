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
  taskType?: string;
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

// Generated Tasks types
export interface GeneratedTask {
  id: number;
  prompt: string;
  generatedText: string;
  createdAt: string;
}

// ✅ POPRAWIONY TYP
export interface GeneratedTasksResponse {
  items: GeneratedTask[];  // ← To jest pole, nie metoda!
  totalCount: number;
  currentPage: number;     // Zmienione z 'page' na 'currentPage'
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

// Payment types
export interface CreateCheckoutRequest {
  planType: 'monthly' | 'yearly';
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface SubscriptionStatus {
  isPremium: boolean;
  expiresAt: string | null;
  stripeCustomerId: string | null;
}

// Reviews types
export interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  rating: number;
  comment: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
}
// Generated Tasks types
export interface GeneratedTask {
  id: number;
  prompt: string;
  generatedText: string;
  createdAt: string;
}

// ✅ POPRAWIONY TYP - zgodny z tym co faktycznie zwraca API
export interface GeneratedTasksResponse {
  tasks: GeneratedTask[];    // ← Backend zwraca 'tasks', nie 'items'
  totalCount: number;
  page: number;              // ← Backend zwraca 'page', nie 'currentPage'
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