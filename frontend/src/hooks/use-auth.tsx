import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    () => sessionStorage.getItem("browseai_access_token") || null
  );
  const [loading, setLoading] = useState(true);

  // On mount: hit /refresh to restore session from httpOnly cookie
  useEffect(() => {
    axios
      .post("/api/auth/refresh", {}, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
        sessionStorage.setItem("browseai_access_token", res.data.accessToken);
      })
      .catch(() => {
        setUser(null);
        setAccessToken(null);
        sessionStorage.removeItem("browseai_access_token");
      })
      .finally(() => setLoading(false));
  }, []);

  // Attach accessToken to every outgoing request automatically
  useEffect(() => {
    const id = axios.interceptors.request.use((config) => {
      const token = sessionStorage.getItem("browseai_access_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => axios.interceptors.request.eject(id);
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch {
      // Clear client state regardless of server response
    } finally {
      setUser(null);
      setAccessToken(null);
      sessionStorage.removeItem("browseai_access_token");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, accessToken, setAccessToken, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}