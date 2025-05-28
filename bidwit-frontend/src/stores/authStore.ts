import create from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      set({ isAuthenticated: true, user: response.data.user });
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post('/api/auth/register', { email, password, name });
      localStorage.setItem('token', response.data.token);
      set({ isAuthenticated: true, user: response.data.user });
      toast.success('Successfully registered!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, user: null });
    toast.success('Successfully logged out!');
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isAuthenticated: false, user: null });
        return;
      }

      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ isAuthenticated: true, user: response.data.user });
    } catch (error) {
      localStorage.removeItem('token');
      set({ isAuthenticated: false, user: null });
    }
  },
})); 