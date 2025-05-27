import { api } from './api'; // Assuming 'api' is your preconfigured Axios instance
import { Payment } from '../types'; // Assuming Payment type will be added to types/index.ts

export const paymentsService = {
  getUserPayments: async (userId: string): Promise<Payment[]> => {
    const { data } = await api.get<Payment[]>(`/payments/user/${userId}`);
    return data;
  },

  getPaymentById: async (paymentId: string): Promise<Payment> => {
    const { data } = await api.get<Payment>(`/payments/${paymentId}`);
    return data;
  },

  // Add createPayment if subscribers are allowed to initiate payments directly
  // createPayment: async (paymentData: CreatePaymentDto): Promise<Payment> => {
  //   const { data } = await api.post<Payment>('/payments', paymentData);
  //   return data;
  // }
};

// We'll need to define CreatePaymentDto if we add createPayment
// export interface CreatePaymentDto {
//   userId: string; // Or this could be inferred from the logged-in user on the backend
//   amount: number;
//   // status might be set by the backend by default
// }

// Also, the Payment type needs to be defined in ui/src/types/index.ts
// export interface Payment {
//   id: string;
//   userId: string;
//   amount: number;
//   status: 'pending' | 'completed' | 'failed'; // Or use an enum like in the backend
//   createdAt: Date;
//   updatedAt: Date;
// }
