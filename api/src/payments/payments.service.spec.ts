import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsService } from './payments.service';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { User } from '../auth/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

// Mock user data
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

const mockOtherSubscriberUser: User = {
  id: 'other-subscriber-uuid',
  username: 'othersub',
  name: 'Other Subscriber',
  role: 'subscriber',
  password: 'hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPacienteUser: User = {
  id: 'paciente-uuid',
  username: 'paciente',
  name: 'Paciente User',
  role: 'paciente',
  password: 'hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentRepository: Repository<Payment>;

  const mockPaymentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentRepository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPaymentDto: CreatePaymentDto = {
      userId: mockSubscriberUser.id,
      amount: 100,
      status: PaymentStatus.PENDING,
    };

    it('should allow a subscriber to create a payment for themselves', async () => {
      const paymentData = { ...createPaymentDto, id: 'payment-uuid', user: mockSubscriberUser };
      mockPaymentRepository.create.mockReturnValue(paymentData);
      mockPaymentRepository.save.mockResolvedValue(paymentData);

      const result = await service.create(createPaymentDto, mockSubscriberUser);
      expect(result).toEqual(paymentData);
      expect(mockPaymentRepository.create).toHaveBeenCalledWith(expect.objectContaining({ ...createPaymentDto, status: PaymentStatus.PENDING}));
      expect(mockPaymentRepository.save).toHaveBeenCalledWith(paymentData);
    });

    it('should allow an admin to create a payment for any user', async () => {
      const paymentData = { ...createPaymentDto, id: 'payment-uuid', user: mockSubscriberUser };
      mockPaymentRepository.create.mockReturnValue(paymentData);
      mockPaymentRepository.save.mockResolvedValue(paymentData);
      
      const result = await service.create(createPaymentDto, mockAdminUser);
      expect(result).toEqual(paymentData);
    });
    
    it('should default to PENDING status if not provided', async () => {
        const dtoWithoutStatus = { userId: mockSubscriberUser.id, amount: 50 };
        const paymentData = { ...dtoWithoutStatus, status: PaymentStatus.PENDING, id: 'payment-uuid-2' };
        mockPaymentRepository.create.mockReturnValue(paymentData);
        mockPaymentRepository.save.mockResolvedValue(paymentData);

        await service.create(dtoWithoutStatus as CreatePaymentDto, mockSubscriberUser);
        expect(mockPaymentRepository.create).toHaveBeenCalledWith(expect.objectContaining({ status: PaymentStatus.PENDING }));
    });

    it('should throw UnauthorizedException if a subscriber tries to create a payment for someone else', async () => {
      const dtoForOtherUser = { ...createPaymentDto, userId: mockOtherSubscriberUser.id };
      await expect(service.create(dtoForOtherUser, mockSubscriberUser)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if a non-admin/non-subscriber tries to create a payment', async () => {
      await expect(service.create(createPaymentDto, mockPacienteUser)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findOne', () => {
    const paymentId = 'payment-uuid';
    const mockPayment: Payment = { 
        id: paymentId, 
        userId: mockSubscriberUser.id, 
        user: mockSubscriberUser, 
        amount: 100, 
        status: PaymentStatus.COMPLETED, 
        createdAt: new Date(), 
        updatedAt: new Date() 
    };

    it('should allow an admin to find any payment', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);
      const result = await service.findOne(paymentId, mockAdminUser);
      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepository.findOne).toHaveBeenCalledWith({ where: { id: paymentId }, relations: ['user'] });
    });

    it('should allow a subscriber to find their own payment', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);
      const result = await service.findOne(paymentId, mockSubscriberUser);
      expect(result).toEqual(mockPayment);
    });

    it('should throw UnauthorizedException if a subscriber tries to find another user\'s payment', async () => {
      const differentUserPayment = { ...mockPayment, userId: mockOtherSubscriberUser.id, user: mockOtherSubscriberUser };
      mockPaymentRepository.findOne.mockResolvedValue(differentUserPayment);
      await expect(service.findOne(paymentId, mockSubscriberUser)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if payment does not exist', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(paymentId, mockAdminUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByUser', () => {
    const userId = mockSubscriberUser.id;
    const mockPayments: Payment[] = [
      { id: 'p1', userId, amount: 10, status: PaymentStatus.COMPLETED, createdAt: new Date(), updatedAt: new Date(), user: mockSubscriberUser },
      { id: 'p2', userId, amount: 20, status: PaymentStatus.PENDING, createdAt: new Date(), updatedAt: new Date(), user: mockSubscriberUser },
    ];

    it('should allow an admin to find payments for any user', async () => {
      mockPaymentRepository.find.mockResolvedValue(mockPayments);
      const result = await service.findAllByUser(userId, mockAdminUser);
      expect(result).toEqual(mockPayments);
      expect(mockPaymentRepository.find).toHaveBeenCalledWith({ where: { userId } });
    });

    it('should allow a subscriber to find their own payments', async () => {
      mockPaymentRepository.find.mockResolvedValue(mockPayments);
      const result = await service.findAllByUser(userId, mockSubscriberUser);
      expect(result).toEqual(mockPayments);
    });

    it('should throw UnauthorizedException if a subscriber tries to find payments for another user', async () => {
      await expect(service.findAllByUser(mockOtherSubscriberUser.id, mockSubscriberUser)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateStatus', () => {
    const paymentId = 'payment-uuid';
    const newStatus = PaymentStatus.COMPLETED;
    const mockPayment: Payment = { 
        id: paymentId, 
        userId: mockSubscriberUser.id, 
        user: mockSubscriberUser, 
        amount: 100, 
        status: PaymentStatus.PENDING, 
        createdAt: new Date(), 
        updatedAt: new Date() 
    };

    it('should allow an admin to update payment status', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);
      mockPaymentRepository.save.mockResolvedValue({ ...mockPayment, status: newStatus });
      
      const result = await service.updateStatus(paymentId, newStatus, mockAdminUser);
      expect(result.status).toBe(newStatus);
      expect(mockPaymentRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: newStatus }));
    });

    it('should throw UnauthorizedException if a non-admin tries to update status', async () => {
      await expect(service.updateStatus(paymentId, newStatus, mockSubscriberUser)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if payment to update does not exist', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(null);
      await expect(service.updateStatus(paymentId, newStatus, mockAdminUser)).rejects.toThrow(NotFoundException);
    });
  });
});
