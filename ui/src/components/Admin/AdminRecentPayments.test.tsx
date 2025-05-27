import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminRecentPayments from './AdminRecentPayments';
import { adminService } from '../../services/admin';
import { Payment, PaymentStatus } from '../../types';

// Mock dependencies
jest.mock('../../services/admin');
// We can also mock PaymentListItem if we want to isolate AdminRecentPayments further,
// but for this test, we'll let it render.
// jest.mock('../Payments/PaymentListItem', () => () => <div data-testid="payment-list-item">Mocked PaymentListItem</div>);


const mockPayments: Payment[] = [
  { id: 'p1', userId: 'u1', amount: 100, status: PaymentStatus.COMPLETED, createdAt: new Date(), updatedAt: new Date() },
  { id: 'p2', userId: 'u2', amount: 200, status: PaymentStatus.PENDING, createdAt: new Date(), updatedAt: new Date() },
];

describe('AdminRecentPayments', () => {
  const adminServiceMock = adminService as jest.Mocked<typeof adminService>;

  beforeEach(() => {
    adminServiceMock.getRecentPayments.mockReset();
  });

  it('should display loading state initially', () => {
    adminServiceMock.getRecentPayments.mockReturnValue(new Promise(() => {})); // Keep promise pending
    render(<AdminRecentPayments />);
    expect(screen.getByText('Loading recent payments...')).toBeInTheDocument();
  });

  it('should display recent payments if API call is successful', async () => {
    adminServiceMock.getRecentPayments.mockResolvedValue(mockPayments);
    render(<AdminRecentPayments limit={5} />);

    await waitFor(() => {
      expect(screen.getByText('Recent Payments (Last 5)')).toBeInTheDocument();
      // Check for details from mockPayments rendered by PaymentListItem
      expect(screen.getByText('Payment ID: p1')).toBeInTheDocument();
      expect(screen.getByText('Amount: $100.00')).toBeInTheDocument();
      expect(screen.getByText('Payment ID: p2')).toBeInTheDocument();
      expect(screen.getByText('Amount: $200.00')).toBeInTheDocument();
    });
  });
  
  it('should call getRecentPayments with the correct limit', async () => {
    adminServiceMock.getRecentPayments.mockResolvedValue(mockPayments);
    render(<AdminRecentPayments limit={7} />);
    await waitFor(() => {
        expect(adminServiceMock.getRecentPayments).toHaveBeenCalledWith(7);
    });
  });
  
  it('should use default limit of 5 if no limit prop is provided', async () => {
    adminServiceMock.getRecentPayments.mockResolvedValue(mockPayments);
    render(<AdminRecentPayments />); // No limit prop
    await waitFor(() => {
        expect(adminServiceMock.getRecentPayments).toHaveBeenCalledWith(5); // Default limit
        expect(screen.getByText('Recent Payments (Last 5)')).toBeInTheDocument();
    });
  });

  it('should display error message if API call fails', async () => {
    adminServiceMock.getRecentPayments.mockRejectedValue(new Error('Failed to fetch payments'));
    render(<AdminRecentPayments />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load recent payments.')).toBeInTheDocument();
    });
  });

  it('should display "no payments found" message if API returns empty array', async () => {
    adminServiceMock.getRecentPayments.mockResolvedValue([]);
    render(<AdminRecentPayments />);

    await waitFor(() => {
      expect(screen.getByText('No recent payments found.')).toBeInTheDocument();
    });
  });
});
