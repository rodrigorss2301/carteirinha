import axios from 'axios';
import { Patient, HealthCard } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços para Pacientes
export const patientService = {
  getAll: () => api.get<Patient[]>('/patients'),
  getById: (id: string) => api.get<Patient>(`/patients/${id}`),
  getByCpf: (cpf: string) => api.get<Patient>(`/patients/cpf/${cpf}`),
  create: (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Patient>('/patients', data),
  update: (id: string, data: Partial<Patient>) => api.patch<Patient>(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`),
};

// Serviços para Carteirinhas de Saúde
export const healthCardService = {
  getAll: () => api.get<HealthCard[]>('/health-cards'),
  getById: (id: string) => api.get<HealthCard>(`/health-cards/${id}`),
  getByPatient: (patientId: string) => api.get<HealthCard[]>(`/health-cards/patient/${patientId}`),
  create: (data: Omit<HealthCard, 'id' | 'createdAt' | 'updatedAt'>) => api.post<HealthCard>('/health-cards', data),
  update: (id: string, data: Partial<HealthCard>) => api.patch<HealthCard>(`/health-cards/${id}`, data),
  delete: (id: string) => api.delete(`/health-cards/${id}`),
};

// Serviços de Autenticação
export const authService = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  register: (data: { username: string; password: string; name: string; role?: string }) => 
    api.post('/auth/register', data),
  verifyToken: () => api.get('/auth/verify'),
};

export default api;
