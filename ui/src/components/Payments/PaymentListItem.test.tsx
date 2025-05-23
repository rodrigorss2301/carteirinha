import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentListItem from './PaymentListItem';
import { Payment, PaymentStatus } from '../../types';

describe('PaymentListItem', () => {
  const mockPayment: Payment = {
    id: 'payment123',
    userId: 'user456',
    amount: 150.75,
    status: PaymentStatus.COMPLETED,
    createdAt: new Date('2023-10-26T10:00:00Z'),
    updatedAt: new Date('2023-10-26T10:00:00Z'),
  };

  it('renders payment details correctly', () => {
    render(<PaymentListItem payment={mockPayment} />);

    expect(screen.getByText(`Payment ID: ${mockPayment.id}`)).toBeInTheDocument();
    expect(screen.getByText(`Date: ${new Date(mockPayment.createdAt).toLocaleDateString()}`)).toBeInTheDocument();
    expect(screen.getByText(`Amount: $${mockPayment.amount.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`Status: ${mockPayment.status.toUpperCase()}`)).toBeInTheDocument();
  });

  it('applies correct class for COMPLETED status', () => {
    render(<PaymentListItem payment={mockPayment} />);
    const statusElement = screen.getByText(`Status: ${PaymentStatus.COMPLETED.toUpperCase()}`);
    expect(statusElement).toHaveClass('text-green-600');
  });

  it('applies correct class for PENDING status', () => {
    const pendingPayment = { ...mockPayment, status: PaymentStatus.PENDING };
    render(<PaymentListItem payment={pendingPayment} />);
    const statusElement = screen.getByText(`Status: ${PaymentStatus.PENDING.toUpperCase()}`);
    expect(statusElement).toHaveClass('text-yellow-600');
  });

  it('applies correct class for FAILED status', () => {
    const failedPayment = { ...mockPayment, status: PaymentStatus.FAILED };
    render(<PaymentListItem payment={failedPayment} />);
    const statusElement = screen.getByText(`Status: ${PaymentStatus.FAILED.toUpperCase()}`);
    expect(statusElement).toHaveClass('text-red-600');
  });
});
