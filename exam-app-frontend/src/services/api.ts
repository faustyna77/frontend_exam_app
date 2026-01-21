import axios, { type AxiosInstance } from 'axios';
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
  TaskGenerationRequest,
  TaskGenerationResponse,
  GeneratedTasksResponse,
  GeneratedTask,
  CheckoutResponse,
  SubscriptionStatus,
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewStats,
} from '../types';

const API_BASE_URL = 'https://localhost:7013/api';

// Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dodaj token do każdego requestu
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/Auth/register', data);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/Auth/login', data);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

// Physics API
export const physicsApi = {
  // ✅ ZAKTUALIZOWANE - dodany parametr includeSolutions
  generateTasks: async (
    data: TaskGenerationRequest,
    includeSolutions: boolean = true
  ): Promise<TaskGenerationResponse> => {
    const response = await api.post<TaskGenerationResponse>(
      `/Physics/generate-tasks?includeSolutions=${includeSolutions}`,
      data
    );
    return response.data;
  },

  getStatistics: async (): Promise<any> => {
    const response = await api.get('/Physics/statistics');
    return response.data;
  },
};

// Generated Tasks API
export const generatedTasksApi = {
  // Pobierz listę zadań z SFWP
  getAll: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: string,
    level?: string,
    subject?: string,
    dateFilter?: string
  ): Promise<GeneratedTasksResponse> => {
    const response = await api.get<GeneratedTasksResponse>('/generated-tasks', {
      params: {
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
        level,
        subject,
        dateFilter,
      },
    });
    return response.data;
  },

  // Pobierz pojedyncze zadanie
  getById: async (id: number): Promise<GeneratedTask> => {
    const response = await api.get<GeneratedTask>(`/generated-tasks/${id}`);
    return response.data;
  },

  // Usuń zadanie
  delete: async (id: number): Promise<void> => {
    await api.delete(`/generated-tasks/${id}`);
  },

  // Usuń wiele zadań
  deleteBulk: async (ids: number[]): Promise<void> => {
    await api.delete('/generated-tasks/bulk', { data: ids });
  },

  // Export do PDF
  exportPdf: async (id: number, includeSolutions: boolean = true): Promise<Blob> => {
    const response = await api.get(`/generated-tasks/${id}/export-pdf`, {
      params: { includeSolutions },
      responseType: 'blob',
    });
    return response.data;
  },

  // Sprawdź limit PDF
  getPdfLimitStatus: async (): Promise<any> => {
    const response = await api.get('/generated-tasks/pdf-limit-status');
    return response.data;
  },
};

export const paymentApi = {
  createCheckout: async (planType: 'monthly' | 'yearly'): Promise<CheckoutResponse> => {
    const response = await api.post<CheckoutResponse>('/Payment/create-checkout', {
      planType,
    });
    return response.data;
  },

  getSubscriptionStatus: async (): Promise<SubscriptionStatus> => {
    const response = await api.get<SubscriptionStatus>('/Payment/subscription-status');
    return response.data;
  },
};

// Reviews API
export const reviewsApi = {
  // Pobierz wszystkie recenzje
  getAll: async (): Promise<Review[]> => {
    const response = await api.get<Review[]>('/Reviews');
    return response.data;
  },

  // Pobierz moją recenzję
  getMy: async (): Promise<Review | null> => {
    try {
      const response = await api.get<Review>('/Reviews/my');
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  // Dodaj recenzję
  create: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await api.post<Review>('/Reviews', data);
    return response.data;
  },

  // Aktualizuj moją recenzję
  update: async (data: UpdateReviewRequest): Promise<Review> => {
    const response = await api.put<Review>('/Reviews/my', data);
    return response.data;
  },

  // Usuń moją recenzję
  deleteMy: async (): Promise<void> => {
    await api.delete('/Reviews/my');
  },

  // Usuń recenzję (admin)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Reviews/${id}`);
  },

  // Pobierz statystyki
  getStats: async (): Promise<ReviewStats> => {
    const response = await api.get<ReviewStats>('/Reviews/stats');
    return response.data;
  },
};

export default api;