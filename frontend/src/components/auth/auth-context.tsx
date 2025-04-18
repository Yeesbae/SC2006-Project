import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  phone_number: string;
  last_login: string | null;
  id: number;
  username: string;
  email: string;
  is_staff?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
  setUser: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/account/users/me",
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
          setIsAuthenticated(false);
        }
      };
      fetchUser();
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("authToken", token);
    setUser(userData);
    setIsAuthenticated(true);
    navigate("/");
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await axios.post(
          "http://127.0.0.1:8000/account/logout/",
          {},
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      }
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        console.error("Logout error:", error);
      }
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  // console.log('AuthProvider:', { user, isAuthenticated });
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUser }}>
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
