import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminSubscriberPayments from './AdminSubscriberPayments';
import { adminService } from '../../services/admin';
import { Payment, PaymentStatus, User } from '../../types';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/admin');
jest.mock('../../context/AuthContext');

const mockAdminUser: User = {
  id: 'admin-id',
  username: 'admin',
  name: 'Test Admin',
  role: 'admin',
};

const mockPayments: Payment[] = [
  { id: 'p1', userId: 'sub1', amount: 100, status: PaymentStatus.COMPLETED, createdAt: new Date(), updatedAt: new Date() },
  { id: 'p2', userId: 'sub2', amount: 200, status: PaymentStatus.PENDING, createdAt: new Date(), updatedAt: new Date() },
  { id: 'p3', userId: 'sub3', amount: 50, status: PaymentStatus.FAILED, createdAt: new Date(), updatedAt: new Date() },
];

describe('AdminSubscriberPayments', () => {
  const adminServiceMock = adminService as jest.Mocked<typeof adminService>;
  const useAuthMock = useAuth as jest.Mock;

  beforeEach(() => {
    adminServiceMock.getAllSubscriberPayments.mockReset();
    adminServiceMock.refundPayment.mockReset();
    useAuthMock.mockReturnValue({ user: mockAdminUser }); // Assume admin is logged in
    
    // Mock window.confirm
    window.confirm = jest.fn(() => true); 
  });

  it('should display loading state initially', () => {
    adminServiceMock.getAllSubscriberPayments.mockReturnValue(new Promise(() => {}));
    render(<AdminSubscriberPayments />);
    expect(screen.getByText('Loading subscriber payments...')).toBeInTheDocument();
  });

  it('should display payments if API call is successful', async () => {
    adminServiceMock.getAllSubscriberPayments.mockResolvedValue(mockPayments);
    render(<AdminSubscriberPayments />);

    await waitFor(() => {
      expect(screen.getByText('All Subscriber Payments')).toBeInTheDocument();
      expect(screen.getByText('Payment ID: p1')).toBeInTheDocument(); // From AdminPaymentListItem
      expect(screen.getByText('Payment ID: p2')).toBeInTheDocument();
      expect(screen.getByText('Payment ID: p3')).toBeInTheDocument();
    });
  });

  it('should display error message if API call fails', async () => {
    adminServiceMock.getAllSubscriberPayments.mockRejectedValue(new Error('Failed to fetch'));
    render(<AdminSubscriberPayments />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load subscriber payments.')).toBeInTheDocument();
    });
  });

  it('should display "no payments found" message if API returns empty array', async () => {
    adminServiceMock.getAllSubscriberPayments.mockResolvedValue([]);
    render(<AdminSubscriberPayments />);

    await waitFor(() => {
      expect(screen.getByText('No payments found for subscribers.')).toBeInTheDocument();
    });
  });

  describe('AdminPaymentListItem (within AdminSubscriberPayments)', () => {
    it('should show Refund button for COMPLETED payments and call refund service on click', async () => {
      const completedPayment = mockPayments[0]; // status: COMPLETED
      adminServiceMock.getAllSubscriberPayments.mockResolvedValue([completedPayment]);
      adminServiceMock.refundPayment.mockResolvedValue({ ...completedPayment, status: PaymentStatus.FAILED });

      render(<AdminSubscriberPayments />);

      let refundButton: HTMLElement;
      await waitFor(() => {
        refundButton = screen.getByRole('button', { name: 'Refund' });
        expect(refundButton).toBeInTheDocument();
      });
      
      fireEvent.click(refundButton!);
      
      expect(window.confirm).toHaveBeenCalledWith(`Are you sure you want to refund payment ID: ${completedPayment.id}? This action cannot be undone.`);
      
      await waitFor(() => {
        expect(adminServiceMock.refundPayment).toHaveBeenCalledWith(completedPayment.id);
      });

      // List should refresh, and the item might show "Refunding..." then "Refunded/Failed"
      // Here we check if getAllSubscriberPayments is called again to refresh.
      await waitFor(() => {
        expect(adminServiceMock.getAllSubscriberPayments).toHaveBeenCalledTimes(2); // Initial + refresh
      });
    });

    it('should display "Refunding..." and disable button during refund process', async () => {
      const completedPayment = mockPayments[0];
      adminServiceMock.getAllSubscriberPayments.mockResolvedValue([completedPayment]);
      // Make refund promise not resolve immediately
      adminServiceMock.refundPayment.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ...completedPayment, status: PaymentStatus.FAILED }), 100)));

      render(<AdminSubscriberPayments />);
      
      let refundButton: HTMLElement;
      await waitFor(() => {
        refundButton = screen.getByRole('button', { name: 'Refund' });
      });
      
      fireEvent.click(refundButton!);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Refunding...' })).toBeDisabled();
      });
       // Wait for the refund to complete to avoid errors from unmounting during state updates
      await waitFor(() => expect(adminServiceMock.refundPayment).toHaveBeenCalled(), { timeout: 200 });
    });
    
    it('should display an error message within the item if refund fails', async () => {
      const completedPayment = mockPayments[0];
      adminServiceMock.getAllSubscriberPayments.mockResolvedValue([completedPayment]);
      const refundErrorMessage = 'Refund API Error';
      adminServiceMock.refundPayment.mockRejectedValue(new Error(refundErrorMessage));

      render(<AdminSubscriberPayments />);
      
      let refundButton: HTMLElement;
      await waitFor(() => {
        refundButton = screen.getByRole('button', { name: 'Refund' });
      });

      fireEvent.click(refundButton!);

      await waitFor(() => {
        expect(screen.getByText(refundErrorMessage)).toBeInTheDocument();
      });
       // Button should be re-enabled
      expect(screen.getByRole('button', { name: 'Refund' })).not.toBeDisabled();
    });

    it('should not show Refund button for PENDING payments', async () => {
      const pendingPayment = mockPayments[1]; // status: PENDING
      adminServiceMock.getAllSubscriberPayments.mockResolvedValue([pendingPayment]);
      render(<AdminSubscriberPayments />);

      await waitFor(() => {
        expect(screen.getByText('Payment ID: p2')).toBeInTheDocument();
      });
      expect(screen.queryByRole('button', { name: 'Refund' })).not.toBeInTheDocument();
    });

    it('should show "Refunded/Failed" text for FAILED payments and no Refund button', async () => {
      const failedPayment = mockPayments[2]; // status: FAILED
      adminServiceMock.getAllSubscriberPayments.mockResolvedValue([failedPayment]);
      render(<AdminSubscriberPayments />);

      await waitFor(() => {
        expect(screen.getByText('Payment ID: p3')).toBeInTheDocument();
        expect(screen.getByText('Refunded/Failed')).toBeInTheDocument();
      });
      expect(screen.queryByRole('button', { name: 'Refund' })).not.toBeInTheDocument();
    });
    
    it('should not proceed with refund if user cancels confirmation', async () => {
      const completedPayment = mockPayments[0];
      adminServiceMock.getAllSubscriberPayments.mockResolvedValue([completedPayment]);
      (window.confirm as jest.Mock).mockReturnValueOnce(false); // User clicks "Cancel"

      render(<AdminSubscriberPayments />);

      let refundButton: HTMLElement;
      await waitFor(() => {
        refundButton = screen.getByRole('button', { name: 'Refund' });
      });
      
      fireEvent.click(refundButton!);
      
      expect(window.confirm).toHaveBeenCalled();
      expect(adminServiceMock.refundPayment).not.toHaveBeenCalled();
    });
  });
});
