
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

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call to your backend
      // For demo purposes, we'll simulate an API call
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is where you would normally send a request to your backend API
      // const response = await fetch('/api/login', { 
      //   method: 'POST', 
      //   body: JSON.stringify({ email, password }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const data = await response.json();
      
      // For demo, we'll just create a mock user
      const mockUser = {
        id: "1",
        name: email.split('@')[0],
        email
      };
      
      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call to your backend
      // For demo purposes, we'll simulate an API call
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is where you would normally send a request to your backend API
      // const response = await fetch('/api/signup', { 
      //   method: 'POST', 
      //   body: JSON.stringify({ name, email, password }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const data = await response.json();
      
      // For demo, we'll create a mock user
      const mockUser = {
        id: "1",
        name,
        email
      };
      
      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
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
