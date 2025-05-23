import React from 'react';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/dashboard/StatsCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { usePatients } from '../context/PatientContext';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  UserPlus,
  Calendar,
  Clock,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PaymentList from '../components/Payments/PaymentList';
import AdminStats from '../components/Admin/AdminStats'; // Import AdminStats
import AdminRecentPayments from '../components/Admin/AdminRecentPayments'; // Import AdminRecentPayments
import AdminSubscriberPayments from '../components/Admin/AdminSubscriberPayments'; // Import AdminSubscriberPayments

const Dashboard: React.FC = () => {
  const { patients } = usePatients();
  const { user } = useAuth();
  
  // Calcular vencimentos próximos (próximos 30 dias)
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const expiringSoon = patients.filter(patient => {
    const validUntil = new Date(patient.validUntil);
    return validUntil > today && validUntil <= thirtyDaysFromNow;
  });
  
  // Obter pacientes recentes (últimos 5)
  const recentPatients = [...patients]
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
    .slice(0, 4);
  
  // Distribuição dos tipos de plano
  const planCounts = patients.reduce((acc, patient) => {
    const { planType } = patient;
    acc[planType] = (acc[planType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  if (user && user.role === 'admin') {
    // Admin Dashboard View
    return (
      <Layout>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview and management tools.</p>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Statistics</h2>
        <AdminStats />
        
        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Recent Payments</h2>
        <AdminRecentPayments limit={10} />
        
        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Subscriber Payments Management</h2>
        <AdminSubscriberPayments />
        
      </Layout>
    );
  }

  // Default Dashboard for other authenticated users (e.g., subscribers, pacientes)
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
        <p className="text-gray-600">Bem-vindo ao sistema de gestão PoliCardMed.</p>
      </div>
      
      {/* Existing content for non-admin users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Pacientes"
          value={patients.length} // This data might not be relevant/available for all roles
          icon={<Users className="h-6 w-6 text-blue-600" />}
          // change={{ value: '5%', isPositive: true }} // Example, might need adjustment
        />
        <StatsCard
          title="Carteirinhas Ativas" // Placeholder, may need role-specific logic
          value={patients.length} // This data might not be relevant/available for all roles
          icon={<CreditCard className="h-6 w-6 text-blue-600" />}
        />
        <StatsCard
          title="Vencendo em Breve" // Placeholder, may need role-specific logic
          value={expiringSoon.length} // This data might not be relevant/available for all roles
          icon={<Calendar className="h-6 w-6 text-blue-600" />}
        />
        <StatsCard
          title="Novos este Mês" // Placeholder, may need role-specific logic
          value="N/A" // Example, might need adjustment
          icon={<UserPlus className="h-6 w-6 text-blue-600" />}
          // change={{ value: '12%', isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividade Recente - Placeholder, may need role-specific logic */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pacientes Recentes</h2>
              <Link to="/patients" className="text-sm text-blue-600 hover:underline">
                Ver Todos
              </Link>
            </div>
            <div className="divide-y">
              {recentPatients.map(patient => (
                <div key={patient.id} className="py-3 flex items-center justify-between">
                  {/* Patient details */}
                   <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      {patient.photo ? (
                        <img src={patient.photo} alt={patient.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <Users className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">{patient.planType}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </Card>

          {/* Carteirinhas a Vencer - Placeholder, may need role-specific logic */}
          <Card>
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Carteirinhas a Vencer</h2>
              <Link to="/cards" className="text-sm text-blue-600 hover:underline">
                Ver Todas
              </Link>
            </div>
            <div className="divide-y">
              {expiringSoon.map(patient => (
                <div key={patient.id} className="py-3 flex items-center justify-between">
                  {/* Expiring card details */}
                   <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">
                        Vence em: {new Date(patient.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Renovar</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Alertas e Ações Rápidas - Placeholder, may need role-specific logic */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            {/* Action buttons, may need role-specific logic */}
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertas do Sistema</h2>
            {/* System alerts, may need role-specific logic */}
          </Card>
        </div>
      </div>

      {/* Payments Section for Subscribers */}
      {user && user.role === 'subscriber' && (
        <div className="mt-8">
          <PaymentList />
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;