import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Lock, User, AlertCircle } from "lucide-react";
import Toast from "../components/ui/Toast";

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
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

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username: formData.username,
        name: formData.name,
        password: formData.password,
      });
      setError("");
      setToast({
        show: true,
        type: "success",
        message:
          "Conta criada com sucesso! Você será redirecionado para o login.",
      });
      // Aguarda 2 segundos antes de redirecionar
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Ocorreu um erro ao criar a conta. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">PoliCardMed</h1>
          <p className="text-gray-600 mt-2">Criar nova conta</p>
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
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              fullWidth
              icon={<User className="h-5 w-5" />}
              required
            />

            <Input
              label="Nome Completo"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              icon={<User className="h-5 w-5" />}
              required
            />

            <Input
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              fullWidth
              icon={<Lock className="h-5 w-5" />}
              required
            />

            <Input
              label="Confirmar Senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              fullWidth
              icon={<Lock className="h-5 w-5" />}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                Criar Conta
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800"
            >
              Entrar
            </button>
          </p>
        </div>
      </Card>
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default Register;
