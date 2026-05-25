import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

interface AuthContextType {
  accessToken: string | null;
  loading: boolean;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─────────────────────────────────────────────
// Decode JWT expiry without a library
// ─────────────────────────────────────────────
function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null; // convert to ms
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const exp = getTokenExpiry(token);
  if (!exp) return true;
  return Date.now() >= exp - 30_000; // treat as expired 30s early
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(
    () => sessionStorage.getItem("browseai_access_token") || null
  );
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─────────────────────────────────────────
  // Wrap setter to always sync sessionStorage
  // ─────────────────────────────────────────
  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      sessionStorage.setItem("browseai_access_token", token);
    } else {
      sessionStorage.removeItem("browseai_access_token");
    }
  };

  // ─────────────────────────────────────────
  // Call /refresh and return new token
  // ─────────────────────────────────────────
  const doRefresh = async (): Promise<string | null> => {
    try {
      const { data } = await axios.post(
        "/api/auth/refresh",
        {},
        { withCredentials: true }
      );
      setAccessToken(data.accessToken);
      scheduleRefresh(data.accessToken);
      return data.accessToken;
    } catch {
      setAccessToken(null);
      return null;
    }
  };

  // ─────────────────────────────────────────
  // Schedule silent refresh 1 minute before expiry
  // ─────────────────────────────────────────
  const scheduleRefresh = (token: string) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const exp = getTokenExpiry(token);
    if (!exp) return;
    const delay = exp - Date.now() - 60_000; // 1 min before expiry
    if (delay <= 0) {
      doRefresh();
      return;
    }
    refreshTimerRef.current = setTimeout(() => doRefresh(), delay);
  };

  // ─────────────────────────────────────────
  // On mount: use existing token if still valid,
  // otherwise call /refresh once from cookie
  // ─────────────────────────────────────────
  useEffect(() => {
    const existing = sessionStorage.getItem("browseai_access_token");

    if (existing && !isTokenExpired(existing)) {
      // Token is valid — trust it, skip the API call
      setAccessTokenState(existing);
      scheduleRefresh(existing);
      setLoading(false);
      return;
    }

    // Expired or missing — try cookie-based refresh
    doRefresh().finally(() => setLoading(false));

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  // ─────────────────────────────────────────
  // Request interceptor — attach token
  // ─────────────────────────────────────────
  useEffect(() => {
    const reqId = axios.interceptors.request.use((config) => {
      const token = sessionStorage.getItem("browseai_access_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    // ─────────────────────────────────────────
    // Response interceptor — silent retry on 401
    // ─────────────────────────────────────────
    const resId = axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
          original._retry = true;
          const newToken = await doRefresh();
          if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
            return axios(original); // retry original request
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqId);
      axios.interceptors.response.eject(resId);
    };
  }, []);

  const logout = async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch {
      // clear client state regardless
    } finally {
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}