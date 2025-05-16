import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto mr-2" />
                <span className="text-blue-700 font-bold text-xl">Policlínica São Francisco</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {user?.role === 'admin' ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/patients"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Pacientes
                  </Link>
                  <Link
                    to="/cards"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Carteirinhas
                  </Link>
                </>
              ) : (
                <Link
                  to="/minha-carteirinha"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Minha Carteirinha
                </Link>
              )}
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative flex items-center">
                <span className="text-sm text-gray-700 mr-3">
                  Olá, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center text-sm text-gray-700 hover:text-blue-700"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Sair
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-sm text-gray-700 hover:text-green-700"
              >
                <User className="h-5 w-5 mr-1" />
                Entrar
              </Link>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Abrir menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {user?.role === 'admin' ? (
            <>
              <Link
                to="/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/patients"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pacientes
              </Link>
              <Link
                to="/cards"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Carteirinhas
              </Link>
            </>
          ) : (
            <Link
              to="/minha-carteirinha"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Minha Carteirinha
            </Link>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-1 flex items-center text-sm text-gray-500 hover:text-blue-700"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4">
              <Link
                to="/login"
                className="flex items-center text-base font-medium text-gray-500 hover:text-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-1" />
                Entrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;