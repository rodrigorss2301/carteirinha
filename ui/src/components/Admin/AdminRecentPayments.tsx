import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin';
import { Payment } from '../../types';
import PaymentListItem from '../Payments/PaymentListItem'; // Reusing existing component
import Card from '../ui/Card'; // Using the Card component for consistent styling

const AdminRecentPayments: React.FC<{ limit?: number }> = ({ limit = 5 }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPayments = async () => {
      try {
        setLoading(true);
        const recentPayments = await adminService.getRecentPayments(limit);
        setPayments(recentPayments);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent payments:', err);
        setError('Failed to load recent payments.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecentPayments();
  }, [limit]);

  if (loading) {
    return <p>Loading recent payments...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (payments.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h2>
        <p>No recent payments found.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments (Last {limit})</h2>
      <ul className="divide-y divide-gray-200">
        {payments.map((payment) => (
          <PaymentListItem key={payment.id} payment={payment} />
        ))}
      </ul>
    </Card>
  );
};

export default AdminRecentPayments;
