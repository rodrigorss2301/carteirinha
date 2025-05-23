import React, { useEffect, useState } from 'react';
import { adminService, UserRoleCounts } from '../../services/admin';
import StatsCard from '../dashboard/StatsCard'; // Reusing existing StatsCard
import { Users, UserCheck, UserX } from 'lucide-react'; // Example icons

const AdminStats: React.FC = () => {
  const [userCounts, setUserCounts] = useState<UserRoleCounts | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const counts = await adminService.getUserRoleCounts();
        setUserCounts(counts);
        setError(null);
      } catch (err) {
        console.error('Error fetching user role counts:', err);
        setError('Failed to load user statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  if (loading) {
    return <p>Loading admin statistics...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!userCounts) {
    return <p>No user statistics available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Total Subscribers"
        value={userCounts.subscriber}
        icon={<UserCheck className="h-6 w-6 text-green-600" />}
      />
      <StatsCard
        title="Total Affiliates"
        value={userCounts.affiliate}
        icon={<Users className="h-6 w-6 text-purple-600" />}
      />
      {/* Add more stats cards as needed */}
    </div>
  );
};

export default AdminStats;
