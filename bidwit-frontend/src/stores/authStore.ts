import { create } from 'zustand';
import { toast } from 'react-toastify';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Mock user data for development
const MOCK_USERS = [
  { email: 'test@example.com', password: 'password123', name: 'Test User' }
];

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (email: string, password: string) => {
    try {
      // Mock authentication
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        const mockToken = 'mock-jwt-token';
        localStorage.setItem('token', mockToken);
        set({ isAuthenticated: true, user: { email: user.email, name: user.name } });
        toast.success('Successfully logged in!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      // Mock registration
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser = { email, password, name };
      MOCK_USERS.push(newUser);
      
      const mockToken = 'mock-jwt-token';
      localStorage.setItem('token', mockToken);
      set({ isAuthenticated: true, user: { email, name } });
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

      // Mock token validation
      const mockUser = MOCK_USERS[0]; // Just use the first mock user for demonstration
      set({ isAuthenticated: true, user: { email: mockUser.email, name: mockUser.name } });
    } catch (error) {
      localStorage.removeItem('token');
      set({ isAuthenticated: false, user: null });
    }
  },
})); 