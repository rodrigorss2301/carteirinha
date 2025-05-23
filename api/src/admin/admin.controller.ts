import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/entities/user.entity'; // Import User entity

@Controller('admin')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats/user-roles')
  async getUserRoleCounts(@Req() req) {
    const user = req.user as User;
    return this.adminService.getUserRoleCounts(user);
  }

  @Get('stats/recent-payments')
  async getRecentPayments(@Req() req, @Query('limit') limit?: string) {
    const user = req.user as User;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.adminService.getRecentPayments(user, limitNumber);
  }

  @Get('payments/subscriber')
  async getAllSubscriberPayments(@Req() req) {
    const user = req.user as User;
    return this.adminService.getAllSubscriberPayments(user);
  }

  @Post('payments/:id/refund')
  async refundPayment(@Param('id') paymentId: string, @Req() req) {
    const user = req.user as User;
    return this.adminService.refundPayment(paymentId, user);
  }
}
