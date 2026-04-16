import { create } from "zustand";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  hydrateAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("finscore_jwt", token);
      localStorage.setItem("finscore_user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("finscore_jwt");
      localStorage.removeItem("finscore_user");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrateAuth: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("finscore_jwt");
      const userStr = localStorage.getItem("finscore_user");
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true });
        } catch (e) {
          localStorage.removeItem("finscore_jwt");
          localStorage.removeItem("finscore_user");
        }
      }
    }
  }
}));
