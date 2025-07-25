import { createContext, useState, useEffect, useContext } from "react";
import axios from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verify token on initial load and when token changes
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
        // Verify token with the backend
        await axios.post("/api/auth/verify", { token });
        setIsAdmin(true);
      } catch (error) {
        console.error("Token verification failed:", error);
        // Only clear token if it's an authentication error
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem("token");
        }
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    verifyToken();
    
    // Set up listener for storage events (in case token is changed in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        verifyToken();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });
      
      localStorage.setItem("token", response.data.token);
      setIsAdmin(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);