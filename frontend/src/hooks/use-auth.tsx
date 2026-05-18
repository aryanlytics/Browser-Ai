import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("browseai_token"));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (token) {
      // Fetch user profile
      fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            setUser(data);
          } else {
            // Invalid token
            setToken(null);
            localStorage.removeItem("browseai_token");
          }
        })
        .catch(() => {
          // Assume valid but offline for now, or just fail
          setToken(null);
          localStorage.removeItem("browseai_token");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("browseai_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("browseai_token");
    setToken(null);
    setUser(null);
    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
