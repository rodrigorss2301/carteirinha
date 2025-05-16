import React from 'react';
import Card from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change }) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.isPositive ? 'text-blue-600' : 'text-red-600'}`}>
              {change.isPositive ? '↑' : '↓'} {change.value} {change.isPositive ? 'increase' : 'decrease'}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;