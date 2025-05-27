import React from 'react';
import { Payment, PaymentStatus } from '../../types';

interface PaymentListItemProps {
  payment: Payment;
}

const PaymentListItem: React.FC<PaymentListItemProps> = ({ payment }) => {
  const getStatusClass = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'text-green-600';
      case PaymentStatus.PENDING:
        return 'text-yellow-600';
      case PaymentStatus.FAILED:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <li className="py-4 px-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Payment ID: {payment.id}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(payment.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-800">
            Amount: ${payment.amount.toFixed(2)}
          </p>
          <p className={`text-sm font-medium ${getStatusClass(payment.status)}`}>
            Status: {payment.status.toUpperCase()}
          </p>
        </div>
      </div>
    </li>
  );
};

export default PaymentListItem;
