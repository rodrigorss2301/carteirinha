import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PaymentList from './PaymentList';
import { useAuth } from '../../context/AuthContext';
import { paymentsService } from '../../services/payments';
import { Payment, PaymentStatus, User } from '../../types';

// Mock dependencies
jest.mock('../../context/AuthContext');
jest.mock('../../services/payments');

const mockPayments: Payment[] = [
  { id: '1', userId: 'subscriber-id', amount: 100, status: PaymentStatus.COMPLETED, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', userId: 'subscriber-id', amount: 50, status: PaymentStatus.PENDING, createdAt: new Date(), updatedAt: new Date() },
];

const mockSubscriberUser: User = {
  id: 'subscriber-id',
  username: 'subscriber',
  name: 'Test Subscriber',
  role: 'subscriber',
};

const mockAdminUser: User = {
  id: 'admin-id',
  username: 'admin',
  name: 'Test Admin',
  role: 'admin',
};

describe('PaymentList', () => {
  const useAuthMock = useAuth as jest.Mock;
  const paymentsServiceMock = paymentsService as jest.Mocked<typeof paymentsService>;

  beforeEach(() => {
    // Reset mocks before each test
    useAuthMock.mockReset();
    paymentsServiceMock.getUserPayments.mockReset();
  });

  it('should render nothing if user is not a subscriber', () => {
    useAuthMock.mockReturnValue({ user: mockAdminUser }); // Non-subscriber user
    const { container } = render(<PaymentList />);
    expect(container.firstChild).toBeNull(); // Or check for a specific message if implemented
  });

  it('should render nothing if user is not logged in', () => {
    useAuthMock.mockReturnValue({ user: null });
    const { container } = render(<PaymentList />);
    expect(container.firstChild).toBeNull();
  });

  it('should display loading state initially for a subscriber', () => {
    useAuthMock.mockReturnValue({ user: mockSubscriberUser });
    paymentsServiceMock.getUserPayments.mockReturnValue(new Promise(() => {})); // Keep promise pending

    render(<PaymentList />);
    expect(screen.getByText('Loading payments...')).toBeInTheDocument();
  });

  it('should display payments if API call is successful for a subscriber', async () => {
    useAuthMock.mockReturnValue({ user: mockSubscriberUser });
    paymentsServiceMock.getUserPayments.mockResolvedValue(mockPayments);

    render(<PaymentList />);

    await waitFor(() => {
      expect(screen.getByText('Payment ID: 1')).toBeInTheDocument();
      expect(screen.getByText('Payment ID: 2')).toBeInTheDocument();
    });
    expect(screen.getByText('Your Payments')).toBeInTheDocument();
  });

  it('should display error message if API call fails for a subscriber', async () => {
    useAuthMock.mockReturnValue({ user: mockSubscriberUser });
    paymentsServiceMock.getUserPayments.mockRejectedValue(new Error('Failed to fetch'));

    render(<PaymentList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load payments. Please try again later.')).toBeInTheDocument();
    });
  });

  it('should display "no payments" message if subscriber has no payments', async () => {
    useAuthMock.mockReturnValue({ user: mockSubscriberUser });
    paymentsServiceMock.getUserPayments.mockResolvedValue([]);

    render(<PaymentList />);

    await waitFor(() => {
      expect(screen.getByText('You have no payments yet.')).toBeInTheDocument();
    });
  });
   it('should call getUserPayments with the correct user ID', async () => {
    useAuthMock.mockReturnValue({ user: mockSubscriberUser });
    paymentsServiceMock.getUserPayments.mockResolvedValue([]);

    render(<PaymentList />);

    await waitFor(() => {
      expect(paymentsServiceMock.getUserPayments).toHaveBeenCalledWith(mockSubscriberUser.id);
    });
  });
});
