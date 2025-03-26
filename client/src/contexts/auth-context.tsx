
import { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface AuthContextType {
  user: any;
  loginMutation: any;
  registerMutation: any;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      const userData = await response.json();
      setUser(userData);
      return userData;
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; password: string; email: string; name: string }) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      
      const userData = await response.json();
      setUser(userData);
      return userData;
    }
  });

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginMutation, registerMutation, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
