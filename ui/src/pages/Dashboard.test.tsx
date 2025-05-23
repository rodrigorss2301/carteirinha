import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { usePatients } from '../context/PatientContext'; // If Dashboard uses it for non-admin views
import { User } from '../types';

// Mock child components to simplify Dashboard testing and focus on its logic
jest.mock('../components/layout/Layout', () => ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>);
jest.mock('../components/Admin/AdminStats', () => () => <div data-testid="admin-stats">AdminStats Component</div>);
jest.mock('../components/Admin/AdminRecentPayments', () => () => <div data-testid="admin-recent-payments">AdminRecentPayments Component</div>);
jest.mock('../components/Admin/AdminSubscriberPayments', () => () => <div data-testid="admin-subscriber-payments">AdminSubscriberPayments Component</div>);
jest.mock('../components/Payments/PaymentList', () => () => <div data-testid="payment-list">PaymentList Component</div>);
// Mock other non-admin components if they are complex or make their own calls
jest.mock('../components/dashboard/StatsCard', () => () => <div data-testid="stats-card">StatsCard</div>);
jest.mock('../components/ui/Card', () => ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>);


// Mock contexts
jest.mock('../context/AuthContext');
jest.mock('../context/PatientContext');


const mockAdminUser: User = {
  id: 'admin-id',
  username: 'admin',
  name: 'Admin User',
  role: 'admin',
};

const mockSubscriberUser: User = {
  id: 'subscriber-id',
  username: 'subscriber',
  name: 'Subscriber User',
  role: 'subscriber',
};

const mockPacienteUser: User = {
  id: 'paciente-id',
  username: 'paciente',
  name: 'Paciente User',
  role: 'paciente',
};

describe('Dashboard Page', () => {
  const useAuthMock = useAuth as jest.Mock;
  const usePatientsMock = usePatients as jest.Mock;

  beforeEach(() => {
    useAuthMock.mockReset();
    usePatientsMock.mockReset();
    // Default mock for usePatients, can be overridden in specific tests
    usePatientsMock.mockReturnValue({
      patients: [], // Default to no patients for non-admin views
      // Add other patient context values if needed by the non-admin dashboard parts
    });
  });

  it('renders Admin Dashboard view for admin users', () => {
    useAuthMock.mockReturnValue({ user: mockAdminUser });
    render(<Dashboard />);

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('admin-stats')).toBeInTheDocument();
    expect(screen.getByTestId('admin-recent-payments')).toBeInTheDocument();
    expect(screen.getByTestId('admin-subscriber-payments')).toBeInTheDocument();

    // Ensure non-admin components are not rendered
    expect(screen.queryByText('Painel de Controle')).not.toBeInTheDocument();
    expect(screen.queryByTestId('payment-list')).not.toBeInTheDocument();
  });

  it('renders default "Painel de Controle" view for non-admin (subscriber) users', () => {
    useAuthMock.mockReturnValue({ user: mockSubscriberUser });
    render(<Dashboard />);

    expect(screen.getByText('Painel de Controle')).toBeInTheDocument();
    // Check for some elements of the non-admin dashboard.
    // Since many are mocked, we check for their presence or specific text.
    expect(screen.getAllByTestId('stats-card').length).toBeGreaterThan(0); 

    // Ensure admin components are not rendered
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByTestId('admin-stats')).not.toBeInTheDocument();
  });
  
  it('renders PaymentList for subscriber users in the default view', () => {
    useAuthMock.mockReturnValue({ user: mockSubscriberUser });
    render(<Dashboard />);
    expect(screen.getByTestId('payment-list')).toBeInTheDocument();
  });

  it('renders default "Painel de Controle" view for non-admin (paciente) users', () => {
    useAuthMock.mockReturnValue({ user: mockPacienteUser });
    render(<Dashboard />);

    expect(screen.getByText('Painel de Controle')).toBeInTheDocument();
    expect(screen.getAllByTestId('stats-card').length).toBeGreaterThan(0);
    
    // Paciente should not see PaymentList
    expect(screen.queryByTestId('payment-list')).not.toBeInTheDocument();
    // And definitely not admin components
    expect(screen.queryByTestId('admin-stats')).not.toBeInTheDocument();
  });
  
   it('renders default view even if user is null (e.g., still loading auth state)', () => {
    useAuthMock.mockReturnValue({ user: null, isLoading: true }); // Example of loading state
    render(<Dashboard />);
    // In this case, our Dashboard logic for non-admin is the default.
    // It might show "Painel de Controle" or be blank depending on other checks,
    // but it certainly should NOT show "Admin Dashboard".
    expect(screen.getByText('Painel de Controle')).toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
  });

});
