import axios from 'axios';
import { getToken, logout } from './auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach Bearer token
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout();
        }
        return Promise.reject(error);
    }
);

export async function ping() {
    const { data } = await api.get('/api/public/ping');
    return data;
}

export async function getMe() {
    const { data } = await api.get('/api/me');
    return data;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    tenantId: string;
    createdBy: string;
    createdAt: string;
}

export async function getProjects(): Promise<Project[]> {
    const { data } = await api.get('/api/projects');
    return data;
}

export async function createProject(name: string, description: string): Promise<Project> {
    const { data } = await api.post('/api/projects', { name, description });
    return data;
}

export async function deleteProject(id: number): Promise<void> {
    await api.delete(`/api/projects/${id}`);
}

export async function getMetrics() {
    const { data } = await api.get('/api/admin/metrics');
    return data;
}
