import { createContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "../services/axiosInstance";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthContextType {
  user: any;
  login: (userData: any) => Promise<any>;
  logout: () => void;
  register: (email: string, username: string, password: string) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    logout: () => {},
    register: async () => {},
  });
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });
  

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const register = async ( email: string,username: string, password: string) => {
    try {
        console.log("api register ", email, username, password);
        
        const response = await axiosInstance.post("/auth/register", { email, password, username });
        return response.data;
      } catch (error) {
        throw error;
      }
  };

  const login = async (data: {email: string, password: string}) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);

      if (response) {
        localStorage.setItem("email", response.data.email); // Lưu token vào localStorage
        localStorage.setItem("username", response.data.username); // Lưu username vào localStorage
        localStorage.setItem("role", response.data.role); // Lưu username vào localStorage
        localStorage.setItem("id", response.data.id); // Lưu username vào localStorage
      }

      setUser(response.data);
      
      return response.data;
    } catch (error) {
      // throw error;
      toast.error("Invalide credentials, " + error)
      return
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
