import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // Import In
import { User } from '../auth/entities/user.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  private ensureAdmin(user: User) {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('You are not authorized to perform this action.');
    }
  }

  async getUserRoleCounts(currentUser: User): Promise<{ subscriber: number; affiliate: number }> {
    this.ensureAdmin(currentUser);

    const subscriberCount = await this.userRepository.count({ where: { role: 'subscriber' } });
    const affiliateCount = await this.userRepository.count({ where: { role: 'affiliate' } });

    return { subscriber: subscriberCount, affiliate: affiliateCount };
  }

  async getRecentPayments(currentUser: User, limit: number = 10): Promise<Payment[]> {
    this.ensureAdmin(currentUser);

    return this.paymentRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['user'], // Include user information
    });
  }

  async getAllSubscriberPayments(currentUser: User): Promise<Payment[]> {
    this.ensureAdmin(currentUser);

    // Find users with the 'subscriber' role
    const subscriberUsers = await this.userRepository.find({ where: { role: 'subscriber' }, select: ['id'] });
    if (subscriberUsers.length === 0) {
        return [];
    }
    const subscriberUserIds = subscriberUsers.map(user => user.id);

    // Find payments made by these subscriber users
    return this.paymentRepository.find({
      where: { userId: In(subscriberUserIds) },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async refundPayment(paymentId: string, currentUser: User): Promise<Payment> {
    this.ensureAdmin(currentUser);

    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${paymentId}" not found`);
    }

    // For now, we'll use the 'FAILED' status to signify a refund.
    // A more robust system might have a 'REFUNDED' status or a separate transactions table.
    // Consider adding a new PaymentStatus.REFUNDED if this is a common operation.
    if (payment.status === PaymentStatus.COMPLETED) {
        payment.status = PaymentStatus.FAILED; // Using FAILED to indicate refund for now
        // payment.notes = `Refunded by admin ${currentUser.username} on ${new Date().toISOString()}`; // Example note
        return this.paymentRepository.save(payment);
    } else if (payment.status === PaymentStatus.FAILED) {
        throw new BadRequestException(`Payment with ID "${paymentId}" has already been refunded/failed.`);
    }
    else {
        throw new BadRequestException(`Payment with ID "${paymentId}" has status ${payment.status} and cannot be refunded.`);
    }
  }
}
