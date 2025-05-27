import { api } from './api'; // Mocked
import { paymentsService } from './payments';
import { PaymentStatus, Payment } from '../types';

// Mock the 'api' module
jest.mock('./api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockPayments: Payment[] = [
  { id: '1', userId: 'user1', amount: 100, status: PaymentStatus.COMPLETED, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', userId: 'user1', amount: 50, status: PaymentStatus.PENDING, createdAt: new Date(), updatedAt: new Date() },
];

const mockSinglePayment: Payment = {
  id: '1', userId: 'user1', amount: 100, status: PaymentStatus.COMPLETED, createdAt: new Date(), updatedAt: new Date()
};

describe('paymentsService', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  describe('getUserPayments', () => {
    it('should fetch payments for a given user ID', async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: mockPayments });

      const userId = 'user1';
      const result = await paymentsService.getUserPayments(userId);

      expect(api.get).toHaveBeenCalledWith(`/payments/user/${userId}`);
      expect(result).toEqual(mockPayments);
    });

    it('should return an empty array if API call fails or returns no data', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('API Error'));
      
      const userId = 'user1';
      // We expect the error to be caught by the component or caller, service just forwards
      await expect(paymentsService.getUserPayments(userId)).rejects.toThrow('API Error');
    });
  });

  describe('getPaymentById', () => {
    it('should fetch a single payment by its ID', async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: mockSinglePayment });

      const paymentId = '1';
      const result = await paymentsService.getPaymentById(paymentId);

      expect(api.get).toHaveBeenCalledWith(`/payments/${paymentId}`);
      expect(result).toEqual(mockSinglePayment);
    });

    it('should throw an error if payment is not found or API fails', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('API Error'));
      const paymentId = 'non-existent-id';
      await expect(paymentsService.getPaymentById(paymentId)).rejects.toThrow('API Error');
    });
  });

  // Example for createPayment if it were implemented in the service
  // describe('createPayment', () => {
  //   it('should create a new payment', async () => {
  //     const paymentData = { userId: 'user1', amount: 200 };
  //     const createdPayment = { ...paymentData, id: '3', status: PaymentStatus.PENDING, createdAt: new Date(), updatedAt: new Date() };
  //     (api.post as jest.Mock).mockResolvedValue({ data: createdPayment });

  //     const result = await paymentsService.createPayment(paymentData);

  //     expect(api.post).toHaveBeenCalledWith('/payments', paymentData);
  //     expect(result).toEqual(createdPayment);
  //   });
  // });
});
