import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User } from "../types";
import { authService } from "../services/api";
import { AxiosError } from "axios";

interface AuthResponse {
  token: string;
  user: User;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  name: string;
  password: string;
}

interface AuthError {
  message: string;
  code?: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  error: AuthError | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [error, setError] = useState<AuthError | null>(null);

  const clearError = () => setError(null);

  const handleApiError = (error: unknown): AuthError => {
    if (error instanceof Error) {
      const axiosError = error as AxiosError<{
        message: string;
        code?: string;
      }>;
      return {
        message: axiosError.response?.data?.message || error.message,
        code: axiosError.response?.data?.code,
      };
    }
    return { message: "An unknown error occurred" };
  };

  const verifyToken = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const response = await authService.verifyToken();
      return response.data.valid;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          const isTokenValid = await verifyToken();
          if (isTokenValid) {
            setAuthState({
              user: JSON.parse(storedUser),
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        }

        logout();
      } catch (error) {
        console.error("Auth initialization failed:", error);
        logout();
      } finally {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async ({
    username,
    password,
  }: LoginCredentials): Promise<void> => {
    try {
      const { data } = await authService.login(username, password);
      const { token, user } = data as AuthResponse;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      setError(null);
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError);
      throw new Error(apiError.message);
    }
  };

  const register = async ({
    username,
    name,
    password,
  }: RegisterCredentials): Promise<void> => {
    try {
      await authService.register({
        username,
        name,
        password,
        role: "paciente",
      });
      setError(null);
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError);
      throw new Error(apiError.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        verifyToken,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
