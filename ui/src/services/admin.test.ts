import { api } from './api'; // Mocked
import { adminService, UserRoleCounts } from './admin';
import { Payment, PaymentStatus } from '../types';

// Mock the 'api' module
jest.mock('./api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockUserRoleCounts: UserRoleCounts = {
  subscriber: 15,
  affiliate: 5,
};

const mockRecentPayments: Payment[] = [
  { id: 'p1', userId: 'u1', amount: 10, status: PaymentStatus.COMPLETED, createdAt: new Date(), updatedAt: new Date() },
  { id: 'p2', userId: 'u2', amount: 20, status: PaymentStatus.PENDING, createdAt: new Date(), updatedAt: new Date() },
];

const mockSubscriberPayments: Payment[] = [
  { id: 's1', userId: 'sub1', amount: 100, status: PaymentStatus.COMPLETED, createdAt: new Date(), updatedAt: new Date() },
  { id: 's2', userId: 'sub2', amount: 150, status: PaymentStatus.COMPLETED, createdAt: new Date(), updatedAt: new Date() },
];

const mockRefundedPayment: Payment = {
  id: 's1', userId: 'sub1', amount: 100, status: PaymentStatus.FAILED, createdAt: new Date(), updatedAt: new Date() 
};

describe('adminService', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  describe('getUserRoleCounts', () => {
    it('should fetch user role counts', async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: mockUserRoleCounts });

      const result = await adminService.getUserRoleCounts();

      expect(api.get).toHaveBeenCalledWith('/admin/stats/user-roles');
      expect(result).toEqual(mockUserRoleCounts);
    });

    it('should throw an error if API call fails', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('API Error'));
      await expect(adminService.getUserRoleCounts()).rejects.toThrow('API Error');
    });
  });

  describe('getRecentPayments', () => {
    it('should fetch recent payments with default limit', async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: mockRecentPayments });

      const result = await adminService.getRecentPayments();

      expect(api.get).toHaveBeenCalledWith('/admin/stats/recent-payments?limit=10');
      expect(result).toEqual(mockRecentPayments);
    });

    it('should fetch recent payments with a specified limit', async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: [mockRecentPayments[0]] });
      const limit = 1;
      const result = await adminService.getRecentPayments(limit);

      expect(api.get).toHaveBeenCalledWith(`/admin/stats/recent-payments?limit=${limit}`);
      expect(result).toEqual([mockRecentPayments[0]]);
    });
  });

  describe('getAllSubscriberPayments', () => {
    it('should fetch all payments from subscriber users', async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: mockSubscriberPayments });

      const result = await adminService.getAllSubscriberPayments();

      expect(api.get).toHaveBeenCalledWith('/admin/payments/subscriber');
      expect(result).toEqual(mockSubscriberPayments);
    });
  });

  describe('refundPayment', () => {
    it('should send a request to refund a payment and return the updated payment', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: mockRefundedPayment });
      const paymentId = 's1';
      const result = await adminService.refundPayment(paymentId);

      expect(api.post).toHaveBeenCalledWith(`/admin/payments/${paymentId}/refund`);
      expect(result).toEqual(mockRefundedPayment);
      expect(result.status).toBe(PaymentStatus.FAILED);
    });

     it('should throw an error if refund API call fails', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('API Error for refund'));
      const paymentId = 's1';
      await expect(adminService.refundPayment(paymentId)).rejects.toThrow('API Error for refund');
    });
  });
});
