import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: User): Promise<Payment> {
    if (user.role !== 'subscriber' && user.role !== 'admin') {
      throw new UnauthorizedException('Only subscribers or admins can create payments.');
    }
    // If the user is a subscriber, they can only create payments for themselves
    if (user.role === 'subscriber' && user.id !== createPaymentDto.userId) {
        throw new UnauthorizedException('Subscribers can only create payments for themselves.');
    }

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      status: createPaymentDto.status || PaymentStatus.PENDING, // Default to PENDING if not provided
    });
    return this.paymentRepository.save(payment);
  }

  async findOne(id: string, user: User): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id }, relations: ['user'] });
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }

    if (user.role !== 'admin' && payment.userId !== user.id) {
      throw new UnauthorizedException('You are not authorized to view this payment.');
    }
    return payment;
  }

  async findAllByUser(userId: string, user: User): Promise<Payment[]> {
    if (user.role !== 'admin' && userId !== user.id) {
      throw new UnauthorizedException('You are not authorized to view these payments.');
    }
    return this.paymentRepository.find({ where: { userId } });
  }

  async updateStatus(id: string, status: PaymentStatus, user: User): Promise<Payment> {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Only admins can update payment status.');
    }
    const payment = await this.paymentRepository.findOne({ where: {id} });
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }
    payment.status = status;
    return this.paymentRepository.save(payment);
  }
}
