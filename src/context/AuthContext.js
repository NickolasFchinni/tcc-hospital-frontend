"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      const decoded = jwtDecode(savedToken);
      setUser(decoded);
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    setAuthLoading(true); 
    const decoded = jwtDecode(token);
    setUser(decoded);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("hasRefreshed", "false");
    
    setAuthLoading(false); 
    router.push("/home"); 
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("hasRefreshed");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
