import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  status: PaymentStatus;
}
