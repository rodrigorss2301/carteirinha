import React, { useEffect, useState } from 'react';
import { paymentsService } from '../../services/payments';
import { Payment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import PaymentListItem from './PaymentListItem';

const PaymentList: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      if (user && user.role === 'subscriber') {
        try {
          setLoading(true);
          const userPayments = await paymentsService.getUserPayments(user.id);
          setPayments(userPayments);
          setError(null);
        } catch (err) {
          console.error('Error fetching payments:', err);
          setError('Failed to load payments. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setPayments([]); // Clear payments if user is not a subscriber or not logged in
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  if (!user || user.role !== 'subscriber') {
    return null; // Or a message indicating this section is for subscribers only
  }

  if (loading) {
    return <p className="text-center text-gray-500">Loading payments...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (payments.length === 0) {
    return <p className="text-center text-gray-500">You have no payments yet.</p>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <h2 className="text-xl font-semibold p-6">Your Payments</h2>
      <ul className="divide-y divide-gray-200">
        {payments.map((payment) => (
          <PaymentListItem key={payment.id} payment={payment} />
        ))}
      </ul>
    </div>
  );
};

export default PaymentList;
