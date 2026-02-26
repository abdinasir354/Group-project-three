import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("quiz_token"));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("quiz_token");
    const savedUser = localStorage.getItem("quiz_user");

    if (!savedToken || !savedUser) return null;

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("quiz_user");
      return null;
    }
  });
  const loading = false;

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("quiz_token", userToken);
    localStorage.setItem("quiz_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("quiz_token");
    localStorage.removeItem("quiz_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


//user authantication
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
