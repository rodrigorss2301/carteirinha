import { Controller, Post, Body, Get, Param, Put, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from './entities/payment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/entities/user.entity'; // Import User entity

@Controller('payments')
@UseGuards(JwtAuthGuard) // Apply JwtAuthGuard to all routes in this controller
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @Req() req) {
    const user = req.user as User; // Extract user from request
    return this.paymentsService.create(createPaymentDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const user = req.user as User; // Extract user from request
    return this.paymentsService.findOne(id, user);
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string, @Req() req) {
    const user = req.user as User; // Extract user from request
    return this.paymentsService.findAllByUser(userId, user);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: PaymentStatus, @Req() req) {
    const user = req.user as User; // Extract user from request
    return this.paymentsService.updateStatus(id, status, user);
  }
}
