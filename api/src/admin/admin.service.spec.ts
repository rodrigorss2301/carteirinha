import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AdminService } from './admin.service';
import { User } from '../auth/entities/user.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';

// Mock Users
const mockAdminUser: User = {
  id: 'admin-uuid',
  username: 'admin',
  name: 'Admin User',
  role: 'admin',
  password: 'hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSubscriberUser: User = {
  id: 'subscriber-uuid',
  username: 'subscriber',
  name: 'Subscriber User',
  role: 'subscriber',
  password: 'hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAffiliateUser: User = {
  id: 'affiliate-uuid',
  username: 'affiliate',
  name: 'Affiliate User',
  role: 'affiliate',
  password: 'hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock Payments
const mockPayment1: Payment = {
  id: 'p1-uuid',
  userId: mockSubscriberUser.id,
  user: mockSubscriberUser,
  amount: 100,
  status: PaymentStatus.COMPLETED,
  createdAt: new Date(Date.now() - 10000), // recent
  updatedAt: new Date(),
};

const mockPayment2: Payment = {
  id: 'p2-uuid',
  userId: mockAffiliateUser.id, // Payment by an affiliate, not a subscriber
  user: mockAffiliateUser,
  amount: 50,
  status: PaymentStatus.COMPLETED,
  createdAt: new Date(Date.now() - 20000), // older
  updatedAt: new Date(),
};

const mockPayment3Subscriber: Payment = {
    id: 'p3-uuid',
    userId: 'another-subscriber-uuid',
    user: { id: 'another-subscriber-uuid', role: 'subscriber' } as User,
    amount: 75,
    status: PaymentStatus.PENDING,
    createdAt: new Date(Date.now() - 5000), // most recent
    updatedAt: new Date(),
};


describe('AdminService', () => {
  let service: AdminService;
  let userRepository: Repository<User>;
  let paymentRepository: Repository<Payment>;

  const mockUserRepository = {
    count: jest.fn(),
    find: jest.fn(),
  };

  const mockPaymentRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Payment), useValue: mockPaymentRepository },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    paymentRepository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserRoleCounts', () => {
    it('should return counts for subscriber and affiliate roles', async () => {
      mockUserRepository.count.mockImplementation(async ({ where: { role } }) => {
        if (role === 'subscriber') return 5;
        if (role === 'affiliate') return 2;
        return 0;
      });

      const counts = await service.getUserRoleCounts(mockAdminUser);
      expect(counts).toEqual({ subscriber: 5, affiliate: 2 });
      expect(mockUserRepository.count).toHaveBeenCalledWith({ where: { role: 'subscriber' } });
      expect(mockUserRepository.count).toHaveBeenCalledWith({ where: { role: 'affiliate' } });
    });

    it('should throw UnauthorizedException if user is not admin', async () => {
      await expect(service.getUserRoleCounts(mockSubscriberUser)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getRecentPayments', () => {
    it('should return a list of recent payments with default limit 10', async () => {
      const payments = [mockPayment3Subscriber, mockPayment1, mockPayment2];
      mockPaymentRepository.find.mockResolvedValue(payments);

      const result = await service.getRecentPayments(mockAdminUser);
      expect(result).toEqual(payments);
      expect(mockPaymentRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 10,
        relations: ['user'],
      });
    });

    it('should respect the limit parameter', async () => {
      mockPaymentRepository.find.mockResolvedValue([mockPayment3Subscriber]);
      const result = await service.getRecentPayments(mockAdminUser, 1);
      expect(result).toEqual([mockPayment3Subscriber]);
      expect(mockPaymentRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 1,
        relations: ['user'],
      });
    });

    it('should throw UnauthorizedException if user is not admin', async () => {
      await expect(service.getRecentPayments(mockSubscriberUser)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getAllSubscriberPayments', () => {
    it('should return all payments made by subscriber users', async () => {
      const subscriberUsers = [{ id: mockSubscriberUser.id }, { id: 'another-subscriber-uuid' }];
      const subscriberPayments = [mockPayment1, mockPayment3Subscriber];
      
      mockUserRepository.find.mockResolvedValue(subscriberUsers as User[]);
      // Make sure In operator is mocked correctly or paymentRepository.find is flexible
      mockPaymentRepository.find.mockImplementation(async ({ where: { userId }}) => {
        // Check if userId is an instance of In
        if (userId && typeof userId === 'object' && (userId as any).constructor.name === 'InOperator') {
          const ids = (userId as any)._value; // Extract IDs from In operator
          return [mockPayment1, mockPayment3Subscriber].filter(p => ids.includes(p.userId));
        }
        return [];
      });

      const result = await service.getAllSubscriberPayments(mockAdminUser);
      expect(result.length).toBe(2);
      expect(result).toContainEqual(mockPayment1);
      expect(result).toContainEqual(mockPayment3Subscriber);
      expect(mockUserRepository.find).toHaveBeenCalledWith({ where: { role: 'subscriber' }, select: ['id'] });
      expect(mockPaymentRepository.find).toHaveBeenCalledWith({
        where: { userId: In(subscriberUsers.map(u => u.id)) },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    });
    
    it('should return an empty array if no subscriber users exist', async () => {
        mockUserRepository.find.mockResolvedValue([]);
        const result = await service.getAllSubscriberPayments(mockAdminUser);
        expect(result).toEqual([]);
        expect(mockPaymentRepository.find).not.toHaveBeenCalled(); // Because it returns early
    });

    it('should throw UnauthorizedException if user is not admin', async () => {
      await expect(service.getAllSubscriberPayments(mockSubscriberUser)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refundPayment', () => {
    const paymentToRefund: Payment = { ...mockPayment1, status: PaymentStatus.COMPLETED };
    const refundedPayment: Payment = { ...paymentToRefund, status: PaymentStatus.FAILED };

    it('should successfully refund a COMPLETED payment by setting status to FAILED', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(paymentToRefund);
      mockPaymentRepository.save.mockResolvedValue(refundedPayment);

      const result = await service.refundPayment(paymentToRefund.id, mockAdminUser);
      expect(result.status).toBe(PaymentStatus.FAILED);
      expect(mockPaymentRepository.findOne).toHaveBeenCalledWith({ where: { id: paymentToRefund.id } });
      expect(mockPaymentRepository.save).toHaveBeenCalledWith(expect.objectContaining({ id: paymentToRefund.id, status: PaymentStatus.FAILED }));
    });

    it('should throw UnauthorizedException if user is not admin', async () => {
      await expect(service.refundPayment(paymentToRefund.id, mockSubscriberUser)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if payment does not exist', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(null);
      await expect(service.refundPayment('non-existent-id', mockAdminUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if payment is already FAILED (refunded)', async () => {
      const alreadyFailedPayment = { ...paymentToRefund, status: PaymentStatus.FAILED };
      mockPaymentRepository.findOne.mockResolvedValue(alreadyFailedPayment);
      await expect(service.refundPayment(paymentToRefund.id, mockAdminUser)).rejects.toThrow(BadRequestException);
    });
    
    it('should throw BadRequestException if payment is PENDING', async () => {
      const pendingPayment = { ...paymentToRefund, status: PaymentStatus.PENDING };
      mockPaymentRepository.findOne.mockResolvedValue(pendingPayment);
      await expect(service.refundPayment(paymentToRefund.id, mockAdminUser)).rejects.toThrow(BadRequestException);
    });
  });
});
