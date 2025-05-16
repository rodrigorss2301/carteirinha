import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Lock, User, AlertCircle } from "lucide-react";

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ username, password });

      if (isAuthenticated) {
        setToast({
          show: true,
          type: "success",
          message: "Login realizado com sucesso!",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setToast({
          show: true,
          type: "error",
          message: "Usuário ou senha inválidos",
        });
      }
    } catch (err) {
      setToast({
        show: true,
        type: "error",
        message: "Ocorreu um erro. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">PoliCardMed</h1>
          <p className="text-gray-600 mt-2">Entre na sua conta</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Input
              label="Usuário"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              icon={<User className="h-5 w-5" />}
              placeholder="admin"
              required
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              icon={<Lock className="h-5 w-5" />}
              placeholder="senha"
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                Entrar
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-800"
            >
              Cadastre-se
            </button>
          </p>
          <p className="text-sm text-gray-600">
            <span className="block mt-2 text-xs text-gray-500">
              Credenciais de Demonstração: admin / password
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
