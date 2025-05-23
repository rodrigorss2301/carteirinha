import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/admin';
import { Payment, PaymentStatus } from '../../types';
// import PaymentListItem from '../Payments/PaymentListItem'; // We might need a custom one for actions
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface AdminPaymentListItemProps {
  payment: Payment;
  onRefund: (paymentId: string) => Promise<void>;
}

const AdminPaymentListItem: React.FC<AdminPaymentListItemProps> = ({ payment, onRefund }) => {
  const [isRefunding, setIsRefunding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefund = async () => {
    if (!window.confirm(`Are you sure you want to refund payment ID: ${payment.id}? This action cannot be undone.`)) {
      return;
    }
    setIsRefunding(true);
    setError(null);
    try {
      await onRefund(payment.id);
      // The parent component will refresh the list or update the item
    } catch (err: any) {
      setError(err.message || 'Failed to refund payment.');
    } finally {
      setIsRefunding(false);
    }
  };
  
  const getStatusClass = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'text-green-600';
      case PaymentStatus.PENDING:
        return 'text-yellow-600';
      case PaymentStatus.FAILED: // Indicates refunded or failed
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
          <p className="text-sm text-gray-500">User ID: {payment.userId}</p>
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
        <div>
          {payment.status === PaymentStatus.COMPLETED && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefund}
              disabled={isRefunding}
            >
              {isRefunding ? 'Refunding...' : 'Refund'}
            </Button>
          )}
          {payment.status === PaymentStatus.FAILED && (
             <span className="text-sm text-red-500">Refunded/Failed</span>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </li>
  );
};


const AdminSubscriberPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSubscriberPayments = useCallback(async () => {
    if (user?.role !== 'admin') return; // Should not happen if component is correctly guarded
    try {
      setLoading(true);
      const subscriberPayments = await adminService.getAllSubscriberPayments();
      setPayments(subscriberPayments);
      setError(null);
    } catch (err) {
      console.error('Error fetching subscriber payments:', err);
      setError('Failed to load subscriber payments.');
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    fetchSubscriberPayments();
  }, [fetchSubscriberPayments]);

  const handleRefundPayment = async (paymentId: string) => {
    try {
      await adminService.refundPayment(paymentId);
      // Refresh the list to show the updated status
      fetchSubscriberPayments(); 
    } catch (err: any) {
      console.error('Refund failed:', err);
      // The error will be displayed by AdminPaymentListItem, or we can throw and catch here.
      throw err; // Re-throw to be caught by the item component
    }
  };

  if (loading) {
    return <p>Loading subscriber payments...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (payments.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Subscriber Payments</h2>
        <p>No payments found for subscribers.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">All Subscriber Payments</h2>
      <ul className="divide-y divide-gray-200">
        {payments.map((payment) => (
          <AdminPaymentListItem key={payment.id} payment={payment} onRefund={handleRefundPayment} />
        ))}
      </ul>
    </Card>
  );
};

export default AdminSubscriberPayments;
