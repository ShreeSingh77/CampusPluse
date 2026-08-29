import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("campuspulse_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("campuspulse_token");
  });
const [loading, setLoading] = useState(true);

useEffect(() => {
  const restoreSession = async () => {
    const savedToken = localStorage.getItem("campuspulse_token");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
     const response = await api.get("/auth/me");

if (response.data.success) {
  const freshUser = response.data.user;

  setUser(freshUser);

  localStorage.setItem(
    "campuspulse_user",
    JSON.stringify(freshUser)
  );
}
    } catch (error) {
      console.log("Session restore failed:", error.message);

      localStorage.removeItem("campuspulse_user");
      localStorage.removeItem("campuspulse_token");

      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  restoreSession();
}, []);
  const login = (userData, accessToken) => {
    localStorage.setItem("campuspulse_user", JSON.stringify(userData));
    localStorage.setItem("campuspulse_token", accessToken);

    setUser(userData);
    setToken(accessToken);
  };

 const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error(
      "Logout API Error:",
      error.response?.data?.message || error.message
    );
  } finally {
    localStorage.removeItem("campuspulse_user");
    localStorage.removeItem("campuspulse_token");

    setUser(null);
    setToken(null);
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};