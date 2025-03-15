import { createContext, useContext, useEffect, useState } from "react";
import authApi from "../api/authApi";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        return;
      }
      const response = await authApi.getProfile();
      setUser(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (username, password) => {
    try {
      await authApi.login({ username, password });
      await fetchUser();

      setUser(response.data);

      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  const logout = async () => {
    setUser(null);
    await Cookies.remove("token");
    await Cookies.remove("refeshToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
