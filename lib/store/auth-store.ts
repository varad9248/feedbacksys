// store/authStore.ts
import { create } from 'zustand';
import axios from 'axios';

type User =  {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      set({ user: res.data.user });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Login failed' });
    } finally {
      set({ loading: false });
    }
  },

  register: async ( email, password , name) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post('/api/auth/register', {
        name : name,
        email : email,
        password : password,
      });
      set({ user: res.data.user });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Registration failed' });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
      set({ user: null });
      if(typeof window !== "undefined"){
        window.location.href = "/auth/login";
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Logout failed' });
    }
  },

  getUser: async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data.user) {
        set({ user: res.data.user });
      } else {
        set({ user: null });
      }
    } catch (err) {
      set({ user: null, error: null }); // don't show error for silent auth
    }
  },

  clearError: () => set({ error: null }),
}));
