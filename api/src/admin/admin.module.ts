import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../auth/entities/user.entity';
import { Payment } from '../payments/entities/payment.entity';
import { AuthModule } from '../auth/auth.module'; // To ensure JwtAuthGuard is available

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Payment]),
    AuthModule, // Make AuthModule providers available (e.g., for JwtStrategy used by JwtAuthGuard)
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
