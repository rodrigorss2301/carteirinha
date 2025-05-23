import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminStats from './AdminStats';
import { adminService, UserRoleCounts } from '../../services/admin';

// Mock dependencies
jest.mock('../../services/admin');

const mockUserCounts: UserRoleCounts = {
  subscriber: 120,
  affiliate: 35,
};

describe('AdminStats', () => {
  const adminServiceMock = adminService as jest.Mocked<typeof adminService>;

  beforeEach(() => {
    adminServiceMock.getUserRoleCounts.mockReset();
  });

  it('should display loading state initially', () => {
    adminServiceMock.getUserRoleCounts.mockReturnValue(new Promise(() => {})); // Keep promise pending
    render(<AdminStats />);
    expect(screen.getByText('Loading admin statistics...')).toBeInTheDocument();
  });

  it('should display user counts if API call is successful', async () => {
    adminServiceMock.getUserRoleCounts.mockResolvedValue(mockUserCounts);
    render(<AdminStats />);

    await waitFor(() => {
      expect(screen.getByText('Total Subscribers')).toBeInTheDocument();
      expect(screen.getByText(mockUserCounts.subscriber.toString())).toBeInTheDocument();
      expect(screen.getByText('Total Affiliates')).toBeInTheDocument();
      expect(screen.getByText(mockUserCounts.affiliate.toString())).toBeInTheDocument();
    });
  });

  it('should display error message if API call fails', async () => {
    adminServiceMock.getUserRoleCounts.mockRejectedValue(new Error('Failed to fetch stats'));
    render(<AdminStats />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load user statistics.')).toBeInTheDocument();
    });
  });
  
  it('should display "no statistics available" if API returns null or undefined', async () => {
    adminServiceMock.getUserRoleCounts.mockResolvedValue(null as any); // Simulate API returning null
    render(<AdminStats />);

    await waitFor(() => {
      expect(screen.getByText('No user statistics available.')).toBeInTheDocument();
    });
  });
});
