import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("campuspulse_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem("campuspulse_user", JSON.stringify(userData));
    localStorage.setItem("campuspulse_token", token);

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("campuspulse_user");
    localStorage.removeItem("campuspulse_token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};