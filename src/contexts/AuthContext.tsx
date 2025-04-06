
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check token expiration
  const isTokenExpired = (token: string) => {
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      const expiry = payload.exp * 1000; // Convert seconds to milliseconds
      return Date.now() >= expiry;
    } catch (e) {
      return true; // If any error occurs during parsing, consider the token expired
    }
  };

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log("Token expired, logging out");
        logout();
      } else {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  // Add periodic token check
  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        console.log("Token expired during session, logging out");
        logout();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkTokenInterval);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", { email });
      
      // Call the actual login API
      const response = await fetch('https://testw-ndlu.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log("Login response:", data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (!data.token) {
        throw new Error('Authentication failed - no token received');
      }
      
      // Save token to localStorage
      localStorage.setItem("token", data.token);
      
      // Create user object from token data
      // In a real app, you might want to decode the JWT to get user info
      const userData = {
        id: "1", // This would normally come from the token
        name: email.split('@')[0], // Simple way to extract a name
        email
      };
      
      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting signup with:", { name, email });
      
      // Call the actual signup API
      const response = await fetch('https://testw-ndlu.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      console.log("Signup response:", data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      console.log("Signup successful, attempting login...");
      // After successful signup, log the user in
      await login(email, password);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
