import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";

// shape of context value:
// { user, loading, login, register, logout }
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // try to bootstrap auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("quiz_token");
    const userData = localStorage.getItem("quiz_user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        // corrupted data, clear it
        localStorage.removeItem("quiz_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password, isAdmin = false }) => {
    // choose endpoint based on role
    const route = isAdmin ? "/admin/login" : "/student/login";
    const res = await api.post(route, { email, password });
    const payload = res.data;

    // the backend returns either { token, student } or { token, admin }
    const currentUser = isAdmin ? payload.admin : payload.student;
    const normalized = {
      ...currentUser,
      role: currentUser.role || (isAdmin ? "admin" : "student"),
    };

    setUser(normalized);
    localStorage.setItem("quiz_token", payload.token);
    localStorage.setItem("quiz_user", JSON.stringify(normalized));

    return normalized;
  };

  const register = async ({ name, email, password }) => {
    const res = await api.post("/student/register", { name, email, password });
    const payload = res.data;
    const normalized = { ...payload.student, role: "student" };

    setUser(normalized);
    localStorage.setItem("quiz_token", payload.token);
    localStorage.setItem("quiz_user", JSON.stringify(normalized));

    return normalized;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("quiz_token");
    localStorage.removeItem("quiz_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;