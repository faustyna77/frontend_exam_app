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
  generateTasks: async (data: TaskGenerationRequest): Promise<TaskGenerationResponse> => {
    const response = await api.post<TaskGenerationResponse>('/Physics/generate-tasks', data);
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
    search?: string,        // ✅ W - Wyszukiwanie
    sortBy?: string,        // ✅ S - Sortowanie
    sortOrder?: string,     // ✅ S - Kierunek
    level?: string,         // ✅ F - Filtr poziom
    subject?: string,       // ✅ F - Filtr dział
    dateFilter?: string     // ✅ F - Filtr data
  ): Promise<GeneratedTasksResponse> => {
    const response = await api.get<GeneratedTasksResponse>('/GeneratedTasks', {
      params: { 
        page, 
        pageSize,
        search,
        sortBy,
        sortOrder,
        level,
        subject,
        dateFilter
      },
    });
    return response.data;
  },

  // Pobierz pojedyncze zadanie
  getById: async (id: number): Promise<GeneratedTask> => {
    const response = await api.get<GeneratedTask>(`/GeneratedTasks/${id}`);  // ✅ POPRAWIONE - nawiasy!
    return response.data;
  },

  // Usuń zadanie
  delete: async (id: number): Promise<void> => {
    await api.delete(`/GeneratedTasks/${id}`);  // ✅ POPRAWIONE - nawiasy!
  },

  // Usuń wiele zadań
  deleteBulk: async (ids: number[]): Promise<void> => {
    await api.delete('/GeneratedTasks/bulk', { data: ids });
  },

  // Export do PDF
  exportPdf: async (id: number, includeSolutions: boolean = true): Promise<Blob> => {
    const response = await api.get(`/GeneratedTasks/${id}/export-pdf`, {  // ✅ POPRAWIONE - nawiasy!
      params: { includeSolutions },
      responseType: 'blob',
    });
    return response.data;
  },

  // Sprawdź limit PDF
  getPdfLimitStatus: async (): Promise<any> => {
    const response = await api.get('/GeneratedTasks/pdf-limit-status');
    return response.data;
  },
};

export default api;