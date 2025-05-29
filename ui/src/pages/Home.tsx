import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { Heart, Shield, Users, CreditCard, Check } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  cpf: string;
  email: string;
  HealthCards: Array<{
    cardNumber: string;
    status: string;
    validUntil: string;
  }>;
}

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/patients")
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-green-600 font-bold text-xl">
                PoliCardMed
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600">Olá, {user?.name}</span>
                  <Link to="/dashboard">
                    <Button variant="primary">Painel</Button>
                  </Link>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="primary">Entrar</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Carteirinhas Digitais para seus Pacientes
              </h1>
              <p className="text-xl mb-8 text-green-100">
                {isAuthenticated
                  ? `Bem-vindo de volta, ${user?.name}! Continue gerenciando suas carteirinhas digitais.`
                  : "Uma solução moderna para profissionais de saúde emitirem e gerenciarem carteirinhas digitais para seus pacientes."}
              </p>
              <div className="space-x-4">
                <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-green-700 hover:bg-green-50"
                  >
                    Começar Agora
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-80 h-48 bg-white rounded-xl shadow-lg transform rotate-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 p-4">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-white">
                      PoliCardMed
                    </h3>
                    <div className="text-xs bg-green-900 px-2 py-1 rounded text-white">
                      Plano Premium
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
                    <p className="font-bold">Maria Silva</p>
                    <p className="text-xs opacity-90">Membro #PCM1234567</p>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs">Válido até: 31/12/2025</p>
                      <p className="text-xs">Desde: 15/05/2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o PoliCardMed?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nosso sistema de carteirinhas digitais simplifica o gerenciamento
              de membros e melhora a experiência do paciente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestão Fácil de Pacientes
              </h3>
              <p className="text-gray-600">
                Cadastre e gerencie informações dos pacientes com uma interface
                simples e intuitiva.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Carteirinhas Digitais
              </h3>
              <p className="text-gray-600">
                Crie carteirinhas digitais profissionais que podem ser
                compartilhadas e verificadas eletronicamente.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Seguro e Confiável
              </h3>
              <p className="text-gray-600">
                Mantenha os dados dos pacientes seguros com nosso robusto
                sistema de autenticação e permissões.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais de saúde confiam no PoliCardMed para suas
              necessidades de gestão de pacientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <span className="text-green-600 font-semibold">CS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Clínica Saúde Total
                  </h4>
                  <p className="text-gray-600 text-sm">São Paulo, Brasil</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "O PoliCardMed transformou a forma como gerenciamos as
                carteirinhas dos nossos pacientes. As carteirinhas digitais são
                fáceis de usar e nossos pacientes adoram a abordagem moderna."
              </p>
              <div className="mt-4 flex">
                <Check className="h-5 w-5 text-blue-500 mr-1" />
                <span className="text-sm text-gray-500">
                  Usando PoliCardMed desde 2023
                </span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">HV</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Hospital Vida Nova
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Rio de Janeiro, Brasil
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Os ganhos de eficiência usando o PoliCardMed foram
                substanciais. Reduzimos o trabalho administrativo e melhoramos a
                experiência dos nossos pacientes."
              </p>
              <div className="mt-4 flex">
                <Check className="h-5 w-5 text-blue-500 mr-1" />
                <span className="text-sm text-gray-500">
                  Usando PoliCardMed desde 2022
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para modernizar sua operação de saúde?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-3xl mx-auto">
            Junte-se a milhares de profissionais de saúde que confiam no
            PoliCardMed para suas necessidades de gestão de pacientes.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/login"}>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-green-700 hover:bg-green-50"
            >
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold">PoliCardMed</h3>
              <p className="text-gray-400 mt-2">
                Soluções modernas para gestão de saúde
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:gap-20">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                  Empresa
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Sobre Nós
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Carreiras
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Contato
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                  Legal
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Política de Privacidade
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Termos de Serviço
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 md:flex md:items-center md:justify-between">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} PoliCardMed. Todos os direitos
              reservados.
            </p>
            <div className="mt-4 md:mt-0 flex items-center">
              <p className="text-sm text-gray-400 flex items-center">
                Feito com <Heart className="h-4 w-4 mx-1 text-red-500" /> para
                uma saúde melhor
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
