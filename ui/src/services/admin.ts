import { api } from './api'; // Assuming 'api' is your preconfigured Axios instance
import { User, Payment } from '../types'; // Assuming these types are available

export interface UserRoleCounts {
  subscriber: number;
  affiliate: number;
}

export const adminService = {
  getUserRoleCounts: async (): Promise<UserRoleCounts> => {
    const { data } = await api.get<UserRoleCounts>('/admin/stats/user-roles');
    return data;
  },

  getRecentPayments: async (limit: number = 10): Promise<Payment[]> => {
    const { data } = await api.get<Payment[]>(`/admin/stats/recent-payments?limit=${limit}`);
    return data;
  },

  getAllSubscriberPayments: async (): Promise<Payment[]> => {
    const { data } = await api.get<Payment[]>('/admin/payments/subscriber');
    return data;
  },

  refundPayment: async (paymentId: string): Promise<Payment> => {
    const { data } = await api.post<Payment>(`/admin/payments/${paymentId}/refund`);
    return data;
  },
};
